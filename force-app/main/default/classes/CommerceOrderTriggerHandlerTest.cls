@IsTest
private class CommerceOrderTriggerHandlerTest {
    @IsTest
    static void shouldRecalculateCustomerMetricsAfterPaidOrderChanges() {
        Customer_Profile__c customer = CommercePulseTestDataFactory.createCustomer('PaidOrder');
        insert customer;

        Commerce_Order__c orderRecord = CommercePulseTestDataFactory.createOrder(customer.Id, 'Paid', 0);
        insert orderRecord;

        orderRecord.Total_Amount__c = 12000;
        update orderRecord;

        Customer_Profile__c stored = [
            SELECT Total_Spent__c, Customer_Segment__c, Last_Order_Date__c
            FROM Customer_Profile__c
            WHERE Id = :customer.Id
        ];

        System.assertEquals(12000, stored.Total_Spent__c);
        System.assertEquals('VIP', stored.Customer_Segment__c);
        System.assertNotEquals(null, stored.Last_Order_Date__c);
    }

    @IsTest
    static void shouldDefaultStatusesBeforeInsert() {
        Customer_Profile__c customer = CommercePulseTestDataFactory.createCustomer('Defaults');
        insert customer;

        Commerce_Order__c orderRecord = new Commerce_Order__c(Customer__c = customer.Id);
        insert orderRecord;

        Commerce_Order__c stored = [
            SELECT Order_Status__c, Payment_Status__c, Shipping_Status__c, Total_Amount__c
            FROM Commerce_Order__c
            WHERE Id = :orderRecord.Id
        ];

        System.assertEquals('Pending', stored.Order_Status__c);
        System.assertEquals('Pending', stored.Payment_Status__c);
        System.assertEquals('Not Started', stored.Shipping_Status__c);
        System.assertEquals(0, stored.Total_Amount__c);
    }
}
