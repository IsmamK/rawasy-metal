from django.db import models
import os
from io import BytesIO

from django.core.files.base import ContentFile
from django.core.files.uploadedfile import UploadedFile
from django.utils.text import slugify
from PIL import Image as PILImage, ImageOps, UnidentifiedImageError

# Uploads were previously stored exactly as received, which put multi-megabyte
# camera images and screenshots straight onto the page. Anything Pillow can
# decode as a still raster image is downscaled and re-encoded as WebP on the way
# in; everything else (video, SVG, animated GIF) is stored untouched.
MAX_IMAGE_DIMENSION = 2000
WEBP_QUALITY = 82
COMPRESSIBLE_FORMATS = {"JPEG", "PNG", "BMP", "TIFF", "MPO", "WEBP"}


def compress_upload_to_webp(uploaded_file):
    """Downscale and re-encode a still raster upload as WebP.

    Returns a ContentFile, or None when the upload is not a still raster image
    and should be stored as-is.
    """
    try:
        uploaded_file.seek(0)
        PILImage.open(uploaded_file).verify()  # verify() consumes the handle
        uploaded_file.seek(0)
        image = PILImage.open(uploaded_file)
    except (UnidentifiedImageError, OSError, ValueError):
        return None

    if image.format not in COMPRESSIBLE_FORMATS or getattr(image, "is_animated", False):
        return None

    image = ImageOps.exif_transpose(image)

    if max(image.size) > MAX_IMAGE_DIMENSION:
        image.thumbnail((MAX_IMAGE_DIMENSION, MAX_IMAGE_DIMENSION), PILImage.LANCZOS)

    has_alpha = image.mode in ("RGBA", "LA") or (
        image.mode == "P" and "transparency" in image.info
    )
    image = image.convert("RGBA" if has_alpha else "RGB")

    buffer = BytesIO()
    image.save(buffer, format="WEBP", quality=WEBP_QUALITY, method=6)
    return ContentFile(buffer.getvalue())


# Create your models here.

from django.db import models

class ComponentData(models.Model):
    name = models.CharField(max_length=255, unique=True)  # Component identifier
    data = models.JSONField()  # Use the built-in JSONField
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

# contacts/models.py
from django.db import models
# models.py
from django.db import models
from django.utils import timezone

class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    is_read = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Contact Message'
        verbose_name_plural = 'Contact Messages'
    
    def __str__(self):
        return f"{self.name} - {self.subject} ({self.created_at.strftime('%Y-%m-%d')})"


from django.db import models
from datetime import datetime
class MedicalReport(models.Model):
    passport_number = models.CharField(max_length=100, unique=True)
    medical_report = models.FileField(upload_to="medical_reports/")
    uploaded_at = models.DateTimeField(auto_now_add=True,null=True,blank=True)

    def __str__(self):
        return f"Report for {self.passport_number}"


# models.py
from django.db import models
from datetime import datetime


# Form Model
class Form(models.Model):
    FORM_TYPES = (
        ('demand_submission', 'Demand Submission'),
        ('agent_registration', 'Agent Registration'),
        ('worker_registration', 'Worker Registration'),
        ('apply_now', 'Apply Now'),

    )
    
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    form_type = models.CharField(choices=FORM_TYPES, max_length=50)
    payment_amount = models.DecimalField(max_digits=10,decimal_places=2,default=0,blank=True)
    def __str__(self):
        return self.name


from django.db import models

class FormField(models.Model):
    FIELD_TYPE_CHOICES = [
        ('text', 'Text'),
        ('email', 'Email'),
        ('phone', 'Phone'),
        ('image', 'Image'),
        ('file', 'File'),
        ('textarea', 'TextArea'),
        ('select', 'Select'),
        ('checkbox', 'Checkbox'),
        ('radio', 'Radio'),
    ]

    is_job_field = models.BooleanField(default=False)  # Mark if this is a job-related select field
    form = models.ForeignKey(Form, related_name='fields', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    field_type = models.CharField(max_length=10, choices=FIELD_TYPE_CHOICES)
    required = models.BooleanField(default=True)
    # JSONField to store options for choice-based fields
    options = models.JSONField(null=True, blank=True, help_text="Options for choice/select fields. Example: [{'value': 'Option 1'}, {'value': 'Option 2'}]")
    priority = models.PositiveIntegerField(default=0, help_text="Priority for ordering the fields.")
    file = models.FileField(upload_to='uploads/%Y/%m/%d/', null=True, blank=True)
    
    class Meta:
        ordering = ['priority'] 

    def __str__(self):
        return self.name


# FormResponse Model
class FormResponse(models.Model):
    submitted_at = models.DateTimeField(auto_now_add=True)
    form = models.ForeignKey(Form, related_name='responses', on_delete=models.CASCADE)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Response for {self.form.name} at {self.submitted_at}"

# FieldResponse Model
class FieldResponse(models.Model):

    form_response = models.ForeignKey(FormResponse, related_name='field_responses', on_delete=models.CASCADE)
    form_field = models.ForeignKey(FormField, related_name='field_responses', on_delete=models.CASCADE)
    value = models.TextField()
    file = models.FileField(upload_to='form_responses/', null=True, blank=True)

    def __str__(self):
        return f"Response for {self.form_field.name}"



from django.db import models

class Job(models.Model):
    title = models.CharField(max_length=255,null=True, blank=True)
    city = models.CharField(max_length=100,null=True, blank=True)
    country = models.CharField(max_length=100,null=True, blank=True)
    industry = models.CharField(max_length=100,null=True, blank=True)
    requirements = models.TextField(null=True, blank=True)
    poster = models.ImageField(upload_to='job_posters/', null=True, blank=True)  # Poster image
    
    def __str__(self):
        return self.title

from django.db import models

class UploadedImage(models.Model):
    category = models.CharField(max_length=255)
    image = models.FileField(upload_to="uploaded_images/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.image.name} - {self.category}"
        
    def save(self, *args, **kwargs):
        # Renaming only ever applies to a file being uploaded right now. Reading
        # `_file`/`_committed` directly avoids `.file`, which lazily opens the
        # stored file and raises when a row's media is missing from disk. And
        # re-saving an existing row must leave its stored path alone — slugify
        # strips the directory separators, so running it over an already-stored
        # path corrupts the reference.
        pending_upload = (
            getattr(self.image, "_file", None)
            if self.image and not getattr(self.image, "_committed", True)
            else None
        )

        if pending_upload is not None:
            # Ensure the filename is not too long
            base_filename, ext = os.path.splitext(os.path.basename(self.image.name))
            max_filename_length = 100  # Maximum allowed length for filename

            # Truncate filename if it's too long
            if len(base_filename) > max_filename_length:
                base_filename = base_filename[:max_filename_length]

            compressed = (
                compress_upload_to_webp(pending_upload)
                if isinstance(pending_upload, UploadedFile)
                else None
            )

            if compressed is not None:
                # Let the storage backend apply upload_to and resolve collisions.
                self.image.save(
                    f"{slugify(base_filename)}.webp", compressed, save=False
                )
            else:
                # Not a still image (video, SVG, animated GIF): store as received.
                self.image.name = f"uploaded_images/{slugify(base_filename)}{ext}"

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.image.name} - {self.category}"


from django.db import models

from django.db import models
from django.utils.timezone import now, timedelta

class BkashToken(models.Model):
    id_token = models.TextField()
    refresh_token = models.TextField()
    expires_at = models.DateTimeField()

    def is_expired(self):
        return now() >= self.expires_at

from django.db import models

class Payment(models.Model):
    form_response = models.ForeignKey(FormResponse, related_name='payments', on_delete=models.CASCADE,null=True,blank=True)
    payment_id = models.CharField(max_length=255, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment {self.payment_id} for {self.form_response}"


class Product:
    def __init__(self, name, price, description):
        self.name = name
        self.price = price
        self.description = description

    def __str__(self):
        return f"{self.name} - {self.price} - {self.description}"
    
from django.db import models

class JobApplication(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    position = models.CharField(max_length=100)
    cover_letter = models.TextField(blank=True)
    resume = models.FileField(upload_to='resumes/')  # Add upload_to parameter
    applied_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.position}"
