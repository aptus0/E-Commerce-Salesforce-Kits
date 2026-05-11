@IsTest
private class ProductTriggerHandlerTest {
    @IsTest
    static void shouldNormalizeSkuAndDefaults() {
        Product__c product = new Product__c(
            Name = 'Normalized Product',
            SKU__c = ' cp-100 ',
            Price__c = 99,
            Stock_Quantity__c = null
        );

        insert product;

        Product__c stored = [
            SELECT SKU__c, Category__c, Is_Active__c, Stock_Quantity__c
            FROM Product__c
            WHERE Id = :product.Id
        ];

        System.assertEquals('CP-100', stored.SKU__c);
        System.assertEquals('Other', stored.Category__c);
        System.assertEquals(true, stored.Is_Active__c);
        System.assertEquals(0, stored.Stock_Quantity__c);
    }
}
