package com.vegasclubwear.commerce.order;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class CustomerOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String orderNumber;
    String cartId;
    String status;
    String email;
    String firstName;
    String lastName;
    String address1;
    String address2;
    String city;
    String state;
    String postalCode;
    String country;
    String phone;
    String shippingMethod;
    String promoCode;
    BigDecimal subtotal;
    BigDecimal discount;
    BigDecimal shipping;
    BigDecimal tax;
    BigDecimal total;
    String cardBrand;
    String cardLast4;
    Instant createdAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    List<OrderItem> items = new ArrayList<>();

    protected CustomerOrder() {}

    CustomerOrder(String orderNumber, String cartId) {
        this.orderNumber = orderNumber;
        this.cartId = cartId;
        this.status = "confirmed";
        this.createdAt = Instant.now();
    }

    public String getOrderNumber() { return orderNumber; }
    public String getEmail() { return email; }
    public List<OrderItem> getItems() { return items; }
}
