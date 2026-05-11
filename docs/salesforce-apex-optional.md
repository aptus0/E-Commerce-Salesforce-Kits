# Optional Salesforce Apex Logic

The starter kit can run without Apex because the backend communicates with Salesforce directly.

However, adding Apex makes the org more professional and demonstrates Salesforce-side business logic.

## Included Apex Files

```text
salesforce/apex/
├── CommerceOrderTrigger.trigger
├── CommerceOrderTriggerHandler.cls
├── OrderItemTrigger.trigger
├── OrderItemTriggerHandler.cls
└── CommercePulseTriggerTest.cls
```

## What They Do

### Order Item Rollup

When an order item is inserted, updated, deleted, or restored:

```text
Commerce_Order__c.Total_Amount__c = SUM(Order_Item__c.Line_Total__c)
```

### Customer Metrics Rollup

When a paid order changes:

```text
Customer_Profile__c.Total_Spent__c = SUM(Commerce_Order__c.Total_Amount__c)
Customer_Profile__c.Last_Order_Date__c = latest paid order date
Customer_Profile__c.Customer_Segment__c = New / Regular / VIP
```

## Segment Rules

| Segment | Rule |
|---|---|
| VIP | Total spent >= 10000 |
| Regular | Total spent >= 1000 |
| New | Total spent < 1000 |

## Deployment Note

Create the custom objects and fields first. Then add these Apex classes/triggers in Developer Console or deploy with Salesforce CLI.
