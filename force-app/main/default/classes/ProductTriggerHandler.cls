public with sharing class ProductTriggerHandler {
    public static void prepareProducts(List<Product__c> products) {
        for (Product__c product : products) {
            product.SKU__c = CommercePulseTriggerSupport.normalizeCode(product.SKU__c);

            if (String.isBlank(product.Category__c)) {
                product.Category__c = 'Other';
            }

            if (product.Is_Active__c == null) {
                product.Is_Active__c = true;
            }

            if (product.Stock_Quantity__c == null) {
                product.Stock_Quantity__c = 0;
            }
        }
    }
}
