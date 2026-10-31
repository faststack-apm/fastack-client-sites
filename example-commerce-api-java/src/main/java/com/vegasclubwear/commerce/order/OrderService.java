package com.vegasclubwear.commerce.order;

import com.vegasclubwear.commerce.cart.Cart;
import com.vegasclubwear.commerce.cart.CartItem;
import com.vegasclubwear.commerce.cart.CartService;
import com.vegasclubwear.commerce.cart.Pricing;
import com.vegasclubwear.commerce.catalog.Product;
import com.vegasclubwear.commerce.catalog.ProductRepository;
import com.vegasclubwear.commerce.common.ApiException;
import com.vegasclubwear.commerce.common.Money;
import com.vegasclubwear.commerce.order.OrderDtos.Address;
import com.vegasclubwear.commerce.order.OrderDtos.CreateOrderRequest;
import com.vegasclubwear.commerce.order.OrderDtos.OrderLine;
import com.vegasclubwear.commerce.order.OrderDtos.OrderView;
import java.math.BigDecimal;
import java.util.concurrent.ThreadLocalRandom;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository orders;
    private final CartService carts;
    private final ProductRepository products;
    private final Pricing pricing;
    private final PaymentGateway payments;

    public OrderService(OrderRepository orders, CartService carts, ProductRepository products, Pricing pricing,
                        PaymentGateway payments) {
        this.orders = orders;
        this.carts = carts;
        this.products = products;
        this.pricing = pricing;
        this.payments = payments;
    }

    @Transactional
    public OrderView place(CreateOrderRequest req) {
        Cart cart = carts.findOpen(req.cartId());
        if (cart.getItems().isEmpty()) throw ApiException.badRequest("empty_cart", "Cart is empty");
        String method = req.shippingMethod() == null ? "standard" : req.shippingMethod();
        Pricing.Totals totals = pricing.totals(CartService.subtotal(cart.getItems()),
                CartService.itemCount(cart.getItems()), cart.getPromoCode(), method);

        // Reserve inventory first; any shortfall rolls back the whole transaction.
        for (CartItem item : cart.getItems()) {
            if (products.decrementStock(item.getProduct().getId(), item.getQuantity()) == 0) {
                throw ApiException.conflict("insufficient_stock",
                        "Not enough stock for " + item.getProduct().getName());
            }
        }
        PaymentGateway.Authorization auth = payments.authorize(req.payment(), totals.total());

        CustomerOrder order = new CustomerOrder(nextOrderNumber(), cart.getId());
        Address a = req.shippingAddress();
        order.email = req.email();
        order.firstName = a.firstName();
        order.lastName = a.lastName();
        order.address1 = a.address1();
        order.address2 = a.address2();
        order.city = a.city();
        order.state = a.state();
        order.postalCode = a.postalCode();
        order.country = a.country();
        order.phone = a.phone();
        order.shippingMethod = method;
        order.promoCode = totals.discount().signum() > 0 ? cart.getPromoCode() : null;
        order.subtotal = totals.subtotal();
        order.discount = totals.discount();
        order.shipping = totals.shipping();
        order.tax = totals.tax();
        order.total = totals.total();
        order.cardBrand = auth.brand();
        order.cardLast4 = auth.last4();
        for (CartItem item : cart.getItems()) {
            Product p = item.getProduct();
            OrderItem oi = new OrderItem(order);
            oi.productId = p.getId();
            oi.sku = p.getSku();
            oi.slug = p.getSlug();
            oi.name = p.getName();
            oi.imageKey = p.getImageKey();
            oi.color = item.getColor();
            oi.size = item.getSize();
            oi.unitPrice = p.getPrice();
            oi.quantity = item.getQuantity();
            oi.lineTotal = Money.scale(p.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            order.items.add(oi);
        }
        orders.save(order);
        cart.setStatus(Cart.CONVERTED);
        cart.touch();
        log.info("Order {} placed: {} items, total {}", order.orderNumber, order.items.size(), order.total);
        return view(order);
    }

    @Transactional(readOnly = true)
    public OrderView get(String orderNumber, String email) {
        CustomerOrder order = orders.findByOrderNumber(orderNumber)
                .filter(o -> email == null || o.getEmail().equalsIgnoreCase(email))
                .orElseThrow(() -> ApiException.notFound("Order", orderNumber));
        return view(order);
    }

    private String nextOrderNumber() {
        String n;
        do {
            n = "VC" + ThreadLocalRandom.current().nextInt(10_000_000, 99_999_999);
        } while (orders.existsByOrderNumber(n));
        return n;
    }

    private OrderView view(CustomerOrder o) {
        var lines = o.items.stream().map(i -> new OrderLine(i.productId, i.sku, i.slug, i.name, i.imageKey, i.color,
                i.size, i.unitPrice, i.quantity, i.lineTotal)).toList();
        int count = o.items.stream().mapToInt(i -> i.quantity).sum();
        return new OrderView(o.orderNumber, o.status, o.email, o.createdAt.toString(), lines, count,
                new Address(o.firstName, o.lastName, o.address1, o.address2, o.city, o.state, o.postalCode,
                        o.country, o.phone),
                o.shippingMethod, o.promoCode, o.subtotal, o.discount, o.shipping, o.tax, o.total, o.cardBrand,
                o.cardLast4);
    }
}
