@IsTest
private class CommercePulseTriggerTest {
    @IsTest
    static void shouldRecalculateOrderTotalAndCustomerSegment() {
        Customer_Profile__c customer = new Customer_Profile__c(
            Name = 'Test Customer',
            Email__c = 'test.customer@example.com',
            Customer_Segment__c = 'New',
            Total_Spent__c = 0
        );
        insert customer;

        Product__c product = new Product__c(
            Name = 'Test Product',
            SKU__c = 'TEST-SKU-001',
            Price__c = 5000,
            Stock_Quantity__c = 10,
            Category__c = 'Electronics',
            Is_Active__c = true
        );
        insert product;

        Commerce_Order__c orderRecord = new Commerce_Order__c(
            Customer__c = customer.Id,
            Order_Status__c = 'Paid',
            Payment_Status__c = 'Paid',
            Shipping_Status__c = 'Preparing',
            Total_Amount__c = 0,
            Order_Date__c = System.now()
        );
        insert orderRecord;

        Order_Item__c item = new Order_Item__c(
            Order__c = orderRecord.Id,
            Product__c = product.Id,
            Quantity__c = 2,
            Unit_Price__c = 5000,
            Line_Total__c = 10000
        );

        Test.startTest();
        insert item;
        Test.stopTest();

        Commerce_Order__c updatedOrder = [
            SELECT Total_Amount__c
            FROM Commerce_Order__c
            WHERE Id = :orderRecord.Id
            LIMIT 1
        ];

        System.assertEquals(10000, updatedOrder.Total_Amount__c);

        Customer_Profile__c updatedCustomer = [
            SELECT Total_Spent__c, Customer_Segment__c
            FROM Customer_Profile__c
            WHERE Id = :customer.Id
            LIMIT 1
        ];

        System.assertEquals(10000, updatedCustomer.Total_Spent__c);
        System.assertEquals('VIP', updatedCustomer.Customer_Segment__c);
    }
}
