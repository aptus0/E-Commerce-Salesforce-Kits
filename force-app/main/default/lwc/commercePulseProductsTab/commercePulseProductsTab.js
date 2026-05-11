import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class CommercePulseProductsTab extends NavigationMixin(LightningElement) {
    metrics = [
        { label: 'SKU Governance', value: 'Auto' },
        { label: 'Stock Validation', value: 'Active' },
        { label: 'Launch Readiness', value: 'Workspace' }
    ];

    openList() {
        this.navigateToObject('Product__c', 'list');
    }

    openNew() {
        this.navigateToObject('Product__c', 'new');
    }

    navigateToObject(objectApiName, actionName) {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: { objectApiName, actionName }
        });
    }
}
