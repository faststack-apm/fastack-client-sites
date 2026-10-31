package com.vegasclubwear.commerce.catalog;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, String> {

    List<Category> findAllByOrderBySortOrderAsc();

    List<Category> findByParentSlugOrderBySortOrderAsc(String parentSlug);
}
