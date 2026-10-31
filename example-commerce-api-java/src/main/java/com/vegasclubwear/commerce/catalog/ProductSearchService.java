package com.vegasclubwear.commerce.catalog;

import com.vegasclubwear.commerce.catalog.CatalogDtos.ColorFacet;
import com.vegasclubwear.commerce.catalog.CatalogDtos.Facets;
import com.vegasclubwear.commerce.catalog.CatalogDtos.PriceRange;
import com.vegasclubwear.commerce.catalog.CatalogDtos.ProductPage;
import com.vegasclubwear.commerce.catalog.CatalogDtos.ProductSummary;
import com.vegasclubwear.commerce.catalog.CatalogDtos.ValueFacet;
import com.vegasclubwear.commerce.common.ApiException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Tuple;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Collection listing, keyword search, filtering, sorting and facets using the JPA Criteria API. */
@Service
@Transactional(readOnly = true)
public class ProductSearchService {

    /** Display order for size facets. */
    private static final List<String> SIZE_ORDER = List.of(
            "XS", "S", "M", "L", "XL", "1X", "2X", "3X", "4X",
            "1", "3", "5", "6", "7", "8", "9", "10", "11", "13", "One Size", "Queen");

    private final EntityManager em;
    private final CategoryRepository categories;

    public ProductSearchService(EntityManager em, CategoryRepository categories) {
        this.em = em;
        this.categories = categories;
    }

    public ProductPage search(ProductQuery query) {
        Category collection = null;
        if (query.collection() != null && !query.collection().isBlank()) {
            collection = categories.findById(query.collection())
                    .orElseThrow(() -> ApiException.notFound("Collection", query.collection()));
        }
        CriteriaBuilder cb = em.getCriteriaBuilder();

        // total count
        CriteriaQuery<Long> countQ = cb.createQuery(Long.class);
        Root<Product> countRoot = countQ.from(Product.class);
        countQ.select(cb.count(countRoot)).where(predicates(cb, countQ, countRoot, query, collection, true));
        long total = em.createQuery(countQ).getSingleResult();

        // page of results
        CriteriaQuery<Product> pageQ = cb.createQuery(Product.class);
        Root<Product> root = pageQ.from(Product.class);
        pageQ.select(root).where(predicates(cb, pageQ, root, query, collection, true)).orderBy(sortOrder(cb, root, query.sort()));
        List<Product> rows = em.createQuery(pageQ)
                .setFirstResult((query.page() - 1) * query.pageSize())
                .setMaxResults(query.pageSize())
                .getResultList();

        Facets facets = query.includeFacets() ? facets(cb, query, collection) : null;
        int totalPages = (int) Math.ceil(total / (double) query.pageSize());
        return new ProductPage(rows.stream().map(ProductSummary::of).toList(),
                query.page(), query.pageSize(), total, totalPages, facets);
    }

    private Predicate[] predicates(CriteriaBuilder cb, CriteriaQuery<?> cq, Root<Product> root, ProductQuery q,
                                   Category collection, boolean withAttributeFilters) {
        List<Predicate> ps = new ArrayList<>();
        if (collection != null) {
            if (collection.isSmart()) {
                if (collection.getRuleScope() != null) ps.add(inCategory(cb, root, collection.getRuleScope()));
                if (Boolean.TRUE.equals(collection.getRuleIsNew())) ps.add(cb.isTrue(root.get("isNew")));
                if (Boolean.TRUE.equals(collection.getRuleOnSale())) ps.add(cb.isTrue(root.get("onSale")));
                if (Boolean.TRUE.equals(collection.getRuleDoorbuster())) ps.add(cb.isTrue(root.get("doorbuster")));
                if (collection.getRuleMaxPrice() != null) ps.add(cb.lessThan(root.get("price"), collection.getRuleMaxPrice()));
                if (collection.getRuleBrand() != null) ps.add(cb.equal(root.get("brand"), collection.getRuleBrand()));
            } else {
                ps.add(inCategory(cb, root, collection.getSlug()));
            }
        }
        if (q.q() != null && !q.q().isBlank()) {
            for (String term : q.q().toLowerCase(Locale.ROOT).trim().split("\\s+")) {
                String like = "%" + term.replace("%", "") + "%";
                Subquery<Long> colorMatch = cq.subquery(Long.class);
                Root<Product> cp = colorMatch.correlate(root);
                Join<Product, ProductColor> color = cp.join("colors");
                colorMatch.select(cb.literal(1L)).where(cb.like(cb.lower(color.get("name")), like));
                ps.add(cb.or(
                        cb.like(cb.lower(root.get("name")), like),
                        cb.like(cb.lower(root.get("brand")), like),
                        cb.like(cb.lower(root.get("categorySlug")), like),
                        cb.exists(colorMatch)));
            }
        }
        if (withAttributeFilters) {
            if (!q.colors().isEmpty()) {
                Subquery<Long> sq = cq.subquery(Long.class);
                Root<Product> sr = sq.correlate(root);
                Join<Product, ProductColor> color = sr.join("colors");
                sq.select(cb.literal(1L)).where(color.get("name").in(q.colors()));
                ps.add(cb.exists(sq));
            }
            if (!q.sizes().isEmpty()) {
                Subquery<Long> sq = cq.subquery(Long.class);
                Root<Product> sr = sq.correlate(root);
                Join<Product, String> size = sr.join("sizes");
                sq.select(cb.literal(1L)).where(size.in(q.sizes()));
                ps.add(cb.exists(sq));
            }
            if (!q.brands().isEmpty()) ps.add(root.get("brand").in(q.brands()));
            if (q.minPrice() != null) ps.add(cb.greaterThanOrEqualTo(root.get("price"), q.minPrice()));
            if (q.maxPrice() != null) ps.add(cb.lessThanOrEqualTo(root.get("price"), q.maxPrice()));
        }
        return ps.toArray(Predicate[]::new);
    }

    private Predicate inCategory(CriteriaBuilder cb, Root<Product> root, String slug) {
        Join<Product, String> path = root.join("categoryPath");
        return cb.equal(path, slug);
    }

    private List<Order> sortOrder(CriteriaBuilder cb, Root<Product> root, String sort) {
        Expression<Long> id = root.get("id");
        return switch (sort) {
            case "newest" -> List.of(cb.desc(root.get("createdAt")), cb.asc(id));
            case "price_asc" -> List.of(cb.asc(root.get("price")), cb.asc(id));
            case "price_desc" -> List.of(cb.desc(root.get("price")), cb.asc(id));
            case "rating" -> List.of(cb.desc(root.get("rating")), cb.desc(root.get("reviewCount")), cb.asc(id));
            case "name" -> List.of(cb.asc(root.get("name")), cb.asc(id));
            case "featured", "best_selling" -> List.of(cb.desc(root.get("reviewCount")), cb.asc(id));
            default -> throw ApiException.badRequest("invalid_sort",
                    "sort must be one of featured, best_selling, newest, price_asc, price_desc, rating, name");
        };
    }

    /** Facets reflect the collection + keyword, ignoring the attribute filters themselves. */
    private Facets facets(CriteriaBuilder cb, ProductQuery q, Category collection) {
        CriteriaQuery<Tuple> colorQ = cb.createTupleQuery();
        Root<Product> cr = colorQ.from(Product.class);
        Join<Product, ProductColor> color = cr.join("colors");
        Expression<Long> colorCount = cb.count(cr);
        colorQ.multiselect(color.get("name"), color.get("hex"), colorCount)
                .where(predicates(cb, colorQ, cr, q, collection, false))
                .groupBy(color.get("name"), color.get("hex"))
                .orderBy(cb.desc(colorCount), cb.asc(color.get("name")));
        List<ColorFacet> colors = em.createQuery(colorQ).getResultList().stream()
                .map(t -> new ColorFacet(t.get(0, String.class), t.get(1, String.class), t.get(2, Long.class)))
                .toList();

        CriteriaQuery<Tuple> sizeQ = cb.createTupleQuery();
        Root<Product> sr = sizeQ.from(Product.class);
        Join<Product, String> size = sr.join("sizes");
        sizeQ.multiselect(size, cb.count(sr)).where(predicates(cb, sizeQ, sr, q, collection, false)).groupBy(size);
        List<ValueFacet> sizes = em.createQuery(sizeQ).getResultList().stream()
                .map(t -> new ValueFacet(t.get(0, String.class), t.get(1, Long.class)))
                .sorted(Comparator.comparingInt(f -> sizeRank(f.value())))
                .toList();

        CriteriaQuery<Tuple> brandQ = cb.createTupleQuery();
        Root<Product> br = brandQ.from(Product.class);
        Expression<Long> brandCount = cb.count(br);
        brandQ.multiselect(br.get("brand"), brandCount).where(predicates(cb, brandQ, br, q, collection, false))
                .groupBy(br.get("brand")).orderBy(cb.desc(brandCount), cb.asc(br.get("brand")));
        List<ValueFacet> brands = em.createQuery(brandQ).getResultList().stream()
                .map(t -> new ValueFacet(t.get(0, String.class), t.get(1, Long.class)))
                .toList();

        CriteriaQuery<Tuple> priceQ = cb.createTupleQuery();
        Root<Product> pr = priceQ.from(Product.class);
        priceQ.multiselect(cb.min(pr.<BigDecimal>get("price")), cb.max(pr.<BigDecimal>get("price")))
                .where(predicates(cb, priceQ, pr, q, collection, false));
        Tuple price = em.createQuery(priceQ).getSingleResult();

        return new Facets(colors, sizes, brands,
                new PriceRange(price.get(0, BigDecimal.class), price.get(1, BigDecimal.class)));
    }

    private static int sizeRank(String size) {
        int i = SIZE_ORDER.indexOf(size);
        return i < 0 ? SIZE_ORDER.size() : i;
    }
}
