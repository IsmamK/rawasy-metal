from rest_framework.authentication import TokenAuthentication

# Name shared between the login/logout views (which set/clear it) and this
# class (which reads it). Kept in one place so they can't drift apart.
AUTH_COOKIE_NAME = "auth_token"


class CookieTokenAuthentication(TokenAuthentication):
    """
    DRF's TokenAuthentication reads the token from an `Authorization` header,
    which only works if JavaScript can read the token to attach it — exactly
    what an httpOnly cookie is designed to prevent. This subclass instead
    reads the same DRF Token from an httpOnly cookie, so the browser attaches
    it automatically on every request and the token is never exposed to page
    JavaScript at all (immune to being read by an XSS payload).

    Registered *alongside* the stock TokenAuthentication in
    REST_FRAMEWORK.DEFAULT_AUTHENTICATION_CLASSES, so header-based token auth
    (used elsewhere in the app) keeps working unchanged.
    """

    def authenticate(self, request):
        token = request.COOKIES.get(AUTH_COOKIE_NAME)
        if not token:
            return None
        return self.authenticate_credentials(token)
