# Salesforce Manual Object Setup

This file describes the objects and fields you should create manually in Salesforce.

Go to:

```text
Setup → Object Manager → Create → Custom Object
```

---

## 1. Product

| Property | Value |
|---|---|
| Label | Product |
| Plural Label | Products |
| API Name | `Product__c` |
| Record Name | Product Name |
| Record Name Type | Text |

### Fields

| Field Label | API Name | Type | Notes |
|---|---|---|---|
| SKU | `SKU__c` | Text(80) | Mark as unique if possible |
| Price | `Price__c` | Currency(16,2) | Required |
| Stock Quantity | `Stock_Quantity__c` | Number(18,0) | Required |
| Category | `Category__c` | Picklist | Electronics, Fashion, Grocery, Home, Beauty, Other |
| Is Active | `Is_Active__c` | Checkbox | Default true |
| Image URL | `Image_URL__c` | URL | Optional |

### Recommended Validation Rule

Rule Name:

```text
Product_Stock_Not_Negative
```

Formula:

```text
Stock_Quantity__c < 0
```

Error:

```text
Stock quantity cannot be negative.
```

---

## 2. Customer Profile

| Property | Value |
|---|---|
| Label | Customer Profile |
| Plural Label | Customer Profiles |
| API Name | `Customer_Profile__c` |
| Record Name | Full Name |
| Record Name Type | Text |

### Fields

| Field Label | API Name | Type | Notes |
|---|---|---|---|
| Email | `Email__c` | Email | Recommended unique |
| Phone | `Phone__c` | Phone | Optional |
| Total Spent | `Total_Spent__c` | Currency(16,2) | Default 0 |
| Customer Segment | `Customer_Segment__c` | Picklist | New, Regular, VIP, At Risk, Lost |
| Last Order Date | `Last_Order_Date__c` | Date | Optional |

### Recommended Duplicate Rule

Use Email as the main duplicate identifier.

---

## 3. Commerce Order

| Property | Value |
|---|---|
| Label | Commerce Order |
| Plural Label | Commerce Orders |
| API Name | `Commerce_Order__c` |
| Record Name | Order Number |
| Record Name Type | Auto Number |
| Display Format | `ORD-{000000}` |

### Fields

| Field Label | API Name | Type | Notes |
|---|---|---|---|
| Customer | `Customer__c` | Lookup(Customer_Profile__c) | Required |
| Order Status | `Order_Status__c` | Picklist | Pending, Paid, Preparing, Shipped, Delivered, Cancelled, Returned |
| Payment Status | `Payment_Status__c` | Picklist | Pending, Paid, Failed, Refunded |
| Shipping Status | `Shipping_Status__c` | Picklist | Not Started, Preparing, Shipped, Delivered |
| Total Amount | `Total_Amount__c` | Currency(16,2) | Default 0 |
| Order Date | `Order_Date__c` | DateTime | Required |
| External Order Id | `External_Order_Id__c` | Text(120) | Optional |

---

## 4. Order Item

| Property | Value |
|---|---|
| Label | Order Item |
| Plural Label | Order Items |
| API Name | `Order_Item__c` |
| Record Name | Order Item Number |
| Record Name Type | Auto Number |
| Display Format | `ITEM-{000000}` |

### Fields

| Field Label | API Name | Type | Notes |
|---|---|---|---|
| Order | `Order__c` | Master-Detail or Lookup(Commerce_Order__c) | Recommended Master-Detail |
| Product | `Product__c` | Lookup(Product__c) | Required |
| Quantity | `Quantity__c` | Number(18,0) | Required |
| Unit Price | `Unit_Price__c` | Currency(16,2) | Required |
| Line Total | `Line_Total__c` | Currency(16,2) | Can be formula or populated by API |

### Formula Option

If you prefer formula field:

```text
Quantity__c * Unit_Price__c
```

---

## 5. Return Request

| Property | Value |
|---|---|
| Label | Return Request |
| Plural Label | Return Requests |
| API Name | `Return_Request__c` |
| Record Name | Return Number |
| Record Name Type | Auto Number |
| Display Format | `RET-{000000}` |

### Fields

| Field Label | API Name | Type |
|---|---|---|
| Order | `Order__c` | Lookup(Commerce_Order__c) |
| Reason | `Reason__c` | Long Text Area |
| Status | `Status__c` | Picklist: Requested, Approved, Rejected, Refunded |
| Refund Amount | `Refund_Amount__c` | Currency(16,2) |
| Requested Date | `Requested_Date__c` | Date |

---

## 6. Campaign Performance

| Property | Value |
|---|---|
| Label | Campaign Performance |
| Plural Label | Campaign Performances |
| API Name | `Campaign_Performance__c` |
| Record Name | Campaign Name |
| Record Name Type | Text |

### Fields

| Field Label | API Name | Type |
|---|---|---|
| Discount Code | `Discount_Code__c` | Text(80) |
| Revenue Generated | `Revenue_Generated__c` | Currency(16,2) |
| Orders Count | `Orders_Count__c` | Number(18,0) |
| Conversion Rate | `Conversion_Rate__c` | Percent(5,2) |
| Status | `Status__c` | Picklist: Draft, Active, Completed, Paused |

---

## 7. Sync Log

| Property | Value |
|---|---|
| Label | Sync Log |
| Plural Label | Sync Logs |
| API Name | `Sync_Log__c` |
| Record Name | Sync Log Number |
| Record Name Type | Auto Number |
| Display Format | `SYNC-{000000}` |

### Fields

| Field Label | API Name | Type |
|---|---|---|
| Source System | `Source_System__c` | Text(80) |
| Operation Type | `Operation_Type__c` | Picklist: CREATE, UPDATE, DELETE, QUERY, RETRY, HEALTH_CHECK |
| Status | `Status__c` | Picklist: SUCCESS, FAILED, WARNING |
| Message | `Message__c` | Long Text Area |
| Record Id | `Record_Id__c` | Text(80) |
| Request Payload | `Request_Payload__c` | Long Text Area |
| Response Payload | `Response_Payload__c` | Long Text Area |
| Created At | `Created_At__c` | DateTime |

---

## Connected App Notes

For a real integration, create a Connected App:

```text
Setup → App Manager → New Connected App
```

Enable OAuth settings and add scopes:

```text
Access and manage your data (api)
Perform requests at any time (refresh_token, offline_access)
```

For this starter kit, the backend uses `jsforce` username/password style login for easier local setup. For production, prefer OAuth Authorization Code + refresh token flow.

---

## Permission Set Recommendation

Create a permission set:

```text
CommercePulse Integration User
```

Give access to all custom objects and required fields.

Use this permission set for your Salesforce integration user.
