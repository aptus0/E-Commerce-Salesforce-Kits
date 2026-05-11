@IsTest
private class CommercePulseTriggerSupportTest {
    @IsTest
    static void shouldNormalizeAndDeriveUtilityValues() {
        System.assertEquals('SKU-10', CommercePulseTriggerSupport.normalizeCode(' sku-10 '));
        System.assertEquals('user@example.com', CommercePulseTriggerSupport.normalizeEmail(' USER@EXAMPLE.COM '));
        System.assertEquals('VIP', CommercePulseTriggerSupport.deriveCustomerSegment(12000, Date.today()));
        System.assertEquals('At Risk', CommercePulseTriggerSupport.deriveCustomerSegment(300, Date.today().addDays(-200)));
        System.assertEquals('Lost', CommercePulseTriggerSupport.deriveCustomerSegment(0, Date.today().addDays(-400)));
        System.assertEquals('abc', CommercePulseTriggerSupport.truncateText('abcdef', 3));
    }
}
