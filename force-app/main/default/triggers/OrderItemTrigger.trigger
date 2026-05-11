trigger OrderItemTrigger on Order_Item__c (before insert, before update, after insert, after update, after delete, after undelete) {
    if (Trigger.isBefore) {
        OrderItemTriggerHandler.prepareOrderItems(Trigger.new);
    }

    if (Trigger.isAfter) {
        if (Trigger.isDelete) {
            OrderItemTriggerHandler.recalculateOrderTotals(Trigger.old);
        } else {
            OrderItemTriggerHandler.recalculateOrderTotals(Trigger.new);
        }
    }
}
