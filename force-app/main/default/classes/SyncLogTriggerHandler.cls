public with sharing class SyncLogTriggerHandler {
    public static void prepareLogs(List<Sync_Log__c> logs) {
        for (Sync_Log__c logRecord : logs) {
            if (String.isBlank(logRecord.Source_System__c)) {
                logRecord.Source_System__c = 'CommercePulse';
            }

            if (String.isBlank(logRecord.Operation_Type__c)) {
                logRecord.Operation_Type__c = 'QUERY';
            } else {
                logRecord.Operation_Type__c = CommercePulseTriggerSupport.normalizeCode(logRecord.Operation_Type__c);
            }

            if (String.isBlank(logRecord.Status__c)) {
                logRecord.Status__c = 'SUCCESS';
            } else {
                logRecord.Status__c = CommercePulseTriggerSupport.normalizeCode(logRecord.Status__c);
            }

            if (logRecord.Created_At__c == null) {
                logRecord.Created_At__c = System.now();
            }

            logRecord.Message__c = CommercePulseTriggerSupport.truncateText(logRecord.Message__c, 32000);
            logRecord.Request_Payload__c = CommercePulseTriggerSupport.truncateText(logRecord.Request_Payload__c, 32000);
            logRecord.Response_Payload__c = CommercePulseTriggerSupport.truncateText(logRecord.Response_Payload__c, 32000);
        }
    }
}
