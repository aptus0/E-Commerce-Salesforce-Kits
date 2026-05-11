trigger ProductTrigger on Product__c (before insert, before update) {
    ProductTriggerHandler.prepareProducts(Trigger.new);
}
