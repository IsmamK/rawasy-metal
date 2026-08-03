"""One-off cleanup for media uploaded before upload-time compression existed.

Downscales and re-encodes oversized images already sitting in MEDIA_ROOT. Files
keep their original name and format, so nothing that references them — database
rows, JSON component data, already-published pages — needs updating.

Runs as a dry run by default:

    python manage.py optimize_media                # report only
    python manage.py optimize_media --apply        # rewrite files
    python manage.py optimize_media --apply --backup-dir ../media_backup
"""

import os
import shutil
from io import BytesIO

from django.conf import settings
from django.core.management.base import BaseCommand
from PIL import Image as PILImage, ImageOps, UnidentifiedImageError

# Formats we can safely rewrite in place. GIF is excluded so animations survive.
REWRITABLE_FORMATS = {"JPEG", "PNG", "WEBP"}

SAVE_OPTIONS = {
    "JPEG": {"quality": 82, "optimize": True, "progressive": True},
    "WEBP": {"quality": 82, "method": 6},
    "PNG": {"optimize": True},
}


def human(num_bytes):
    for unit in ("B", "KB", "MB", "GB"):
        if abs(num_bytes) < 1024:
            return f"{num_bytes:.0f}{unit}"
        num_bytes /= 1024
    return f"{num_bytes:.0f}TB"


class Command(BaseCommand):
    help = "Downscale and re-compress oversized images in MEDIA_ROOT, in place."

    def add_arguments(self, parser):
        parser.add_argument(
            "--apply",
            action="store_true",
            help="Actually rewrite files. Without this the command only reports.",
        )
        parser.add_argument(
            "--max-dimension",
            type=int,
            default=2000,
            help="Longest edge to keep, in pixels (default: 2000).",
        )
        parser.add_argument(
            "--min-bytes",
            type=int,
            default=200 * 1024,
            help="Skip files smaller than this (default: 200KB).",
        )
        parser.add_argument(
            "--backup-dir",
            help="Copy each original here before rewriting. Strongly recommended.",
        )

    def handle(self, *args, **options):
        apply_changes = options["apply"]
        max_dimension = options["max_dimension"]
        min_bytes = options["min_bytes"]
        backup_dir = options["backup_dir"]
        media_root = str(settings.MEDIA_ROOT)

        if not os.path.isdir(media_root):
            self.stderr.write(f"MEDIA_ROOT does not exist: {media_root}")
            return

        if apply_changes and not backup_dir:
            self.stdout.write(
                self.style.WARNING(
                    "Rewriting in place with no --backup-dir; originals cannot be recovered."
                )
            )

        total_before = total_after = converted = skipped = 0

        for dirpath, _dirnames, filenames in os.walk(media_root):
            for filename in sorted(filenames):
                path = os.path.join(dirpath, filename)
                try:
                    original_size = os.path.getsize(path)
                except OSError:
                    continue

                if original_size < min_bytes:
                    continue

                payload = self.rebuild(path, max_dimension)
                if payload is None:
                    skipped += 1
                    continue

                new_size = len(payload)
                # Only rewrite when the result is a worthwhile improvement.
                if new_size >= original_size * 0.9:
                    skipped += 1
                    continue

                relative = os.path.relpath(path, media_root)
                self.stdout.write(
                    f"  {relative}: {human(original_size)} -> {human(new_size)} "
                    f"({100 - new_size * 100 // original_size}% smaller)"
                )

                total_before += original_size
                total_after += new_size
                converted += 1

                if not apply_changes:
                    continue

                if backup_dir:
                    destination = os.path.join(backup_dir, relative)
                    os.makedirs(os.path.dirname(destination), exist_ok=True)
                    shutil.copy2(path, destination)

                # Write to a sibling temp file, then swap, so an interrupted run
                # can never leave a truncated image behind.
                temp_path = f"{path}.optimizing"
                with open(temp_path, "wb") as handle:
                    handle.write(payload)
                os.replace(temp_path, path)

        verb = "Rewrote" if apply_changes else "Would rewrite"
        saved = total_before - total_after
        self.stdout.write("")
        self.stdout.write(
            self.style.SUCCESS(
                f"{verb} {converted} file(s): {human(total_before)} -> "
                f"{human(total_after)} (saving {human(saved)}). {skipped} skipped."
            )
        )
        if converted and not apply_changes:
            self.stdout.write("Re-run with --apply --backup-dir <path> to write changes.")

    def rebuild(self, path, max_dimension):
        """Return re-encoded bytes for an oversized image, else None."""
        try:
            with open(path, "rb") as handle:
                data = handle.read()

            PILImage.open(BytesIO(data)).verify()
            image = PILImage.open(BytesIO(data))
        except (UnidentifiedImageError, OSError, ValueError):
            return None

        image_format = image.format
        if image_format not in REWRITABLE_FORMATS or getattr(image, "is_animated", False):
            return None

        image = ImageOps.exif_transpose(image)
        if max(image.size) > max_dimension:
            image.thumbnail((max_dimension, max_dimension), PILImage.LANCZOS)

        if image_format == "JPEG":
            image = image.convert("RGB")
        else:
            has_alpha = image.mode in ("RGBA", "LA") or (
                image.mode == "P" and "transparency" in image.info
            )
            image = image.convert("RGBA" if has_alpha else "RGB")

        buffer = BytesIO()
        image.save(buffer, format=image_format, **SAVE_OPTIONS[image_format])
        return buffer.getvalue()
