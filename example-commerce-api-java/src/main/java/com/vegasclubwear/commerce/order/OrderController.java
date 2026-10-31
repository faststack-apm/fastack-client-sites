package com.vegasclubwear.commerce.order;

import com.vegasclubwear.commerce.order.OrderDtos.CreateOrderRequest;
import com.vegasclubwear.commerce.order.OrderDtos.OrderView;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orders;

    public OrderController(OrderService orders) {
        this.orders = orders;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderView place(@Valid @RequestBody CreateOrderRequest req) {
        return orders.place(req);
    }

    @GetMapping("/{orderNumber}")
    public OrderView get(@PathVariable String orderNumber, @RequestParam(required = false) String email) {
        return orders.get(orderNumber, email);
    }
}
