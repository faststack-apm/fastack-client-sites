package com.vegasclubwear.commerce.cart;

import com.vegasclubwear.commerce.cart.CartDtos.AddItemRequest;
import com.vegasclubwear.commerce.cart.CartDtos.CartLine;
import com.vegasclubwear.commerce.cart.CartDtos.CartView;
import com.vegasclubwear.commerce.catalog.Product;
import com.vegasclubwear.commerce.catalog.ProductRepository;
import com.vegasclubwear.commerce.common.ApiException;
import com.vegasclubwear.commerce.common.Money;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CartService {

    public static final int MAX_LINE_QUANTITY = 20;

    private final CartRepository carts;
    private final ProductRepository products;
    private final Pricing pricing;

    public CartService(CartRepository carts, ProductRepository products, Pricing pricing) {
        this.carts = carts;
        this.products = products;
        this.pricing = pricing;
    }

    public CartView create() {
        return view(carts.save(Cart.create()));
    }

    @Transactional(readOnly = true)
    public CartView get(String id) {
        return view(find(id));
    }

    public CartView addItem(String cartId, AddItemRequest req) {
        Cart cart = findOpen(cartId);
        Product product = products.findById(req.productId())
                .orElseThrow(() -> ApiException.notFound("Product", req.productId()));
        if (!product.hasColor(req.color())) {
            throw ApiException.badRequest("invalid_color", "Color '" + req.color() + "' is not available for " + product.getName());
        }
        if (!product.hasSize(req.size())) {
            throw ApiException.badRequest("invalid_size", "Size '" + req.size() + "' is not available for " + product.getName());
        }
        CartItem line = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(product.getId())
                        && i.getColor().equalsIgnoreCase(req.color()) && i.getSize().equalsIgnoreCase(req.size()))
                .findFirst().orElse(null);
        int newQty = (line == null ? 0 : line.getQuantity()) + req.quantity();
        checkStock(product, newQty);
        if (line == null) {
            cart.getItems().add(new CartItem(cart, product, req.color(), req.size(), req.quantity()));
        } else {
            line.setQuantity(newQty);
        }
        cart.touch();
        return view(carts.saveAndFlush(cart));
    }

    public CartView updateItem(String cartId, long itemId, int quantity) {
        Cart cart = findOpen(cartId);
        CartItem line = line(cart, itemId);
        if (quantity == 0) {
            cart.getItems().remove(line);
        } else {
            checkStock(line.getProduct(), quantity);
            line.setQuantity(quantity);
        }
        cart.touch();
        return view(carts.saveAndFlush(cart));
    }

    public CartView removeItem(String cartId, long itemId) {
        return updateItem(cartId, itemId, 0);
    }

    public CartView applyPromo(String cartId, String code) {
        Cart cart = findOpen(cartId);
        Pricing.Promo promo = Pricing.findPromo(code);
        if (promo == null) throw ApiException.badRequest("invalid_promo", "Promo code '" + code + "' is not valid");
        cart.setPromoCode(promo.code());
        cart.touch();
        return view(carts.save(cart));
    }

    public CartView removePromo(String cartId) {
        Cart cart = findOpen(cartId);
        cart.setPromoCode(null);
        cart.touch();
        return view(carts.save(cart));
    }

    public Cart find(String id) {
        return carts.findById(id).orElseThrow(() -> ApiException.notFound("Cart", id));
    }

    public Cart findOpen(String id) {
        Cart cart = find(id);
        if (!Cart.OPEN.equals(cart.getStatus())) {
            throw ApiException.conflict("cart_closed", "Cart " + id + " has already been checked out");
        }
        return cart;
    }

    public static BigDecimal subtotal(List<CartItem> items) {
        return items.stream()
                .map(i -> i.getProduct().getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(Money.ZERO, BigDecimal::add);
    }

    public static int itemCount(List<CartItem> items) {
        return items.stream().mapToInt(CartItem::getQuantity).sum();
    }

    public CartView view(Cart cart) {
        List<CartLine> lines = cart.getItems().stream().map(i -> {
            Product p = i.getProduct();
            return new CartLine(i.getId(), p.getId(), p.getSlug(), p.getName(), p.getBrand(), p.getImageKey(),
                    i.getColor(), p.colorHex(i.getColor()), i.getSize(), p.getPrice(), p.getCompareAtPrice(),
                    i.getQuantity(), Money.scale(p.getPrice().multiply(BigDecimal.valueOf(i.getQuantity()))),
                    p.getStock());
        }).toList();
        int count = itemCount(cart.getItems());
        Pricing.Totals t = pricing.totals(subtotal(cart.getItems()), count, cart.getPromoCode(), "standard");
        Pricing.Promo promo = Pricing.findPromo(cart.getPromoCode());
        return new CartView(cart.getId(), cart.getStatus(), lines, count, cart.getPromoCode(),
                promo == null ? null : promo.description(), t.subtotal(), t.discount(), t.shipping(), t.tax(),
                t.total(), t.freeShippingRemaining(), cart.getUpdatedAt().toString());
    }

    private CartItem line(Cart cart, long itemId) {
        return cart.getItems().stream().filter(i -> i.getId() == itemId).findFirst()
                .orElseThrow(() -> ApiException.notFound("Cart item", itemId));
    }

    private void checkStock(Product product, int quantity) {
        if (quantity > MAX_LINE_QUANTITY) {
            throw ApiException.badRequest("quantity_limit", "Maximum " + MAX_LINE_QUANTITY + " per item");
        }
        if (product.getStock() < quantity) {
            throw ApiException.conflict("insufficient_stock",
                    "Only " + product.getStock() + " left of " + product.getName());
        }
    }
}
