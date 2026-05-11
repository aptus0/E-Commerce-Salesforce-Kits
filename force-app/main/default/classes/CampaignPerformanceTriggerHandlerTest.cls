@IsTest
private class CampaignPerformanceTriggerHandlerTest {
    @IsTest
    static void shouldNormalizeDiscountCodeAndStatus() {
        Campaign_Performance__c campaign = new Campaign_Performance__c(
            Name = 'Launch Campaign',
            Discount_Code__c = ' spring-20 ',
            Orders_Count__c = 5,
            Revenue_Generated__c = 1250
        );
        insert campaign;

        Campaign_Performance__c stored = [
            SELECT Discount_Code__c, Status__c
            FROM Campaign_Performance__c
            WHERE Id = :campaign.Id
        ];

        System.assertEquals('SPRING-20', stored.Discount_Code__c);
        System.assertEquals('Completed', stored.Status__c);
    }

    @IsTest
    static void shouldSetActiveWhenCodeExistsWithoutRevenue() {
        Campaign_Performance__c campaign = new Campaign_Performance__c(
            Name = 'Active Campaign',
            Discount_Code__c = ' active-10 '
        );
        insert campaign;

        Campaign_Performance__c stored = [
            SELECT Discount_Code__c, Status__c
            FROM Campaign_Performance__c
            WHERE Id = :campaign.Id
        ];

        System.assertEquals('ACTIVE-10', stored.Discount_Code__c);
        System.assertEquals('Active', stored.Status__c);
    }

    @IsTest
    static void shouldRemainDraftWithoutSignals() {
        Campaign_Performance__c campaign = new Campaign_Performance__c(
            Name = 'Draft Campaign'
        );
        insert campaign;

        Campaign_Performance__c stored = [
            SELECT Status__c
            FROM Campaign_Performance__c
            WHERE Id = :campaign.Id
        ];

        System.assertEquals('Draft', stored.Status__c);
    }
}
