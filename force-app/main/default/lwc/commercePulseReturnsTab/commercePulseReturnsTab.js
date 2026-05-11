import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class CommercePulseReturnsTab extends NavigationMixin(LightningElement) {
    metrics = [
        { label: 'Date Defaults', value: 'Auto' },
        { label: 'Refund Guidance', value: 'Order-Aware' },
        { label: 'Risk Control', value: 'Validated' }
    ];

    openReturns() {
        this.navigateToObject('Return_Request__c', 'list');
    }

    openOrders() {
        this.navigateToObject('Commerce_Order__c', 'list');
    }

    navigateToObject(objectApiName, actionName) {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: { objectApiName, actionName }
        });
    }
}
