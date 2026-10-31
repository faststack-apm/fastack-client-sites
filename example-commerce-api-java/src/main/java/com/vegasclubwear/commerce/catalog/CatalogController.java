package com.vegasclubwear.commerce.catalog;

import com.vegasclubwear.commerce.catalog.CatalogDtos.CategoryView;
import com.vegasclubwear.commerce.catalog.CatalogDtos.ProductDetail;
import com.vegasclubwear.commerce.catalog.CatalogDtos.ProductPage;
import com.vegasclubwear.commerce.content.CatalogFile;
import com.vegasclubwear.commerce.content.StoreContent;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class CatalogController {

    private final CatalogService catalog;
    private final ProductSearchService search;
    private final StoreContent content;

    public CatalogController(CatalogService catalog, ProductSearchService search, StoreContent content) {
        this.catalog = catalog;
        this.search = search;
        this.content = content;
    }

    @GetMapping("/store")
    public CatalogFile.StoreSettings store() {
        return content.settings();
    }

    @GetMapping("/menu")
    public List<Map<String, Object>> menu() {
        return content.catalog().menu();
    }

    @GetMapping("/home")
    public Map<String, Object> home() {
        return catalog.home();
    }

    @GetMapping("/categories")
    public List<CategoryView> categories() {
        return catalog.allCategories();
    }

    @GetMapping("/categories/{slug}")
    public CategoryView category(@PathVariable String slug) {
        return catalog.category(slug);
    }

    @GetMapping("/products")
    public ProductPage products(
            @RequestParam(required = false) String collection,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) List<String> color,
            @RequestParam(required = false) List<String> size,
            @RequestParam(required = false) List<String> brand,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "24") int pageSize,
            @RequestParam(defaultValue = "true") boolean facets) {
        return search.search(new ProductQuery(collection, q, color, size, brand, minPrice, maxPrice, sort,
                page, pageSize, facets));
    }

    @GetMapping("/collections/{slug}/products")
    public ProductPage collectionProducts(
            @PathVariable String slug,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) List<String> color,
            @RequestParam(required = false) List<String> size,
            @RequestParam(required = false) List<String> brand,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "24") int pageSize,
            @RequestParam(defaultValue = "true") boolean facets) {
        return products(slug, q, color, size, brand, minPrice, maxPrice, sort, page, pageSize, facets);
    }

    @GetMapping("/products/{slug}")
    public ProductDetail product(@PathVariable String slug) {
        return catalog.product(slug);
    }
}
