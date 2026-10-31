package com.vegasclubwear.commerce.order;

import com.vegasclubwear.commerce.common.ApiException;
import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.concurrent.ThreadLocalRandom;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

/**
 * Simulated card processor. Adds 80-250 ms of latency like a real gateway call.
 * Test cards: any Luhn-valid number approves; 4000 0000 0000 0002 is always declined.
 */
@Component
public class PaymentGateway {

    public static final String DECLINE_CARD = "4000000000000002";

    public record Authorization(String brand, String last4, String authCode) {}

    public Authorization authorize(OrderDtos.Payment payment, BigDecimal amount) {
        String number = payment.cardNumber().replace(" ", "");
        if (!luhn(number)) throw ApiException.badRequest("invalid_card", "Card number is invalid");
        if (YearMonth.of(payment.expYear(), payment.expMonth()).isBefore(YearMonth.now())) {
            throw ApiException.badRequest("card_expired", "Card is expired");
        }
        simulateNetworkLatency();
        if (DECLINE_CARD.equals(number)) {
            throw new ApiException(HttpStatus.PAYMENT_REQUIRED, "payment_declined", "Your card was declined");
        }
        String auth = Long.toString(ThreadLocalRandom.current().nextLong(100000, 999999));
        return new Authorization(brand(number), number.substring(number.length() - 4), auth);
    }

    static String brand(String number) {
        return switch (number.charAt(0)) {
            case '4' -> "visa";
            case '5', '2' -> "mastercard";
            case '3' -> "amex";
            case '6' -> "discover";
            default -> "card";
        };
    }

    static boolean luhn(String number) {
        int sum = 0;
        boolean dbl = false;
        for (int i = number.length() - 1; i >= 0; i--) {
            int d = number.charAt(i) - '0';
            if (d < 0 || d > 9) return false;
            if (dbl) {
                d *= 2;
                if (d > 9) d -= 9;
            }
            sum += d;
            dbl = !dbl;
        }
        return sum % 10 == 0;
    }

    private static void simulateNetworkLatency() {
        try {
            Thread.sleep(ThreadLocalRandom.current().nextLong(80, 250));
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
