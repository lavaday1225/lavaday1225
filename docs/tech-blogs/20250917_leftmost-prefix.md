## Multiple-column Indexes and the Leftmost-prefix Rule

TL;DR

For an index defined as (col1, col2, col3):

Index is used for:
- col1
- col1, col2
- col1, col2, col3

Index is NOT used for:
- col2
- col2, col3
- col3


This page explains how composite (multiple-column) indexes work and why column order matters. It includes a random example schema and several query examples that show when the index can be used efficiently.

### What is a composite index?

A composite index covers multiple columns, e.g.:

```sql
CREATE UNIQUE INDEX idx_order_items_on_order_id_sku_status
  ON order_items (order_id, sku, status);
```

The index key order is (order_id, sku, status). Most database engines (B-tree based) follow the "leftmost-prefix" rule: the index is useful only when the WHERE clause filters on the leftmost column(s) in the defined order.

### Why does order matter?

Think of the composite index as sorted first by `order_id`, then within each `order_id` by `sku`, and then by `status`. If your query can filter starting from `order_id`, the index can perform a direct lookup or an efficient range scan. If the query skips `order_id` and tries to filter only by `sku` or `status`, the index cannot be used in the same efficient way.

### Random example schema (to illustrate)

```sql
CREATE TABLE order_items (
  id BIGINT PRIMARY KEY,
  order_id BIGINT NOT NULL,
  sku VARCHAR(64) NOT NULL,
  status VARCHAR(32) NOT NULL,
  quantity INT,
  price DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_order_items_on_order_id_sku_status
  ON order_items (order_id, sku, status);
```

This is a unique composite index with order (order_id, sku, status). Below are example queries and explanations of index usage.

### Example queries and how the index is used

- Best case (all index columns specified):

```sql
SELECT * FROM order_items
WHERE order_id = 555 AND sku = 'ABC-123' AND status = 'shipped';
```

The database can perform a unique lookup using the full index. Very efficient — essentially constant time for the index lookup plus minimal I/O.

- Prefix scan (first two columns specified):

```sql
SELECT * FROM order_items
WHERE order_id = 555 AND sku = 'ABC-123';
```

This uses the index to narrow to rows with order_id=555 and sku='ABC-123' and then performs a range scan over the `status` values for that key. Still much faster than a full table scan.

- First column only:

```sql
SELECT * FROM order_items
WHERE order_id = 555;
```

The index locates the region where order_id=555 and then scans all `sku` and `status` combinations within that region. Useful when many items belong to the same order.

- Skipping the middle column (first and third specified):

```sql
SELECT * FROM order_items
WHERE order_id = 555 AND status = 'shipped';
```

Although `order_id` is present (leftmost), `sku` is not specified. The index can restrict to order_id=555, but it cannot use `status` efficiently in the index ordering — `status` filtering will be applied after the range scan on `order_id`, potentially scanning many `sku` values. If this query is common, consider a separate index like `(order_id, status)` or reorder indexes based on query patterns.

- Filtering by non-leftmost column only (index cannot be used effectively):

```sql
SELECT * FROM order_items WHERE sku = 'ABC-123';

SELECT * FROM order_items WHERE status = 'shipped';
```

These queries do not include the leftmost `order_id`, so the composite index `(order_id, sku, status)` cannot be used efficiently (unless the engine chooses an index skip-scan optimization, which is not always available). The database will usually do a full table scan or use another index if present.

### Practical tips

- Design composite indexes based on actual query patterns. Put the most selective and most frequently filtered columns at the left.
- If you have multiple common access patterns, create separate indexes for them (e.g., `(order_id, sku)` and `(order_id, status)`), but balance read performance with write overhead.
- Use covering indexes (include columns) when possible to avoid fetching the table rows.

### References

- MySQL: Multiple-Column Indexes (leftmost prefix)
  https://dev.mysql.com/doc/refman/8.4/en/multiple-column-indexes.html
