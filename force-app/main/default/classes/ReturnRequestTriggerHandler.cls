public with sharing class ReturnRequestTriggerHandler {
    public static void prepareReturns(List<Return_Request__c> requests) {
        Set<Id> orderIds = new Set<Id>();

        for (Return_Request__c requestRecord : requests) {
            if (requestRecord.Order__c != null) {
                orderIds.add(requestRecord.Order__c);
            }
        }

        Map<Id, Commerce_Order__c> ordersById = orderIds.isEmpty()
            ? new Map<Id, Commerce_Order__c>()
            : new Map<Id, Commerce_Order__c>([
                SELECT Id, Total_Amount__c
                FROM Commerce_Order__c
                WHERE Id IN :orderIds
            ]);

        for (Return_Request__c requestRecord : requests) {
            if (requestRecord.Requested_Date__c == null) {
                requestRecord.Requested_Date__c = Date.today();
            }

            if (String.isBlank(requestRecord.Status__c)) {
                requestRecord.Status__c = 'Requested';
            }

            if (
                requestRecord.Status__c == 'Refunded' &&
                requestRecord.Order__c != null &&
                (requestRecord.Refund_Amount__c == null || requestRecord.Refund_Amount__c == 0) &&
                ordersById.containsKey(requestRecord.Order__c)
            ) {
                requestRecord.Refund_Amount__c = ordersById.get(requestRecord.Order__c).Total_Amount__c;
            }
        }
    }
}
