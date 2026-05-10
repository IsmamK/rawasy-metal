from django.urls import path
from .views import contact5, contact_submissions, mark_contact_read

urlpatterns = [
    path("contact5/", contact5, name="contact5"),
    path("submissions/", contact_submissions, name="contact-submissions"),
    path("submissions/<int:pk>/read/", mark_contact_read, name="mark-contact-read"),
]