public with sharing class OrderItemTriggerHandler {
    public static void prepareOrderItems(List<Order_Item__c> orderItems) {
        Set<Id> productIds = new Set<Id>();

        for (Order_Item__c item : orderItems) {
            if (item.Product__c != null) {
                productIds.add(item.Product__c);
            }

            if (item.Quantity__c == null) {
                item.Quantity__c = 1;
            }
        }

        Map<Id, Product__c> productsById = productIds.isEmpty()
            ? new Map<Id, Product__c>()
            : new Map<Id, Product__c>([
                SELECT Id, Price__c
                FROM Product__c
                WHERE Id IN :productIds
            ]);

        for (Order_Item__c item : orderItems) {
            if (item.Unit_Price__c == null && item.Product__c != null && productsById.containsKey(item.Product__c)) {
                item.Unit_Price__c = productsById.get(item.Product__c).Price__c;
            }
        }
    }

    public static void recalculateOrderTotals(List<Order_Item__c> orderItems) {
        Set<Id> orderIds = new Set<Id>();

        for (Order_Item__c item : orderItems) {
            if (item.Order__c != null) {
                orderIds.add(item.Order__c);
            }
        }

        if (orderIds.isEmpty()) {
            return;
        }

        Map<Id, Decimal> totalsByOrder = new Map<Id, Decimal>();

        for (AggregateResult result : [
            SELECT Order__c orderId, SUM(Line_Total__c) totalAmount
            FROM Order_Item__c
            WHERE Order__c IN :orderIds
            GROUP BY Order__c
        ]) {
            totalsByOrder.put((Id) result.get('orderId'), (Decimal) result.get('totalAmount'));
        }

        List<Commerce_Order__c> ordersToUpdate = new List<Commerce_Order__c>();

        for (Id orderId : orderIds) {
            ordersToUpdate.add(new Commerce_Order__c(
                Id = orderId,
                Total_Amount__c = totalsByOrder.containsKey(orderId) ? totalsByOrder.get(orderId) : 0
            ));
        }

        if (!ordersToUpdate.isEmpty()) {
            update ordersToUpdate;
        }
    }
}
