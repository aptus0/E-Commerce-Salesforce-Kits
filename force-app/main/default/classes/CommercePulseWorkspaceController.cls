public with sharing class CommercePulseWorkspaceController {
    public class OverviewData {
        @AuraEnabled public Integer productCount;
        @AuraEnabled public Integer customerCount;
        @AuraEnabled public Integer orderCount;
        @AuraEnabled public Integer returnCount;
        @AuraEnabled public Integer campaignCount;
        @AuraEnabled public Integer syncLogCount;
        @AuraEnabled public List<SyncLogRow> recentSyncLogs;
    }

    public class ProductsWorkspaceData {
        @AuraEnabled public Integer totalProducts;
        @AuraEnabled public Integer activeProducts;
        @AuraEnabled public Integer lowStockProducts;
        @AuraEnabled public List<ProductRow> records;
    }

    public class CustomersWorkspaceData {
        @AuraEnabled public Integer totalCustomers;
        @AuraEnabled public Integer vipCustomers;
        @AuraEnabled public Integer newCustomers;
        @AuraEnabled public List<CustomerRow> records;
    }

    public class OrdersWorkspaceData {
        @AuraEnabled public Integer totalOrders;
        @AuraEnabled public Integer pendingOrders;
        @AuraEnabled public Integer paidOrders;
        @AuraEnabled public List<OrderRow> records;
    }

    public class ReturnsWorkspaceData {
        @AuraEnabled public Integer totalReturns;
        @AuraEnabled public Integer requestedReturns;
        @AuraEnabled public Integer refundedReturns;
        @AuraEnabled public List<ReturnRow> records;
    }

    public class CampaignsWorkspaceData {
        @AuraEnabled public Integer totalCampaigns;
        @AuraEnabled public Integer activeCampaigns;
        @AuraEnabled public Decimal revenueTotal;
        @AuraEnabled public List<CampaignRow> records;
    }

    public class SyncWorkspaceData {
        @AuraEnabled public Integer totalLogs;
        @AuraEnabled public Integer failedLogs;
        @AuraEnabled public Integer warningLogs;
        @AuraEnabled public List<SyncLogRow> records;
    }

    public class ProductRow {
        @AuraEnabled public Id id;
        @AuraEnabled public String name;
        @AuraEnabled public String sku;
        @AuraEnabled public Decimal price;
        @AuraEnabled public Decimal stockQuantity;
        @AuraEnabled public String category;
    }

    public class CustomerRow {
        @AuraEnabled public Id id;
        @AuraEnabled public String fullName;
        @AuraEnabled public String email;
        @AuraEnabled public String phone;
        @AuraEnabled public Decimal totalSpent;
        @AuraEnabled public String segment;
        @AuraEnabled public Date lastOrderDate;
    }

    public class OrderRow {
        @AuraEnabled public Id id;
        @AuraEnabled public String orderNumber;
        @AuraEnabled public String customerName;
        @AuraEnabled public String orderStatus;
        @AuraEnabled public String paymentStatus;
        @AuraEnabled public String shippingStatus;
        @AuraEnabled public Decimal totalAmount;
        @AuraEnabled public Datetime orderDate;
    }

    public class ReturnRow {
        @AuraEnabled public Id id;
        @AuraEnabled public String returnNumber;
        @AuraEnabled public String orderNumber;
        @AuraEnabled public String status;
        @AuraEnabled public Decimal refundAmount;
        @AuraEnabled public Date requestedDate;
        @AuraEnabled public String reason;
    }

    public class CampaignRow {
        @AuraEnabled public Id id;
        @AuraEnabled public String campaignName;
        @AuraEnabled public String discountCode;
        @AuraEnabled public Decimal revenueGenerated;
        @AuraEnabled public Decimal ordersCount;
        @AuraEnabled public Decimal conversionRate;
        @AuraEnabled public String status;
    }

    public class SyncLogRow {
        @AuraEnabled public Id id;
        @AuraEnabled public String sourceSystem;
        @AuraEnabled public String operationType;
        @AuraEnabled public String status;
        @AuraEnabled public String message;
        @AuraEnabled public Datetime createdAt;
    }

    @AuraEnabled(cacheable=true)
    public static OverviewData getOverviewData() {
        OverviewData data = new OverviewData();
        data.productCount = [SELECT COUNT() FROM Product__c];
        data.customerCount = [SELECT COUNT() FROM Customer_Profile__c];
        data.orderCount = [SELECT COUNT() FROM Commerce_Order__c];
        data.returnCount = [SELECT COUNT() FROM Return_Request__c];
        data.campaignCount = [SELECT COUNT() FROM Campaign_Performance__c];
        data.syncLogCount = [SELECT COUNT() FROM Sync_Log__c];
        data.recentSyncLogs = new List<SyncLogRow>();

        for (Sync_Log__c record : [
            SELECT Id, Source_System__c, Operation_Type__c, Status__c, Message__c, Created_At__c
            FROM Sync_Log__c
            ORDER BY Created_At__c DESC
            LIMIT 5
        ]) {
            SyncLogRow row = new SyncLogRow();
            row.id = record.Id;
            row.sourceSystem = record.Source_System__c;
            row.operationType = record.Operation_Type__c;
            row.status = record.Status__c;
            row.message = record.Message__c;
            row.createdAt = record.Created_At__c;
            data.recentSyncLogs.add(row);
        }

        return data;
    }

    @AuraEnabled(cacheable=true)
    public static ProductsWorkspaceData getProductsWorkspace() {
        ProductsWorkspaceData data = new ProductsWorkspaceData();
        data.totalProducts = [SELECT COUNT() FROM Product__c];
        data.activeProducts = [SELECT COUNT() FROM Product__c WHERE Is_Active__c = true];
        data.lowStockProducts = [SELECT COUNT() FROM Product__c WHERE Stock_Quantity__c <= 5];
        data.records = new List<ProductRow>();

        for (Product__c record : [
            SELECT Id, Name, SKU__c, Price__c, Stock_Quantity__c, Category__c
            FROM Product__c
            ORDER BY LastModifiedDate DESC
            LIMIT 5
        ]) {
            ProductRow row = new ProductRow();
            row.id = record.Id;
            row.name = record.Name;
            row.sku = record.SKU__c;
            row.price = record.Price__c;
            row.stockQuantity = record.Stock_Quantity__c;
            row.category = record.Category__c;
            data.records.add(row);
        }

        return data;
    }

    @AuraEnabled(cacheable=true)
    public static CustomersWorkspaceData getCustomersWorkspace() {
        CustomersWorkspaceData data = new CustomersWorkspaceData();
        data.totalCustomers = [SELECT COUNT() FROM Customer_Profile__c];
        data.vipCustomers = [SELECT COUNT() FROM Customer_Profile__c WHERE Customer_Segment__c = 'VIP'];
        data.newCustomers = [SELECT COUNT() FROM Customer_Profile__c WHERE Customer_Segment__c = 'New'];
        data.records = new List<CustomerRow>();

        for (Customer_Profile__c record : [
            SELECT Id, Name, Email__c, Phone__c, Total_Spent__c, Customer_Segment__c, Last_Order_Date__c
            FROM Customer_Profile__c
            ORDER BY LastModifiedDate DESC
            LIMIT 5
        ]) {
            CustomerRow row = new CustomerRow();
            row.id = record.Id;
            row.fullName = record.Name;
            row.email = record.Email__c;
            row.phone = record.Phone__c;
            row.totalSpent = record.Total_Spent__c;
            row.segment = record.Customer_Segment__c;
            row.lastOrderDate = record.Last_Order_Date__c;
            data.records.add(row);
        }

        return data;
    }

    @AuraEnabled(cacheable=true)
    public static OrdersWorkspaceData getOrdersWorkspace() {
        OrdersWorkspaceData data = new OrdersWorkspaceData();
        data.totalOrders = [SELECT COUNT() FROM Commerce_Order__c];
        data.pendingOrders = [SELECT COUNT() FROM Commerce_Order__c WHERE Order_Status__c = 'Pending'];
        data.paidOrders = [SELECT COUNT() FROM Commerce_Order__c WHERE Payment_Status__c = 'Paid'];
        data.records = new List<OrderRow>();

        for (Commerce_Order__c record : [
            SELECT Id, Name, Customer__r.Name, Order_Status__c, Payment_Status__c, Shipping_Status__c,
                   Total_Amount__c, Order_Date__c
            FROM Commerce_Order__c
            ORDER BY Order_Date__c DESC
            LIMIT 5
        ]) {
            OrderRow row = new OrderRow();
            row.id = record.Id;
            row.orderNumber = record.Name;
            row.customerName = record.Customer__r != null ? record.Customer__r.Name : 'Unknown';
            row.orderStatus = record.Order_Status__c;
            row.paymentStatus = record.Payment_Status__c;
            row.shippingStatus = record.Shipping_Status__c;
            row.totalAmount = record.Total_Amount__c;
            row.orderDate = record.Order_Date__c;
            data.records.add(row);
        }

        return data;
    }

    @AuraEnabled(cacheable=true)
    public static ReturnsWorkspaceData getReturnsWorkspace() {
        ReturnsWorkspaceData data = new ReturnsWorkspaceData();
        data.totalReturns = [SELECT COUNT() FROM Return_Request__c];
        data.requestedReturns = [SELECT COUNT() FROM Return_Request__c WHERE Status__c = 'Requested'];
        data.refundedReturns = [SELECT COUNT() FROM Return_Request__c WHERE Status__c = 'Refunded'];
        data.records = new List<ReturnRow>();

        for (Return_Request__c record : [
            SELECT Id, Name, Order__r.Name, Status__c, Refund_Amount__c, Requested_Date__c, Reason__c
            FROM Return_Request__c
            ORDER BY Requested_Date__c DESC, LastModifiedDate DESC
            LIMIT 5
        ]) {
            ReturnRow row = new ReturnRow();
            row.id = record.Id;
            row.returnNumber = record.Name;
            row.orderNumber = record.Order__r != null ? record.Order__r.Name : 'Unlinked';
            row.status = record.Status__c;
            row.refundAmount = record.Refund_Amount__c;
            row.requestedDate = record.Requested_Date__c;
            row.reason = record.Reason__c;
            data.records.add(row);
        }

        return data;
    }

    @AuraEnabled(cacheable=true)
    public static CampaignsWorkspaceData getCampaignsWorkspace() {
        CampaignsWorkspaceData data = new CampaignsWorkspaceData();
        data.totalCampaigns = [SELECT COUNT() FROM Campaign_Performance__c];
        data.activeCampaigns = [SELECT COUNT() FROM Campaign_Performance__c WHERE Status__c = 'Active'];
        data.revenueTotal = 0;
        data.records = new List<CampaignRow>();

        AggregateResult[] revenueAggregate = [
            SELECT SUM(Revenue_Generated__c) revenueTotal
            FROM Campaign_Performance__c
        ];

        if (!revenueAggregate.isEmpty() && revenueAggregate[0].get('revenueTotal') != null) {
            data.revenueTotal = (Decimal) revenueAggregate[0].get('revenueTotal');
        }

        for (Campaign_Performance__c record : [
            SELECT Id, Name, Discount_Code__c, Revenue_Generated__c, Orders_Count__c, Conversion_Rate__c, Status__c
            FROM Campaign_Performance__c
            ORDER BY LastModifiedDate DESC
            LIMIT 5
        ]) {
            CampaignRow row = new CampaignRow();
            row.id = record.Id;
            row.campaignName = record.Name;
            row.discountCode = record.Discount_Code__c;
            row.revenueGenerated = record.Revenue_Generated__c;
            row.ordersCount = record.Orders_Count__c;
            row.conversionRate = record.Conversion_Rate__c != null ? record.Conversion_Rate__c * 100 : 0;
            row.status = record.Status__c;
            data.records.add(row);
        }

        return data;
    }

    @AuraEnabled(cacheable=true)
    public static SyncWorkspaceData getSyncWorkspace() {
        SyncWorkspaceData data = new SyncWorkspaceData();
        data.totalLogs = [SELECT COUNT() FROM Sync_Log__c];
        data.failedLogs = [SELECT COUNT() FROM Sync_Log__c WHERE Status__c = 'FAILED'];
        data.warningLogs = [SELECT COUNT() FROM Sync_Log__c WHERE Status__c = 'WARNING'];
        data.records = new List<SyncLogRow>();

        for (Sync_Log__c record : [
            SELECT Id, Source_System__c, Operation_Type__c, Status__c, Message__c, Created_At__c
            FROM Sync_Log__c
            ORDER BY Created_At__c DESC
            LIMIT 6
        ]) {
            SyncLogRow row = new SyncLogRow();
            row.id = record.Id;
            row.sourceSystem = record.Source_System__c;
            row.operationType = record.Operation_Type__c;
            row.status = record.Status__c;
            row.message = record.Message__c;
            row.createdAt = record.Created_At__c;
            data.records.add(row);
        }

        return data;
    }
}
