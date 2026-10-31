package com.vegasclubwear.commerce.cart;

import com.vegasclubwear.commerce.common.Money;
import com.vegasclubwear.commerce.content.StoreContent;
import java.math.BigDecimal;
import java.util.Locale;
import java.util.Map;
import org.springframework.stereotype.Component;

/**
 * Cart/order totals. Rules (mirrored in the Next.js API):
 *  - discount: VEGAS10 = 10% off; JACKPOT20 = 20% off when subtotal >= $100 (else $0)
 *  - shipping: standard is free when (subtotal - discount) >= threshold, otherwise flat rate; express is $14.95
 *  - tax: taxRate * (subtotal - discount), rounded half-up to cents
 */
@Component
public class Pricing {

    public static final BigDecimal EXPRESS_SHIPPING = new BigDecimal("14.95");

    public record Promo(String code, BigDecimal percentOff, BigDecimal minSubtotal, String description) {}

    public static final Map<String, Promo> PROMOS = Map.of(
            "VEGAS10", new Promo("VEGAS10", new BigDecimal("0.10"), BigDecimal.ZERO, "10% off your order"),
            "JACKPOT20", new Promo("JACKPOT20", new BigDecimal("0.20"), new BigDecimal("100"), "20% off orders of $100+"));

    public record Totals(BigDecimal subtotal, BigDecimal discount, BigDecimal shipping, BigDecimal tax,
                         BigDecimal total, BigDecimal freeShippingRemaining) {}

    private final StoreContent content;

    public Pricing(StoreContent content) {
        this.content = content;
    }

    public static Promo findPromo(String code) {
        return code == null ? null : PROMOS.get(code.trim().toUpperCase(Locale.ROOT));
    }

    public Totals totals(BigDecimal subtotal, int itemCount, String promoCode, String shippingMethod) {
        var settings = content.settings();
        subtotal = Money.scale(subtotal);
        BigDecimal discount = Money.ZERO;
        Promo promo = findPromo(promoCode);
        if (promo != null && subtotal.compareTo(promo.minSubtotal()) >= 0) {
            discount = Money.scale(subtotal.multiply(promo.percentOff()));
        }
        BigDecimal net = subtotal.subtract(discount);
        BigDecimal shipping;
        if (itemCount == 0) {
            shipping = Money.ZERO;
        } else if ("express".equals(shippingMethod)) {
            shipping = EXPRESS_SHIPPING;
        } else {
            shipping = net.compareTo(settings.freeShippingThreshold()) >= 0 ? Money.ZERO : Money.scale(settings.flatShipping());
        }
        BigDecimal tax = Money.scale(net.multiply(settings.taxRate()));
        BigDecimal remaining = settings.freeShippingThreshold().subtract(net).max(BigDecimal.ZERO);
        return new Totals(subtotal, discount, Money.scale(shipping), tax, Money.scale(net.add(shipping).add(tax)),
                Money.scale(remaining));
    }
}
