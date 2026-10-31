package com.vegasclubwear.commerce.catalog;

import jakarta.persistence.Embeddable;

@Embeddable
public class ProductColor {

    private String name;
    private String hex;

    protected ProductColor() {}

    public String getName() { return name; }
    public String getHex() { return hex; }
}
