package com.vegasclubwear.commerce.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.math.BigDecimal;
import java.util.List;

public final class OrderDtos {

    private OrderDtos() {}

    public record Address(
            @NotBlank String firstName,
            @NotBlank String lastName,
            @NotBlank String address1,
            String address2,
            @NotBlank String city,
            @NotBlank String state,
            @NotBlank String postalCode,
            @NotBlank @Pattern(regexp = "[A-Z]{2}") String country,
            String phone) {}

    public record Payment(
            @NotBlank @Pattern(regexp = "[0-9 ]{12,23}") String cardNumber,
            @NotNull @Min(1) @Max(12) Integer expMonth,
            @NotNull @Min(2000) @Max(2100) Integer expYear,
            @NotBlank @Pattern(regexp = "[0-9]{3,4}") String cvc,
            @NotBlank String nameOnCard) {}

    public record CreateOrderRequest(
            @NotBlank String cartId,
            @NotBlank @Email String email,
            @NotNull @Valid Address shippingAddress,
            @Pattern(regexp = "standard|express") String shippingMethod,
            @NotNull @Valid Payment payment) {}

    public record OrderLine(long productId, String sku, String slug, String name, String imageKey, String color,
                            String size, BigDecimal unitPrice, int quantity, BigDecimal lineTotal) {}

    public record OrderView(
            String orderNumber, String status, String email, String createdAt, List<OrderLine> items, int itemCount,
            Address shippingAddress, String shippingMethod, String promoCode, BigDecimal subtotal, BigDecimal discount,
            BigDecimal shipping, BigDecimal tax, BigDecimal total, String cardBrand, String cardLast4) {}
}
