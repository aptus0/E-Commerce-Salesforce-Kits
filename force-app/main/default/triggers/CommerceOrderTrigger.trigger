trigger CommerceOrderTrigger on Commerce_Order__c (
    before insert,
    before update,
    after insert,
    after update,
    after delete,
    after undelete
) {
    if (Trigger.isBefore) {
        CommerceOrderTriggerHandler.prepareOrders(Trigger.new);
    }

    if (Trigger.isAfter) {
        if (Trigger.isDelete) {
            CommerceOrderTriggerHandler.recalculateCustomerMetrics(Trigger.old);
        } else {
            CommerceOrderTriggerHandler.recalculateCustomerMetrics(Trigger.new);
        }
    }
}
