@IsTest
private class SyncLogTriggerHandlerTest {
    @IsTest
    static void shouldDefaultAndTruncateLogFields() {
        String longMessage = '';
        for (Integer index = 0; index < 32500; index++) {
            longMessage += 'x';
        }

        Sync_Log__c logRecord = new Sync_Log__c(
            Message__c = longMessage,
            Request_Payload__c = longMessage,
            Response_Payload__c = longMessage
        );
        insert logRecord;

        Sync_Log__c stored = [
            SELECT Source_System__c, Operation_Type__c, Status__c, Created_At__c, Message__c
            FROM Sync_Log__c
            WHERE Id = :logRecord.Id
        ];

        System.assertEquals('CommercePulse', stored.Source_System__c);
        System.assertEquals('QUERY', stored.Operation_Type__c);
        System.assertEquals('SUCCESS', stored.Status__c);
        System.assertNotEquals(null, stored.Created_At__c);
        System.assertEquals(32000, stored.Message__c.length());
    }
}
