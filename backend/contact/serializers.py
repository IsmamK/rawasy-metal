from rest_framework import serializers
from .models import ContactRequest


class ContactRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactRequest
        fields = [
            "id",
            "name",
            "phone",
            "email",
            "description",
            "is_read",
            "created_at",
        ]
        read_only_fields = ["id", "is_read", "created_at"]

    def validate_name(self, value):
        value = str(value).strip()
        if not value:
            raise serializers.ValidationError("Name is required.")
        return value

    def validate_phone(self, value):
        value = str(value).strip()
        if not value:
            raise serializers.ValidationError("Phone number is required.")
        return value

    def validate_email(self, value):
        value = str(value).strip()
        if not value:
            raise serializers.ValidationError("Email is required.")
        return value

    def validate_description(self, value):
        value = str(value).strip()
        if not value:
            raise serializers.ValidationError("Description is required.")
        return value