from rest_framework import (
    generics,
    permissions,
)

from rest_framework.response import Response

from rest_framework.views import APIView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
)

from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth.tokens import (
    PasswordResetTokenGenerator,
)

from django.core.mail import send_mail

from django.utils.encoding import (
    force_bytes,
    force_str,
)

from django.utils.http import (
    urlsafe_base64_encode,
    urlsafe_base64_decode,
)

from .models import User

from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserSerializer,
    ForgotPasswordSerializer,
    ResetPasswordSerializer,
)

from decimal import Decimal, InvalidOperation


class RegisterView(
    generics.CreateAPIView
):

    queryset = User.objects.all()

    serializer_class = RegisterSerializer

    permission_classes = [
        permissions.AllowAny
    ]


class LoginView(
    TokenObtainPairView
):

    serializer_class = LoginSerializer

    permission_classes = [
        permissions.AllowAny
    ]


class LogoutView(APIView):

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(
        self,
        request
    ):

        refresh_token = request.data.get(
            "refresh"
        )

        if not refresh_token:

            return Response(
                {
                    "detail":
                    "Refresh token is required."
                },
                status=400
            )

        try:

            token = RefreshToken(
                refresh_token
            )

            token.blacklist()

            return Response(
                {
                    "message":
                    "Logout successful."
                }
            )

        except Exception:

            return Response(
                {
                    "detail":
                    "Invalid refresh token."
                },
                status=400
            )


class MeView(
    generics.RetrieveAPIView
):

    serializer_class = UserSerializer

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_object(
        self
    ):

        return self.request.user


class BalanceView(APIView):

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def patch(self, request):

        amount = request.data.get("amount")

        is_deduction = request.data.get(
            "is_deduction",
            True
        )

        try:

            amount = Decimal(str(amount))

        except (
            TypeError,
            ValueError,
            InvalidOperation
        ):

            return Response(
                {
                    "detail": "Valid amount is required."
                },
                status=400
            )

        if amount <= 0:

            return Response(
                {
                    "detail":
                    "Amount must be greater than zero."
                },
                status=400
            )

        user = request.user

        if is_deduction:

            if user.balance < amount:

                return Response(
                    {
                        "detail":
                        "Insufficient wallet balance."
                    },
                    status=400
                )

            user.balance -= amount

        else:

            user.balance += amount

        user.save(
            update_fields=["balance"]
        )

        return Response(
            {
                "message":
                "Balance updated successfully.",

                "balance":
                user.balance
            }
        )


# ==========================================
# FORGOT PASSWORD
# ==========================================

class ForgotPasswordView(APIView):

    permission_classes = [
        permissions.AllowAny
    ]

    def post(self, request):

        serializer = ForgotPasswordSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        email = serializer.validated_data[
            "email"
        ]

        try:

            user = User.objects.get(
                email=email
            )

        except User.DoesNotExist:

            # Don't reveal whether the email
            # exists in the database.

            return Response(
                {
                    "message":
                    "If this email is registered, "
                    "a password reset link has been sent."
                },
                status=200
            )

        # Create reset token

        token_generator = PasswordResetTokenGenerator()

        token = token_generator.make_token(
            user
        )

        # Encode user ID

        uid = urlsafe_base64_encode(
            force_bytes(user.pk)
        )

        # Frontend reset password URL

        reset_link = (
            f"http://localhost:3000/"
            f"reset-password/{uid}/{token}/"
        )

        # Send email

        send_mail(
            subject="ServiceHub - Password Reset",

            message=(
                "Hello,\n\n"
                "You requested to reset your "
                "ServiceHub password.\n\n"
                "Click the link below to reset "
                "your password:\n\n"
                f"{reset_link}\n\n"
                "If you did not request this, "
                "please ignore this email."
            ),

            from_email=None,

            recipient_list=[
                user.email
            ],

            fail_silently=False,
        )

        return Response(
            {
                "message":
                "If this email is registered, "
                "a password reset link has been sent."
            },
            status=200
        )


class ResetPasswordView(APIView):

    permission_classes = [
        permissions.AllowAny
    ]

    def post(
        self,
        request,
        uid,
        token
    ):

        serializer = ResetPasswordSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        # Decode user ID

        try:

            user_id = force_str(
                urlsafe_base64_decode(
                    uid
                )
            )

            user = User.objects.get(
                pk=user_id
            )

        except (
            TypeError,
            ValueError,
            OverflowError,
            User.DoesNotExist
        ):

            return Response(
                {
                    "detail":
                    "Invalid password reset link."
                },
                status=400
            )

        # Validate reset token

        token_generator = PasswordResetTokenGenerator()

        if not token_generator.check_token(
            user,
            token
        ):

            return Response(
                {
                    "detail":
                    "Invalid or expired password reset link."
                },
                status=400
            )

        # Set new password

        user.set_password(
            serializer.validated_data[
                "password"
            ]
        )

        user.save(
            update_fields=[
                "password"
            ]
        )

        return Response(
            {
                "message":
                "Password reset successfully."
            },
            status=200
        )