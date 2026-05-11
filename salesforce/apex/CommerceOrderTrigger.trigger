trigger CommerceOrderTrigger on Commerce_Order__c (after insert, after update) {
    CommerceOrderTriggerHandler.recalculateCustomerMetrics(Trigger.new);
}
