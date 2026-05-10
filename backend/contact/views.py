from django.core.paginator import Paginator
from django.utils.dateparse import parse_date

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from .models import ContactRequest
from .serializers import ContactRequestSerializer


@api_view(["POST"])
@permission_classes([AllowAny])
def contact5(request):
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
@permission_classes([AllowAny])
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
@permission_classes([AllowAny])
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