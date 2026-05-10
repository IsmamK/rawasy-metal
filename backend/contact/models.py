from django.db import models


class ContactRequest(models.Model):
    name = models.CharField(max_length=150)
    phone = models.CharField(max_length=50)
    email = models.EmailField()
    description = models.TextField()

    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Contact Request"
        verbose_name_plural = "Contact Requests"

    def __str__(self):
        return f"{self.name} - {self.phone}"