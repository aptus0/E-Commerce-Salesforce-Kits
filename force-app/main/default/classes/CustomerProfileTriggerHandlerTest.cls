@IsTest
private class CustomerProfileTriggerHandlerTest {
    @IsTest
    static void shouldNormalizeEmailAndSegment() {
        Customer_Profile__c profile = new Customer_Profile__c(
            Name = 'Segment Customer',
            Email__c = ' VIP.USER@Example.COM ',
            Total_Spent__c = 15000,
            Last_Order_Date__c = Date.today()
        );

        insert profile;

        Customer_Profile__c stored = [
            SELECT Email__c, Customer_Segment__c
            FROM Customer_Profile__c
            WHERE Id = :profile.Id
        ];

        System.assertEquals('vip.user@example.com', stored.Email__c);
        System.assertEquals('VIP', stored.Customer_Segment__c);
    }
}
