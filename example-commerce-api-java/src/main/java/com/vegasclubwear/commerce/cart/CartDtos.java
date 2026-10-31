package com.vegasclubwear.commerce.cart;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

public final class CartDtos {

    private CartDtos() {}

    public record AddItemRequest(
            @NotNull Long productId,
            @NotBlank String color,
            @NotBlank String size,
            @NotNull @Min(1) @Max(20) Integer quantity) {}

    public record UpdateItemRequest(@NotNull @Min(0) @Max(20) Integer quantity) {}

    public record PromoRequest(@NotBlank String code) {}

    public record CartLine(
            long id, long productId, String slug, String name, String brand, String imageKey, String color,
            String colorHex, String size, BigDecimal unitPrice, BigDecimal compareAtPrice, int quantity,
            BigDecimal lineTotal, int available) {}

    public record CartView(
            String id, String status, List<CartLine> items, int itemCount, String promoCode, String promoDescription,
            BigDecimal subtotal, BigDecimal discount, BigDecimal shipping, BigDecimal tax, BigDecimal total,
            BigDecimal freeShippingRemaining, String updatedAt) {}
}
