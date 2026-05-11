public with sharing class OrderItemTriggerHandler {
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
