import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getReturnsWorkspace from '@salesforce/apex/CommercePulseWorkspaceController.getReturnsWorkspace';

export default class CommercePulseReturnsTab extends NavigationMixin(LightningElement) {
    columns = [
        { label: 'Return', fieldName: 'returnNumber' },
        { label: 'Order', fieldName: 'orderNumber' },
        { label: 'Status', fieldName: 'status' },
        { label: 'Refund', fieldName: 'refundAmount', type: 'currency', typeAttributes: { currencyCode: 'USD' } },
        { label: 'Requested', fieldName: 'requestedDate', type: 'date' }
    ];

    @wire(getReturnsWorkspace) workspace;

    get metrics() {
        const data = this.workspace.data;

        if (!data) {
            return [
                { label: 'Total Returns', value: '...' },
                { label: 'Requested', value: '...' },
                { label: 'Refunded', value: '...' }
            ];
        }

        return [
            { label: 'Total Returns', value: String(data.totalReturns) },
            { label: 'Requested', value: String(data.requestedReturns) },
            { label: 'Refunded', value: String(data.refundedReturns) }
        ];
    }

    get rows() {
        return this.workspace.data?.records ?? [];
    }

    get isLoading() {
        return !this.workspace.data && !this.workspace.error;
    }

    get errorMessage() {
        return this.workspace.error?.body?.message || this.workspace.error?.message || 'Unable to load return data.';
    }

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
