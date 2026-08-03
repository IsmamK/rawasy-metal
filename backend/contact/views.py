from django.conf import settings
from django.contrib.auth import authenticate
from django.core.paginator import Paginator
from django.utils.dateparse import parse_date

from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .authentication import AUTH_COOKIE_NAME, CookieTokenAuthentication
from .models import ContactRequest
from .serializers import ContactRequestSerializer

# 14 days. The cookie is httpOnly and never read by the frontend directly —
# an expired one just means the next request 401s and the dashboard shows
# the login form again (see ShowFormsClient's 401 handling).
AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 14


@api_view(["POST"])
@permission_classes([AllowAny])
def cookie_login(request):
    username = request.data.get("username", "")
    password = request.data.get("password", "")

    user = authenticate(request, username=username, password=password)

    if user is None:
        return Response(
            {"detail": "Unable to log in with provided credentials."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    token, _ = Token.objects.get_or_create(user=user)

    response = Response({"success": True, "username": user.username})
    response.set_cookie(
        AUTH_COOKIE_NAME,
        token.key,
        max_age=AUTH_COOKIE_MAX_AGE,
        httponly=True,
        # Secure requires HTTPS, so it must stay off for local http:// dev —
        # only enforced once DEBUG is off (i.e. in production).
        secure=not settings.DEBUG,
        # "Lax" is enough here: frontend and backend are same-site (differ
        # only by port locally, or share the domain in production via the
        # reverse proxy), so the cookie is still sent on the fetch calls the
        # dashboard makes. It would need to be "None" (+ secure) only if the
        # API ever moves to a genuinely different registrable domain.
        samesite="Lax",
    )
    return response


@api_view(["POST"])
@authentication_classes([CookieTokenAuthentication])
@permission_classes([IsAuthenticated])
def cookie_logout(request):
    # Invalidate the token server-side too, not just clear the cookie — a
    # copy of the cookie captured before logout must not keep working.
    Token.objects.filter(user=request.user).delete()

    response = Response({"success": True})
    response.delete_cookie(AUTH_COOKIE_NAME)
    return response


@api_view(["GET"])
@authentication_classes([CookieTokenAuthentication])
@permission_classes([IsAuthenticated])
def session_status(request):
    # Lets the frontend re-derive "am I logged in" after a reload — the
    # cookie itself isn't readable by JS, so this is the only way the
    # in-memory AuthContext state can be rehydrated.
    return Response({"authenticated": True, "username": request.user.username})


@api_view(["POST"])
@permission_classes([AllowAny])
def contact5(request):
    print('API requests', request)
    serializer = ContactRequestSerializer(data=request.data)

    if serializer.is_valid():
        contact_request = serializer.save()

        return Response(
            {
                "success": True,
                "message": "Contact request submitted successfully.",
                "data": ContactRequestSerializer(contact_request).data,
            },
            status=status.HTTP_201_CREATED,
        )

    return Response(
        {
            "success": False,
            "message": "Please fill all required fields correctly.",
            "errors": serializer.errors,
        },
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def contact_submissions(request):
    queryset = ContactRequest.objects.all().order_by("-created_at")

    start_date = request.query_params.get("start_date")
    end_date = request.query_params.get("end_date")

    if start_date:
        parsed_start_date = parse_date(start_date)
        if parsed_start_date:
            queryset = queryset.filter(created_at__date__gte=parsed_start_date)

    if end_date:
        parsed_end_date = parse_date(end_date)
        if parsed_end_date:
            queryset = queryset.filter(created_at__date__lte=parsed_end_date)

    try:
        page_number = int(request.query_params.get("page", 1))
    except ValueError:
        page_number = 1

    try:
        page_size = int(request.query_params.get("page_size", 15))
    except ValueError:
        page_size = 15

    page_size = max(1, min(page_size, 100))

    total_count = queryset.count()
    unread_count = queryset.filter(is_read=False).count()

    paginator = Paginator(queryset, page_size)
    page_obj = paginator.get_page(page_number)

    serializer = ContactRequestSerializer(page_obj.object_list, many=True)

    return Response(
        {
            "success": True,
            "count": total_count,
            "unread_count": unread_count,
            "total_pages": paginator.num_pages,
            "current_page": page_obj.number,
            "page_size": page_size,
            "has_next": page_obj.has_next(),
            "has_previous": page_obj.has_previous(),
            "results": serializer.data,
        },
        status=status.HTTP_200_OK,
    )


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def mark_contact_read(request, pk):
    try:
        contact_request = ContactRequest.objects.get(pk=pk)
    except ContactRequest.DoesNotExist:
        return Response(
            {
                "success": False,
                "message": "Contact request not found.",
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    contact_request.is_read = True
    contact_request.save()

    return Response(
        {
            "success": True,
            "message": "Contact request marked as read.",
            "data": ContactRequestSerializer(contact_request).data,
        },
        status=status.HTTP_200_OK,
    )