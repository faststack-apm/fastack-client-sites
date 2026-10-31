package com.vegasclubwear.commerce.catalog;

import com.vegasclubwear.commerce.content.CatalogFile;
import com.vegasclubwear.commerce.content.CatalogFile.CategoryRow;
import com.vegasclubwear.commerce.content.CatalogFile.ProductRow;
import com.vegasclubwear.commerce.content.StoreContent;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/** Loads categories and products from catalog.json into an empty database before the server starts serving. */
@Component
public class CatalogSeeder implements InitializingBean {

    private static final Logger log = LoggerFactory.getLogger(CatalogSeeder.class);
    private static final int BATCH = 1000;

    private final JdbcTemplate jdbc;
    private final StoreContent content;

    public CatalogSeeder(JdbcTemplate jdbc, StoreContent content) {
        this.jdbc = jdbc;
        this.content = content;
    }

    @Override
    public void afterPropertiesSet() {
        Long existing = jdbc.queryForObject("select count(*) from products", Long.class);
        if (existing != null && existing > 0) {
            log.info("Catalog already seeded ({} products)", existing);
            return;
        }
        long start = System.currentTimeMillis();
        CatalogFile catalog = content.catalog();
        seedCategories(catalog.categories());
        seedProducts(catalog.products());
        log.info("Seeded {} categories and {} products in {} ms",
                catalog.categories().size(), catalog.products().size(), System.currentTimeMillis() - start);
    }

    private void seedCategories(List<CategoryRow> rows) {
        List<Object[]> args = new ArrayList<>();
        for (CategoryRow c : rows) {
            var r = c.rule();
            args.add(new Object[] {
                c.slug(), c.name(), c.parentSlug(), c.type(), c.depth(), c.sortOrder(), c.description(), c.productCount(),
                r == null ? null : r.scope(), r == null ? null : r.isNew(), r == null ? null : r.onSale(),
                r == null ? null : r.doorbuster(), r == null ? null : r.maxPrice(), r == null ? null : r.brand()
            });
        }
        jdbc.batchUpdate("""
                insert into categories (slug, name, parent_slug, type, depth, sort_order, description, product_count,
                  rule_scope, rule_is_new, rule_on_sale, rule_doorbuster, rule_max_price, rule_brand)
                values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""", args);
    }

    private void seedProducts(List<ProductRow> rows) {
        for (int i = 0; i < rows.size(); i += BATCH) {
            List<ProductRow> chunk = rows.subList(i, Math.min(rows.size(), i + BATCH));
            List<Object[]> products = new ArrayList<>();
            List<Object[]> colors = new ArrayList<>();
            List<Object[]> sizes = new ArrayList<>();
            List<Object[]> paths = new ArrayList<>();
            for (ProductRow p : chunk) {
                products.add(new Object[] {
                    p.id(), p.sku(), p.slug(), p.name(), p.brand(), p.categorySlug(), p.kind(), p.imageKey(),
                    p.description(), p.material(), p.price(), p.compareAtPrice(), p.onSale(), p.isNew(), p.doorbuster(),
                    p.stock(), p.rating(), p.reviewCount(), Timestamp.from(Instant.parse(p.createdAt()))
                });
                for (int j = 0; j < p.colors().size(); j++) {
                    colors.add(new Object[] {p.id(), j, p.colors().get(j).name(), p.colors().get(j).hex()});
                }
                for (int j = 0; j < p.sizes().size(); j++) {
                    sizes.add(new Object[] {p.id(), j, p.sizes().get(j)});
                }
                for (int j = 0; j < p.categoryPath().size(); j++) {
                    paths.add(new Object[] {p.id(), j, p.categoryPath().get(j)});
                }
            }
            jdbc.batchUpdate("""
                    insert into products (id, sku, slug, name, brand, category_slug, kind, image_key, description, material,
                      price, compare_at_price, on_sale, is_new, doorbuster, stock, rating, review_count, created_at)
                    values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""", products);
            jdbc.batchUpdate("insert into product_colors (product_id, position, name, hex) values (?, ?, ?, ?)", colors);
            jdbc.batchUpdate("insert into product_sizes (product_id, position, size) values (?, ?, ?)", sizes);
            jdbc.batchUpdate("insert into product_categories (product_id, position, category_slug) values (?, ?, ?)", paths);
        }
    }
}
