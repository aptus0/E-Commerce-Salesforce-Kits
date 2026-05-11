import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class CommercePulseOrdersTab extends NavigationMixin(LightningElement) {
    metrics = [
        { label: 'Defaulting', value: 'Active' },
        { label: 'Pricing Hydration', value: 'Auto' },
        { label: 'Rollup Accuracy', value: 'Real-Time' }
    ];

    openOrders() {
        this.navigateToObject('Commerce_Order__c', 'list');
    }

    openItems() {
        this.navigateToObject('Order_Item__c', 'list');
    }

    navigateToObject(objectApiName, actionName) {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: { objectApiName, actionName }
        });
    }
}
