package com.vegasclubwear.commerce.catalog;

import java.math.BigDecimal;
import java.util.List;

/** API response shapes for the catalog. Kept identical to the Next.js implementation. */
public final class CatalogDtos {

    private CatalogDtos() {}

    public record ColorDto(String name, String hex) {}

    public record ProductSummary(
            long id, String slug, String name, String brand, String categorySlug, String imageKey,
            BigDecimal price, BigDecimal compareAtPrice, boolean onSale, boolean isNew, boolean doorbuster,
            List<ColorDto> colors, double rating, int reviewCount, boolean inStock) {

        public static ProductSummary of(Product p) {
            return new ProductSummary(p.getId(), p.getSlug(), p.getName(), p.getBrand(), p.getCategorySlug(),
                    p.getImageKey(), p.getPrice(), p.getCompareAtPrice(), p.isOnSale(), p.isNew(), p.isDoorbuster(),
                    p.getColors().stream().map(c -> new ColorDto(c.getName(), c.getHex())).toList(),
                    p.getRating(), p.getReviewCount(), p.getStock() > 0);
        }
    }

    public record Crumb(String slug, String name) {}

    public record ProductDetail(
            long id, String sku, String slug, String name, String brand, String categorySlug, String kind,
            String imageKey, String description, String material, BigDecimal price, BigDecimal compareAtPrice,
            boolean onSale, boolean isNew, boolean doorbuster, List<ColorDto> colors, List<String> sizes,
            int stock, boolean inStock, double rating, int reviewCount, String createdAt,
            List<Crumb> breadcrumbs, List<ProductSummary> related) {}

    public record ColorFacet(String name, String hex, long count) {}

    public record ValueFacet(String value, long count) {}

    public record PriceRange(BigDecimal min, BigDecimal max) {}

    public record Facets(List<ColorFacet> colors, List<ValueFacet> sizes, List<ValueFacet> brands, PriceRange price) {}

    public record ProductPage(
            List<ProductSummary> items, int page, int pageSize, long totalItems, int totalPages, Facets facets) {}

    public record CategoryLink(String slug, String name, int productCount) {}

    public record CategoryView(
            String slug, String name, String description, String type, String parentSlug, int productCount,
            List<Crumb> breadcrumbs, List<CategoryLink> children) {}
}
