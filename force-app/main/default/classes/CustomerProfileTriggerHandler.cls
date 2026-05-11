public with sharing class CustomerProfileTriggerHandler {
    public static void prepareProfiles(List<Customer_Profile__c> profiles) {
        for (Customer_Profile__c profile : profiles) {
            profile.Email__c = CommercePulseTriggerSupport.normalizeEmail(profile.Email__c);

            if (profile.Total_Spent__c == null) {
                profile.Total_Spent__c = 0;
            }

            profile.Customer_Segment__c = CommercePulseTriggerSupport.deriveCustomerSegment(
                profile.Total_Spent__c,
                profile.Last_Order_Date__c
            );
        }
    }
}
