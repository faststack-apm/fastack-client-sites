package com.vegasclubwear.commerce.catalog;

import java.math.BigDecimal;
import java.util.List;

/** Listing/search parameters. page is 1-based. */
public record ProductQuery(
        String collection,
        String q,
        List<String> colors,
        List<String> sizes,
        List<String> brands,
        BigDecimal minPrice,
        BigDecimal maxPrice,
        String sort,
        int page,
        int pageSize,
        boolean includeFacets) {

    public static final int MAX_PAGE_SIZE = 96;

    public ProductQuery {
        colors = colors == null ? List.of() : colors;
        sizes = sizes == null ? List.of() : sizes;
        brands = brands == null ? List.of() : brands;
        sort = sort == null || sort.isBlank() ? "featured" : sort;
        page = Math.max(1, page);
        pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, pageSize));
    }

    public static ProductQuery top(String collection, int size) {
        return new ProductQuery(collection, null, null, null, null, null, null, "featured", 1, size, false);
    }
}
