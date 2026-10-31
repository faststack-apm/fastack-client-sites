package com.vegasclubwear.commerce.catalog;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {

    @Id
    private Long id;
    private String sku;
    private String slug;
    private String name;
    private String brand;
    private String categorySlug;
    private String kind;
    private String imageKey;
    private String description;
    private String material;
    private BigDecimal price;
    private BigDecimal compareAtPrice;
    private boolean onSale;
    @Column(name = "is_new")
    private boolean isNew;
    private boolean doorbuster;
    private int stock;
    private double rating;
    private int reviewCount;
    private Instant createdAt;

    @ElementCollection
    @CollectionTable(name = "product_colors", joinColumns = @JoinColumn(name = "product_id"))
    @OrderColumn(name = "position")
    private List<ProductColor> colors = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "product_sizes", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "size")
    @OrderColumn(name = "position")
    private List<String> sizes = new ArrayList<>();

    /** The leaf category plus every ancestor, used for collection membership. */
    @ElementCollection
    @CollectionTable(name = "product_categories", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "category_slug")
    @OrderColumn(name = "position")
    private List<String> categoryPath = new ArrayList<>();

    protected Product() {}

    public boolean hasColor(String color) {
        return colors.stream().anyMatch(c -> c.getName().equalsIgnoreCase(color));
    }

    public boolean hasSize(String size) {
        return sizes.stream().anyMatch(s -> s.equalsIgnoreCase(size));
    }

    public String colorHex(String color) {
        return colors.stream().filter(c -> c.getName().equalsIgnoreCase(color))
                .map(ProductColor::getHex).findFirst().orElse("#999999");
    }

    public Long getId() { return id; }
    public String getSku() { return sku; }
    public String getSlug() { return slug; }
    public String getName() { return name; }
    public String getBrand() { return brand; }
    public String getCategorySlug() { return categorySlug; }
    public String getKind() { return kind; }
    public String getImageKey() { return imageKey; }
    public String getDescription() { return description; }
    public String getMaterial() { return material; }
    public BigDecimal getPrice() { return price; }
    public BigDecimal getCompareAtPrice() { return compareAtPrice; }
    public boolean isOnSale() { return onSale; }
    public boolean isNew() { return isNew; }
    public boolean isDoorbuster() { return doorbuster; }
    public int getStock() { return stock; }
    public double getRating() { return rating; }
    public int getReviewCount() { return reviewCount; }
    public Instant getCreatedAt() { return createdAt; }
    public List<ProductColor> getColors() { return colors; }
    public List<String> getSizes() { return sizes; }
    public List<String> getCategoryPath() { return categoryPath; }
}
