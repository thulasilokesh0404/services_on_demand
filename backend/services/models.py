from django.conf import settings

from django.db import models


class Service(models.Model):

    name = models.CharField(
        max_length=150
    )

    category = models.CharField(
        max_length=100
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0
    )

    reviews = models.PositiveIntegerField(
        default=0
    )

    description = models.TextField(
        blank=True
    )

    image = models.ImageField(
        upload_to="services/",
        blank=True,
        null=True
    )

    duration_minutes = models.PositiveIntegerField(
        default=120
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )


    def __str__(self):

        return self.name


class ProviderProfile(models.Model):

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="provider_profile"
    )

    services = models.ManyToManyField(
        Service,
        related_name="providers",
        blank=True
    )

    profession = models.CharField(
        max_length=100
    )

    rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0
    )

    reviews = models.PositiveIntegerField(
        default=0
    )

    jobs_done = models.PositiveIntegerField(
        default=0
    )

    bio = models.TextField(
        blank=True
    )

    image = models.ImageField(
        upload_to="providers/",
        blank=True,
        null=True
    )

    is_available = models.BooleanField(
        default=True
    )

    def __str__(self):
        return (
            f"{self.user.name} - "
            f"{self.profession}"
        )