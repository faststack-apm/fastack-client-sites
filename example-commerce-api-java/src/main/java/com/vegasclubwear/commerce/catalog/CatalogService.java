package com.vegasclubwear.commerce.catalog;

import com.vegasclubwear.commerce.catalog.CatalogDtos.CategoryLink;
import com.vegasclubwear.commerce.catalog.CatalogDtos.CategoryView;
import com.vegasclubwear.commerce.catalog.CatalogDtos.ColorDto;
import com.vegasclubwear.commerce.catalog.CatalogDtos.Crumb;
import com.vegasclubwear.commerce.catalog.CatalogDtos.ProductDetail;
import com.vegasclubwear.commerce.catalog.CatalogDtos.ProductSummary;
import com.vegasclubwear.commerce.common.ApiException;
import com.vegasclubwear.commerce.content.StoreContent;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class CatalogService {

    private final CategoryRepository categories;
    private final ProductRepository products;
    private final ProductSearchService search;
    private final StoreContent content;

    public CatalogService(CategoryRepository categories, ProductRepository products,
                          ProductSearchService search, StoreContent content) {
        this.categories = categories;
        this.products = products;
        this.search = search;
        this.content = content;
    }

    public List<CategoryView> allCategories() {
        Map<String, Category> all = categoryMap();
        return all.values().stream().map(c -> view(c, all)).toList();
    }

    public CategoryView category(String slug) {
        Map<String, Category> all = categoryMap();
        Category c = all.get(slug);
        if (c == null) throw ApiException.notFound("Collection", slug);
        return view(c, all);
    }

    public ProductDetail product(String slug) {
        Product p = products.findBySlug(slug).orElseThrow(() -> ApiException.notFound("Product", slug));
        Map<String, Category> all = categoryMap();
        List<ProductSummary> related = products
                .findByCategorySlugAndIdNotOrderByReviewCountDesc(p.getCategorySlug(), p.getId(), PageRequest.of(0, 8))
                .stream().map(ProductSummary::of).toList();
        return new ProductDetail(p.getId(), p.getSku(), p.getSlug(), p.getName(), p.getBrand(), p.getCategorySlug(),
                p.getKind(), p.getImageKey(), p.getDescription(), p.getMaterial(), p.getPrice(), p.getCompareAtPrice(),
                p.isOnSale(), p.isNew(), p.isDoorbuster(),
                p.getColors().stream().map(c -> new ColorDto(c.getName(), c.getHex())).toList(),
                List.copyOf(p.getSizes()), p.getStock(), p.getStock() > 0, p.getRating(), p.getReviewCount(),
                p.getCreatedAt().toString(), breadcrumbs(all.get(p.getCategorySlug()), all), related);
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> home() {
        Map<String, Object> home = new LinkedHashMap<>(content.catalog().home());
        List<Map<String, Object>> sections = new ArrayList<>();
        for (Map<String, Object> section : (List<Map<String, Object>>) home.get("sections")) {
            Map<String, Object> s = new LinkedHashMap<>(section);
            s.put("products", search.search(ProductQuery.top((String) section.get("collection"), 8)).items());
            sections.add(s);
        }
        home.put("sections", sections);
        return home;
    }

    private Map<String, Category> categoryMap() {
        return categories.findAllByOrderBySortOrderAsc().stream()
                .collect(Collectors.toMap(Category::getSlug, Function.identity(), (a, b) -> a, LinkedHashMap::new));
    }

    private CategoryView view(Category c, Map<String, Category> all) {
        List<CategoryLink> children = all.values().stream()
                .filter(x -> c.getSlug().equals(x.getParentSlug()))
                .map(x -> new CategoryLink(x.getSlug(), x.getName(), x.getProductCount()))
                .toList();
        return new CategoryView(c.getSlug(), c.getName(), c.getDescription(), c.getType(), c.getParentSlug(),
                c.getProductCount(), breadcrumbs(c, all), children);
    }

    private List<Crumb> breadcrumbs(Category c, Map<String, Category> all) {
        List<Crumb> crumbs = new ArrayList<>();
        while (c != null) {
            crumbs.add(new Crumb(c.getSlug(), c.getName()));
            c = c.getParentSlug() == null ? null : all.get(c.getParentSlug());
        }
        Collections.reverse(crumbs);
        return crumbs;
    }
}
