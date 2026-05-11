import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getCustomersWorkspace from '@salesforce/apex/CommercePulseWorkspaceController.getCustomersWorkspace';

export default class CommercePulseCustomersTab extends NavigationMixin(LightningElement) {
    columns = [
        { label: 'Customer', fieldName: 'fullName' },
        { label: 'Email', fieldName: 'email' },
        { label: 'Segment', fieldName: 'segment' },
        { label: 'Total Spent', fieldName: 'totalSpent', type: 'currency', typeAttributes: { currencyCode: 'USD' } },
        { label: 'Last Order', fieldName: 'lastOrderDate', type: 'date' }
    ];

    @wire(getCustomersWorkspace) workspace;

    get metrics() {
        const data = this.workspace.data;

        if (!data) {
            return [
                { label: 'Total Customers', value: '...' },
                { label: 'VIP Accounts', value: '...' },
                { label: 'New Profiles', value: '...' }
            ];
        }

        return [
            { label: 'Total Customers', value: String(data.totalCustomers) },
            { label: 'VIP Accounts', value: String(data.vipCustomers) },
            { label: 'New Profiles', value: String(data.newCustomers) }
        ];
    }

    get rows() {
        return this.workspace.data?.records ?? [];
    }

    get isLoading() {
        return !this.workspace.data && !this.workspace.error;
    }

    get errorMessage() {
        return this.workspace.error?.body?.message || this.workspace.error?.message || 'Unable to load customer data.';
    }

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
