public with sharing class CommerceOrderTriggerHandler {
    public static void recalculateCustomerMetrics(List<Commerce_Order__c> orders) {
        Set<Id> customerIds = new Set<Id>();

        for (Commerce_Order__c orderRecord : orders) {
            if (orderRecord.Customer__c != null) {
                customerIds.add(orderRecord.Customer__c);
            }
        }

        if (customerIds.isEmpty()) {
            return;
        }

        Map<Id, Decimal> totalSpentByCustomer = new Map<Id, Decimal>();
        Map<Id, Datetime> lastOrderDateByCustomer = new Map<Id, Datetime>();

        for (AggregateResult result : [
            SELECT
                Customer__c customerId,
                SUM(Total_Amount__c) totalSpent,
                MAX(Order_Date__c) lastOrderDate
            FROM Commerce_Order__c
            WHERE Customer__c IN :customerIds
            AND Payment_Status__c = 'Paid'
            GROUP BY Customer__c
        ]) {
            Id customerId = (Id) result.get('customerId');
            totalSpentByCustomer.put(customerId, (Decimal) result.get('totalSpent'));
            lastOrderDateByCustomer.put(customerId, (Datetime) result.get('lastOrderDate'));
        }

        List<Customer_Profile__c> customersToUpdate = new List<Customer_Profile__c>();

        for (Id customerId : customerIds) {
            Decimal totalSpent = totalSpentByCustomer.containsKey(customerId)
                ? totalSpentByCustomer.get(customerId)
                : 0;

            customersToUpdate.add(new Customer_Profile__c(
                Id = customerId,
                Total_Spent__c = totalSpent,
                Last_Order_Date__c = lastOrderDateByCustomer.containsKey(customerId)
                    ? Date.valueOf(lastOrderDateByCustomer.get(customerId))
                    : null,
                Customer_Segment__c = calculateSegment(totalSpent)
            ));
        }

        if (!customersToUpdate.isEmpty()) {
            update customersToUpdate;
        }
    }

    private static String calculateSegment(Decimal totalSpent) {
        if (totalSpent >= 10000) {
            return 'VIP';
        }

        if (totalSpent >= 1000) {
            return 'Regular';
        }

        return 'New';
    }
}
