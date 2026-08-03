from django.urls import path
from .views import (
    contact5,
    contact_submissions,
    cookie_login,
    cookie_logout,
    mark_contact_read,
    session_status,
)

urlpatterns = [
    path("contact5/", contact5, name="contact5"),
    path("submissions/", contact_submissions, name="contact-submissions"),
    path("submissions/<int:pk>/read/", mark_contact_read, name="mark-contact-read"),

    path("auth/login/", cookie_login, name="cookie-login"),
    path("auth/logout/", cookie_logout, name="cookie-logout"),
    path("auth/me/", session_status, name="session-status"),
]