# Salesforce Optional Apex

This folder contains optional Apex examples.

You do not have to deploy these files for the starter kit to run. The Node.js backend can work directly with the custom objects.

Use these Apex files when you want stronger Salesforce-side business logic:

| File | Purpose |
|---|---|
| `CommerceOrderTrigger.trigger` | Recalculates customer spend and segment when orders change |
| `CommerceOrderTriggerHandler.cls` | Trigger handler for customer rollups |
| `OrderItemTrigger.trigger` | Recalculates order totals when order items change |
| `OrderItemTriggerHandler.cls` | Trigger handler for order total rollups |
| `CommercePulseTriggerTest.cls` | Basic test coverage example |

Important: create the custom objects and fields first.
