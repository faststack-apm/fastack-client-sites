package com.vegasclubwear.commerce.common;

import java.math.BigDecimal;
import java.math.RoundingMode;

public final class Money {

    public static final BigDecimal ZERO = scale(BigDecimal.ZERO);

    private Money() {}

    public static BigDecimal scale(BigDecimal value) {
        return value.setScale(2, RoundingMode.HALF_UP);
    }

    public static BigDecimal of(double value) {
        return scale(BigDecimal.valueOf(value));
    }
}
