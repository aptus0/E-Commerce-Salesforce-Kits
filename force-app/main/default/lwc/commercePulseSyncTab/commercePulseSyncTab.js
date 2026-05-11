import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getSyncWorkspace from '@salesforce/apex/CommercePulseWorkspaceController.getSyncWorkspace';

export default class CommercePulseSyncTab extends NavigationMixin(LightningElement) {
    columns = [
        { label: 'Source', fieldName: 'sourceSystem' },
        { label: 'Operation', fieldName: 'operationType' },
        { label: 'Status', fieldName: 'status' },
        { label: 'Message', fieldName: 'message' },
        { label: 'Created', fieldName: 'createdAt', type: 'date', typeAttributes: { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' } }
    ];

    @wire(getSyncWorkspace) workspace;

    get metrics() {
        const data = this.workspace.data;

        if (!data) {
            return [
                { label: 'Total Logs', value: '...' },
                { label: 'Failed Logs', value: '...' },
                { label: 'Warnings', value: '...' }
            ];
        }

        return [
            { label: 'Total Logs', value: String(data.totalLogs) },
            { label: 'Failed Logs', value: String(data.failedLogs) },
            { label: 'Warnings', value: String(data.warningLogs) }
        ];
    }

    get rows() {
        return this.workspace.data?.records ?? [];
    }

    get isLoading() {
        return !this.workspace.data && !this.workspace.error;
    }

    get errorMessage() {
        return this.workspace.error?.body?.message || this.workspace.error?.message || 'Unable to load sync data.';
    }

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
