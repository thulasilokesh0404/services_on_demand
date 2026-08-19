from rest_framework import serializers

from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
)

from .models import User


class UserSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = User

        fields = [
            "id",
            "name",
            "email",
            "phone",
            "role",
            "balance",
        ]


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        min_length=6
    )

    phone = serializers.CharField(
        required=True,
        allow_blank=False
    )

    class Meta:
        model = User

        fields = [
            "name",
            "email",
            "password",
            "phone",
            "role",
        ]

    def validate_phone(self, value):

        value = value.strip()

        # Exactly 10 digits
        if len(value) != 10:
            raise serializers.ValidationError(
                "Mobile number must be exactly 10 digits."
            )

        # Only digits
        if not value.isdigit():
            raise serializers.ValidationError(
                "Mobile number must contain only digits."
            )

        # Must start with 6, 7, 8 or 9
        if value[0] not in "6789":
            raise serializers.ValidationError(
                "Mobile number must start with 6, 7, 8, or 9."
            )

        # Unique phone number
        if User.objects.filter(phone=value).exists():
            raise serializers.ValidationError(
                "This mobile number is already registered."
            )

        return value

    def validate_email(self, value):

        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "An account with this email already exists."
            )

        return value

    def create(self, validated_data):

        return User.objects.create_user(
            **validated_data
        )


class LoginSerializer(TokenObtainPairSerializer):

    username_field = "email"

    @classmethod
    def get_token(cls, user):

        token = super().get_token(user)

        token["user_id"] = user.id
        token["name"] = user.name
        token["role"] = user.role
        token["email"] = user.email

        return token

    def validate(self, attrs):

        data = super().validate(attrs)

        return {
            "message": "Login successful",
            "refresh": data["refresh"],
            "access": data["access"],
        }