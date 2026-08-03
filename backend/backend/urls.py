import re

from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.views.static import serve


urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/", include("api.urls")),

    # Contact form endpoint
    path("api/contact/", include("contact.urls")),

    path("auth/", include("djoser.urls")),
    path("auth/", include("djoser.urls.authtoken")),
]


# Media serving.
#
# This used to use `django.conf.urls.static.static()`, which returns an empty
# list whenever DEBUG is False — so switching DEBUG off for production silently
# broke every uploaded image. Serving is now controlled by its own setting, so
# the security switch and the "who serves files" decision are independent.
#
# In front of a reverse proxy or CDN, set SERVE_MEDIA_FROM_DJANGO=false: Django
# occupies a worker for the whole of each file transfer and has no edge cache.
if settings.SERVE_MEDIA_FROM_DJANGO:
    media_prefix = re.escape(str(settings.MEDIA_URL).lstrip("/"))
    urlpatterns += [
        re_path(
            r"^%s(?P<path>.*)$" % media_prefix,
            serve,
            {"document_root": settings.MEDIA_ROOT},
        ),
    ]
