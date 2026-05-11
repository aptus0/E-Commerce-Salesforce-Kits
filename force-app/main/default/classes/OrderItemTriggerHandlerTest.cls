@IsTest
private class OrderItemTriggerHandlerTest {
    @IsTest
    static void shouldHydrateUnitPriceAndRecalculateTotals() {
        Customer_Profile__c customer = CommercePulseTestDataFactory.createCustomer('ItemCoverage');
        insert customer;

        Product__c product = CommercePulseTestDataFactory.createProduct('ITEM', 250, 10);
        insert product;

        Commerce_Order__c orderRecord = CommercePulseTestDataFactory.createOrder(customer.Id, 'Pending', 0);
        insert orderRecord;

        Order_Item__c item = new Order_Item__c(
            Order__c = orderRecord.Id,
            Product__c = product.Id,
            Quantity__c = 2
        );

        Test.startTest();
        insert item;
        item = [SELECT Id, Order__c, Unit_Price__c FROM Order_Item__c WHERE Id = :item.Id];
        delete item;
        undelete item;
        Test.stopTest();

        Order_Item__c restoredItem = [
            SELECT Unit_Price__c
            FROM Order_Item__c
            WHERE Id = :item.Id
        ];
        Commerce_Order__c updatedOrder = [
            SELECT Total_Amount__c
            FROM Commerce_Order__c
            WHERE Id = :orderRecord.Id
        ];

        System.assertEquals(250, restoredItem.Unit_Price__c);
        System.assertEquals(500, updatedOrder.Total_Amount__c);
    }
}
