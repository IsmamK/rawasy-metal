from django.contrib import admin
from .models import ContactRequest


@admin.register(ContactRequest)
class ContactRequestAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "phone",
        "email",
        "is_read",
        "created_at",
    )
    list_filter = ("is_read", "created_at")
    search_fields = ("name", "phone", "email", "description")
    readonly_fields = ("created_at",)
    ordering = ("-created_at",)