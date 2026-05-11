import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getOrdersWorkspace from '@salesforce/apex/CommercePulseWorkspaceController.getOrdersWorkspace';

export default class CommercePulseOrdersTab extends NavigationMixin(LightningElement) {
    columns = [
        { label: 'Order', fieldName: 'orderNumber' },
        { label: 'Customer', fieldName: 'customerName' },
        { label: 'Order Status', fieldName: 'orderStatus' },
        { label: 'Payment', fieldName: 'paymentStatus' },
        { label: 'Total', fieldName: 'totalAmount', type: 'currency', typeAttributes: { currencyCode: 'USD' } }
    ];

    @wire(getOrdersWorkspace) workspace;

    get metrics() {
        const data = this.workspace.data;

        if (!data) {
            return [
                { label: 'Total Orders', value: '...' },
                { label: 'Pending Orders', value: '...' },
                { label: 'Paid Orders', value: '...' }
            ];
        }

        return [
            { label: 'Total Orders', value: String(data.totalOrders) },
            { label: 'Pending Orders', value: String(data.pendingOrders) },
            { label: 'Paid Orders', value: String(data.paidOrders) }
        ];
    }

    get rows() {
        return this.workspace.data?.records ?? [];
    }

    get isLoading() {
        return !this.workspace.data && !this.workspace.error;
    }

    get errorMessage() {
        return this.workspace.error?.body?.message || this.workspace.error?.message || 'Unable to load order data.';
    }

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
