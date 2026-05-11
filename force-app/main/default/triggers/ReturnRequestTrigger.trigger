trigger ReturnRequestTrigger on Return_Request__c (before insert, before update) {
    ReturnRequestTriggerHandler.prepareReturns(Trigger.new);
}
