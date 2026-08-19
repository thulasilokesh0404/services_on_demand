from django.conf import settings

from django.db import models

from services.models import (
    Service,
    ProviderProfile,
)


class Booking(models.Model):

    STATUS_CHOICES = [

        (
            "Confirmed",
            "Confirmed"
        ),

        (
            "Completed",
            "Completed"
        ),

        (
            "Cancelled",
            "Cancelled"
        ),

    ]


    PAYMENT_CHOICES = [

        (
            "wallet",
            "Wallet"
        ),

        (
            "cash",
            "Cash"
        ),

    ]


    id = models.CharField(
        max_length=20,
        primary_key=True
    )


    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="customer_bookings"
    )


    service = models.ForeignKey(
        Service,
        on_delete=models.PROTECT,
        related_name="bookings"
    )


    provider = models.ForeignKey(
        ProviderProfile,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="bookings"
    )


    date = models.CharField(
        max_length=50
    )


    time = models.CharField(
        max_length=30
    )


    address_name = models.CharField(
        max_length=150
    )


    phone = models.CharField(
        max_length=20
    )


    address_line = models.CharField(
        max_length=255
    )


    city = models.CharField(
        max_length=100
    )


    pincode = models.CharField(
        max_length=10
    )


    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )


    service_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=50
    )


    total = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )


    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_CHOICES
    )


    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Confirmed"
    )


    created_at = models.DateTimeField(
        auto_now_add=True
    )


    completed_at = models.DateTimeField(
        null=True,
        blank=True
    )


    class Meta:

        ordering = [
            "-created_at"
        ]


    def __str__(self):

        return self.id