import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getCampaignsWorkspace from '@salesforce/apex/CommercePulseWorkspaceController.getCampaignsWorkspace';

export default class CommercePulseCampaignsTab extends NavigationMixin(LightningElement) {
    columns = [
        { label: 'Campaign', fieldName: 'campaignName' },
        { label: 'Code', fieldName: 'discountCode' },
        { label: 'Revenue', fieldName: 'revenueGenerated', type: 'currency', typeAttributes: { currencyCode: 'USD' } },
        { label: 'Orders', fieldName: 'ordersCount', type: 'number' },
        { label: 'Conversion %', fieldName: 'conversionRate', type: 'number', typeAttributes: { maximumFractionDigits: 1, minimumFractionDigits: 1 } }
    ];

    @wire(getCampaignsWorkspace) workspace;

    get metrics() {
        const data = this.workspace.data;

        if (!data) {
            return [
                { label: 'Total Campaigns', value: '...' },
                { label: 'Active Campaigns', value: '...' },
                { label: 'Revenue Total', value: '...' }
            ];
        }

        return [
            { label: 'Total Campaigns', value: String(data.totalCampaigns) },
            { label: 'Active Campaigns', value: String(data.activeCampaigns) },
            { label: 'Revenue Total', value: `$${Number(data.revenueTotal ?? 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}` }
        ];
    }

    get rows() {
        return this.workspace.data?.records ?? [];
    }

    get isLoading() {
        return !this.workspace.data && !this.workspace.error;
    }

    get errorMessage() {
        return this.workspace.error?.body?.message || this.workspace.error?.message || 'Unable to load campaign data.';
    }

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
