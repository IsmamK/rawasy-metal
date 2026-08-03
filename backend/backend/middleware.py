"""Project-wide HTTP middleware."""

from django.conf import settings


class MediaCacheControlMiddleware:
    """Attach long-lived cache headers to uploaded media responses.

    Django served /media/ with no `Cache-Control` at all, so browsers
    revalidated (or re-downloaded) every image on every page view.

    Uploaded filenames are effectively immutable — Django's storage appends a
    random suffix rather than overwriting an existing file — so a long max-age
    with `immutable` is safe: a changed image is a new URL.

    This is a stopgap that keeps working no matter who serves the files. Once a
    reverse proxy or CDN fronts /media/, it will set its own headers and this
    middleware simply stops seeing those requests.
    """

    def __init__(self, get_response):
        self.get_response = get_response
        self.media_url = getattr(settings, "MEDIA_URL", "/media/") or "/media/"
        self.max_age = getattr(settings, "MEDIA_CACHE_MAX_AGE", 31536000)

    def __call__(self, request):
        response = self.get_response(request)

        if not request.path.startswith(self.media_url):
            return response

        # Never cache an error page under the media prefix.
        if response.status_code != 200:
            return response

        response["Cache-Control"] = f"public, max-age={self.max_age}, immutable"
        return response
