package com.vegasclubwear.commerce.cart;

import com.vegasclubwear.commerce.cart.CartDtos.AddItemRequest;
import com.vegasclubwear.commerce.cart.CartDtos.CartView;
import com.vegasclubwear.commerce.cart.CartDtos.PromoRequest;
import com.vegasclubwear.commerce.cart.CartDtos.UpdateItemRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/carts")
public class CartController {

    private final CartService carts;

    public CartController(CartService carts) {
        this.carts = carts;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CartView create() {
        return carts.create();
    }

    @GetMapping("/{cartId}")
    public CartView get(@PathVariable String cartId) {
        return carts.get(cartId);
    }

    @PostMapping("/{cartId}/items")
    public CartView addItem(@PathVariable String cartId, @Valid @RequestBody AddItemRequest req) {
        return carts.addItem(cartId, req);
    }

    @PatchMapping("/{cartId}/items/{itemId}")
    public CartView updateItem(@PathVariable String cartId, @PathVariable long itemId,
                               @Valid @RequestBody UpdateItemRequest req) {
        return carts.updateItem(cartId, itemId, req.quantity());
    }

    @DeleteMapping("/{cartId}/items/{itemId}")
    public CartView removeItem(@PathVariable String cartId, @PathVariable long itemId) {
        return carts.removeItem(cartId, itemId);
    }

    @PostMapping("/{cartId}/promo")
    public CartView applyPromo(@PathVariable String cartId, @Valid @RequestBody PromoRequest req) {
        return carts.applyPromo(cartId, req.code());
    }

    @DeleteMapping("/{cartId}/promo")
    public CartView removePromo(@PathVariable String cartId) {
        return carts.removePromo(cartId);
    }
}
