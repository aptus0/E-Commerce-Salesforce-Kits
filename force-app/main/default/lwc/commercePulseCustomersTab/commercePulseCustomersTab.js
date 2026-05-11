import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class CommercePulseCustomersTab extends NavigationMixin(LightningElement) {
    metrics = [
        { label: 'Email Hygiene', value: 'Normalized' },
        { label: 'Segment Logic', value: 'Dynamic' },
        { label: 'Retention Lens', value: 'Built-In' }
    ];

    openList() {
        this.navigateToObject('Customer_Profile__c', 'list');
    }

    openNew() {
        this.navigateToObject('Customer_Profile__c', 'new');
    }

    navigateToObject(objectApiName, actionName) {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: { objectApiName, actionName }
        });
    }
}
