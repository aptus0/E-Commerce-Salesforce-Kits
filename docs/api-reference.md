# API Reference

Base URL:

```text
http://localhost:5000
```

## Health

### GET `/health`

Returns API status.

---

## Dashboard

### GET `/api/dashboard/summary`

Returns dashboard metrics.

---

## Products

### GET `/api/products`

Query params:

| Name | Example |
|---|---|
| search | `phone` |

### POST `/api/products`

```json
{
  "name": "Wireless Mouse",
  "sku": "WM-100",
  "price": 29.99,
  "stockQuantity": 20,
  "category": "Electronics",
  "isActive": true,
  "imageUrl": "https://example.com/mouse.png"
}
```

### PATCH `/api/products/:id`

```json
{
  "price": 34.99,
  "stockQuantity": 15
}
```

---

## Customers

### GET `/api/customers`

---

## Orders

### GET `/api/orders`

### PATCH `/api/orders/:id/status`

```json
{
  "orderStatus": "Shipped",
  "shippingStatus": "Shipped"
}
```

---

## Returns

### GET `/api/returns`

---

## Campaigns

### GET `/api/campaigns`

---

## Sync

### GET `/api/sync/logs`

### POST `/api/sync/test`

Tests repository connection. In Salesforce mode, it checks whether Salesforce is reachable.

---

## Error Format

```json
{
  "success": false,
  "message": "Validation failed",
  "details": []
}
```
