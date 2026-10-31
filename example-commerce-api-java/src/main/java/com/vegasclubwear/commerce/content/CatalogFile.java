package com.vegasclubwear.commerce.content;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/** Shape of catalog/catalog.json produced by tools/catalog-generator. */
@JsonIgnoreProperties(ignoreUnknown = true)
public record CatalogFile(
        StoreSettings store,
        Map<String, Object> home,
        List<Map<String, Object>> menu,
        List<CategoryRow> categories,
        List<ProductRow> products) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record StoreSettings(
            String name,
            String currency,
            BigDecimal freeShippingThreshold,
            BigDecimal flatShipping,
            BigDecimal taxRate) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Rule(String scope, Boolean isNew, Boolean onSale, Boolean doorbuster, BigDecimal maxPrice, String brand) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record CategoryRow(
            String slug,
            String name,
            String parentSlug,
            String type,
            int depth,
            int sortOrder,
            String description,
            int productCount,
            Rule rule) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Color(String name, String hex) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record ProductRow(
            long id,
            String sku,
            String slug,
            String name,
            String brand,
            String categorySlug,
            List<String> categoryPath,
            String kind,
            String imageKey,
            String description,
            String material,
            BigDecimal price,
            BigDecimal compareAtPrice,
            boolean onSale,
            boolean isNew,
            boolean doorbuster,
            List<Color> colors,
            List<String> sizes,
            int stock,
            double rating,
            int reviewCount,
            String createdAt) {}
}
