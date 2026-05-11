public with sharing class CampaignPerformanceTriggerHandler {
    public static void prepareCampaigns(List<Campaign_Performance__c> campaigns) {
        for (Campaign_Performance__c campaign : campaigns) {
            campaign.Discount_Code__c = CommercePulseTriggerSupport.normalizeCode(campaign.Discount_Code__c);

            if (campaign.Revenue_Generated__c == null) {
                campaign.Revenue_Generated__c = 0;
            }

            if (campaign.Orders_Count__c == null) {
                campaign.Orders_Count__c = 0;
            }

            if (campaign.Conversion_Rate__c == null) {
                campaign.Conversion_Rate__c = 0;
            }

            if (String.isBlank(campaign.Status__c) || campaign.Status__c == 'Draft') {
                if (campaign.Orders_Count__c > 0 && campaign.Revenue_Generated__c > 0) {
                    campaign.Status__c = 'Completed';
                } else if (!String.isBlank(campaign.Discount_Code__c)) {
                    campaign.Status__c = 'Active';
                } else {
                    campaign.Status__c = 'Draft';
                }
            }
        }
    }
}
