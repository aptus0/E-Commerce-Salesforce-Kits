trigger OrderItemTrigger on Order_Item__c (after insert, after update, after delete, after undelete) {
    if (Trigger.isDelete) {
        OrderItemTriggerHandler.recalculateOrderTotals(Trigger.old);
    } else {
        OrderItemTriggerHandler.recalculateOrderTotals(Trigger.new);
    }
}
