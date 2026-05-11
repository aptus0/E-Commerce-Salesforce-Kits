@IsTest
private class ReturnRequestTriggerHandlerTest {
    @IsTest
    static void shouldDefaultRequestDateAndRefundAmount() {
        Customer_Profile__c customer = CommercePulseTestDataFactory.createCustomer('ReturnCoverage');
        insert customer;

        Commerce_Order__c orderRecord = CommercePulseTestDataFactory.createOrder(customer.Id, 'Paid', 450);
        insert orderRecord;

        Return_Request__c requestRecord = new Return_Request__c(
            Order__c = orderRecord.Id,
            Status__c = 'Refunded'
        );
        insert requestRecord;

        Return_Request__c stored = [
            SELECT Requested_Date__c, Refund_Amount__c
            FROM Return_Request__c
            WHERE Id = :requestRecord.Id
        ];

        System.assertEquals(Date.today(), stored.Requested_Date__c);
        System.assertEquals(450, stored.Refund_Amount__c);
    }
}
