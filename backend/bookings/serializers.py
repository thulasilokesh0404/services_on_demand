from rest_framework import serializers

from .models import Booking, Review


class BookingSerializer(
    serializers.ModelSerializer
):

    serviceName = serializers.CharField(
        source="service.name",
        read_only=True
    )

    serviceId = serializers.IntegerField(
        source="service.id",
        read_only=True
    )

    providerId = serializers.IntegerField(
        source="provider.user.id",
        read_only=True,
        allow_null=True
    )

    customerId = serializers.IntegerField(
        source="customer.id",
        read_only=True
    )

    address = serializers.SerializerMethodField()


    class Meta:

        model = Booking

        fields = [

            "id",

            "customerId",

            "serviceId",

            "serviceName",

            "providerId",

            "date",

            "time",

            "address",

            "price",

            "service_fee",

            "total",

            "payment_method",

            "status",

            "created_at",

            "completed_at",

        ]


        read_only_fields = [

            "id",
            "customerId",
            "serviceId",
            "serviceName",
            "providerId",
            "address",
            "status",
            "created_at",
            "completed_at",

        ]


    def get_address(
        self,
        obj
    ):

        return {

            "name":
                obj.address_name,

            "phone":
                obj.phone,

            "line1":
                obj.address_line,

            "city":
                obj.city,

            "pincode":
                obj.pincode,

        }


class BookingCreateSerializer(
    serializers.Serializer
):

    service_id = serializers.IntegerField()

    provider_id = serializers.IntegerField(
        required=False,
        allow_null=True
    )

    date = serializers.CharField()

    time = serializers.CharField()

    address = serializers.DictField()

    payment_method = serializers.ChoiceField(
        choices=[
            "wallet",
            "cash"
        ]
    )
    
class ReviewSerializer(serializers.ModelSerializer):

    class Meta:

        model = Review

        fields = [
            "id",
            "booking",
            "rating",
            "comment",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "booking",
            "created_at",
        ]

    def validate_rating(self, value):

        if value < 1 or value > 5:

            raise serializers.ValidationError(
                "Rating must be between 1 and 5."
            )

        return value