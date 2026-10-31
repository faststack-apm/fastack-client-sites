package com.vegasclubwear.commerce.order;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id")
    CustomerOrder order;

    Long productId;
    String sku;
    String slug;
    String name;
    String imageKey;
    String color;
    String size;
    BigDecimal unitPrice;
    int quantity;
    BigDecimal lineTotal;

    protected OrderItem() {}

    OrderItem(CustomerOrder order) {
        this.order = order;
    }
}
