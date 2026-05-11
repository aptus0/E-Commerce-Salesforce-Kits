import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class CommercePulseSyncTab extends NavigationMixin(LightningElement) {
    metrics = [
        { label: 'Payload Guardrails', value: 'On' },
        { label: 'Health Trace', value: 'Tracked' },
        { label: 'Observability', value: 'Centralized' }
    ];

    openLogs() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Sync_Log__c',
                actionName: 'list'
            }
        });
    }

    openOverview() {
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'CommercePulse_Overview'
            }
        });
    }
}
