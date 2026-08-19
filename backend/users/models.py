from django.db import models

from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    BaseUserManager,
)


class UserManager(BaseUserManager):

    def create_user(
        self,
        email,
        name,
        password=None,
        role="customer",
        **extra_fields
    ):

        if not email:
            raise ValueError(
                "Email is required"
            )

        email = self.normalize_email(email)

        user = self.model(
            email=email,
            name=name,
            role=role,
            **extra_fields
        )

        user.set_password(password)

        user.save(
            using=self._db
        )

        return user


    def create_superuser(
        self,
        email,
        name,
        password=None,
        **extra_fields
    ):

        user = self.create_user(
            email=email,
            name=name,
            password=password,
            role="admin",
            **extra_fields
        )

        user.is_staff = True

        user.is_superuser = True

        user.is_active = True

        user.save(
            using=self._db
        )

        return user


class User(
    AbstractBaseUser,
    PermissionsMixin
):

    ROLE_CHOICES = [

        (
            "customer",
            "Customer"
        ),

        (
            "provider",
            "Provider"
        ),

        (
            "admin",
            "Admin"
        ),
    ]


    email = models.EmailField(
        unique=True
    )

    name = models.CharField(
        max_length=150
    )

    phone = models.CharField(
    max_length=10,
    blank=True,
    null=True,
    unique=True
)

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="customer"
    )

    balance = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=1000
    )

    is_active = models.BooleanField(
        default=True
    )

    is_staff = models.BooleanField(
        default=False
    )

    date_joined = models.DateTimeField(
        auto_now_add=True
    )


    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = ["name"]


    objects = UserManager()


    def __str__(self):

        return self.email