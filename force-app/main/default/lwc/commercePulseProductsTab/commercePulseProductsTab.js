import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getProductsWorkspace from '@salesforce/apex/CommercePulseWorkspaceController.getProductsWorkspace';

export default class CommercePulseProductsTab extends NavigationMixin(LightningElement) {
    columns = [
        { label: 'Product', fieldName: 'name' },
        { label: 'SKU', fieldName: 'sku' },
        { label: 'Price', fieldName: 'price', type: 'currency', typeAttributes: { currencyCode: 'USD' } },
        { label: 'Stock', fieldName: 'stockQuantity', type: 'number' },
        { label: 'Category', fieldName: 'category' }
    ];

    @wire(getProductsWorkspace) workspace;

    get metrics() {
        const data = this.workspace.data;

        if (!data) {
            return [
                { label: 'Total Products', value: '...' },
                { label: 'Active Catalog', value: '...' },
                { label: 'Low Stock', value: '...' }
            ];
        }

        return [
            { label: 'Total Products', value: String(data.totalProducts) },
            { label: 'Active Catalog', value: String(data.activeProducts) },
            { label: 'Low Stock', value: String(data.lowStockProducts) }
        ];
    }

    get rows() {
        return this.workspace.data?.records ?? [];
    }

    get isLoading() {
        return !this.workspace.data && !this.workspace.error;
    }

    get errorMessage() {
        return this.workspace.error?.body?.message || this.workspace.error?.message || 'Unable to load product data.';
    }

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
