trigger CustomerProfileTrigger on Customer_Profile__c (before insert, before update) {
    CustomerProfileTriggerHandler.prepareProfiles(Trigger.new);
}
