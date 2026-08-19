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

from .models import User

from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserSerializer,
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

        except (TypeError, ValueError, InvalidOperation):

            return Response(
                {
                    "detail": "Valid amount is required."
                },
                status=400
            )

        if amount <= 0:

            return Response(
                {
                    "detail": "Amount must be greater than zero."
                },
                status=400
            )

        user = request.user

        if is_deduction:

            if user.balance < amount:

                return Response(
                    {
                        "detail": "Insufficient wallet balance."
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
                "message": "Balance updated successfully.",
                "balance": user.balance
            }
        )