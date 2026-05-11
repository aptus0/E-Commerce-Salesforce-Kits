trigger CampaignPerformanceTrigger on Campaign_Performance__c (before insert, before update) {
    CampaignPerformanceTriggerHandler.prepareCampaigns(Trigger.new);
}
