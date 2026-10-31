package com.vegasclubwear.commerce.content;

import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import tools.jackson.databind.json.JsonMapper;

/** Loads catalog.json once; exposes store settings, menu and home layout. */
@Component
public class StoreContent {

    private static final Logger log = LoggerFactory.getLogger(StoreContent.class);

    private final CatalogFile catalog;

    public StoreContent(JsonMapper mapper, @Value("${commerce.catalog-resource}") Resource resource) {
        try (InputStream in = resource.getInputStream()) {
            this.catalog = mapper.readValue(in, CatalogFile.class);
        } catch (IOException e) {
            throw new UncheckedIOException("Unable to read catalog " + resource, e);
        }
        log.info("Loaded catalog: {} categories, {} products", catalog.categories().size(), catalog.products().size());
    }

    public CatalogFile catalog() {
        return catalog;
    }

    public CatalogFile.StoreSettings settings() {
        return catalog.store();
    }
}
