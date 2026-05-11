@IsTest
public class CommercePulseTestDataFactory {
    public static Product__c createProduct(String suffix, Decimal price, Integer stockQuantity) {
        return new Product__c(
            Name = 'Product ' + suffix,
            SKU__c = 'sku-' + suffix,
            Price__c = price,
            Stock_Quantity__c = stockQuantity,
            Category__c = 'Electronics',
            Is_Active__c = true
        );
    }

    public static Customer_Profile__c createCustomer(String suffix) {
        return new Customer_Profile__c(
            Name = 'Customer ' + suffix,
            Email__c = suffix.toLowerCase() + '@example.com'
        );
    }

    public static Commerce_Order__c createOrder(Id customerId, String paymentStatus, Decimal totalAmount) {
        return new Commerce_Order__c(
            Customer__c = customerId,
            Order_Status__c = paymentStatus == 'Paid' ? 'Paid' : 'Pending',
            Payment_Status__c = paymentStatus,
            Shipping_Status__c = 'Preparing',
            Order_Date__c = System.now(),
            Total_Amount__c = totalAmount
        );
    }
}
