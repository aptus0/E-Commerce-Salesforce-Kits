trigger SyncLogTrigger on Sync_Log__c (before insert, before update) {
    SyncLogTriggerHandler.prepareLogs(Trigger.new);
}
