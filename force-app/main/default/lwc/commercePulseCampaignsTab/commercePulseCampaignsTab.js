import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class CommercePulseCampaignsTab extends NavigationMixin(LightningElement) {
    metrics = [
        { label: 'Code Hygiene', value: 'Standardized' },
        { label: 'Revenue Signal', value: 'Embedded' },
        { label: 'Lifecycle Status', value: 'Smart Default' }
    ];

    openCampaigns() {
        this.navigateToObject('Campaign_Performance__c', 'list');
    }

    openNew() {
        this.navigateToObject('Campaign_Performance__c', 'new');
    }

    navigateToObject(objectApiName, actionName) {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: { objectApiName, actionName }
        });
    }
}
