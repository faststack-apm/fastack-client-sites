package com.vegasclubwear.commerce.catalog;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;

/** A browsable collection: either a tree category or a rule-based ("smart") collection. */
@Entity
@Table(name = "categories")
public class Category {

    public static final String TYPE_CATEGORY = "category";
    public static final String TYPE_SMART = "smart";

    @Id
    private String slug;
    private String name;
    private String parentSlug;
    private String type;
    private int depth;
    private int sortOrder;
    private String description;
    private int productCount;

    @Column(name = "rule_scope")
    private String ruleScope;
    @Column(name = "rule_is_new")
    private Boolean ruleIsNew;
    @Column(name = "rule_on_sale")
    private Boolean ruleOnSale;
    @Column(name = "rule_doorbuster")
    private Boolean ruleDoorbuster;
    @Column(name = "rule_max_price")
    private BigDecimal ruleMaxPrice;
    @Column(name = "rule_brand")
    private String ruleBrand;

    protected Category() {}

    public boolean isSmart() {
        return TYPE_SMART.equals(type);
    }

    public String getSlug() { return slug; }
    public String getName() { return name; }
    public String getParentSlug() { return parentSlug; }
    public String getType() { return type; }
    public int getDepth() { return depth; }
    public int getSortOrder() { return sortOrder; }
    public String getDescription() { return description; }
    public int getProductCount() { return productCount; }
    public String getRuleScope() { return ruleScope; }
    public Boolean getRuleIsNew() { return ruleIsNew; }
    public Boolean getRuleOnSale() { return ruleOnSale; }
    public Boolean getRuleDoorbuster() { return ruleDoorbuster; }
    public BigDecimal getRuleMaxPrice() { return ruleMaxPrice; }
    public String getRuleBrand() { return ruleBrand; }
}
