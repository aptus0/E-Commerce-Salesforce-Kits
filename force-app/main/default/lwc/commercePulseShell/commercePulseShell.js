import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getOverviewData from '@salesforce/apex/CommercePulseWorkspaceController.getOverviewData';

const NAV_LINKS = [
    {
        label: 'Products Workspace',
        target: 'CommercePulse_Products',
        copy: 'Katalog, stok, SKU ve lansman işlerini tek merkezden yönet.'
    },
    {
        label: 'Customers Workspace',
        target: 'CommercePulse_Customers',
        copy: 'Segmentasyon, harcama ve müşteri kalitesini izle.'
    },
    {
        label: 'Orders Workspace',
        target: 'CommercePulse_Orders',
        copy: 'Sipariş ve satır toplamı otomasyonlarını operasyonel olarak denetle.'
    },
    {
        label: 'Returns Workspace',
        target: 'CommercePulse_Returns',
        copy: 'Refund ve iadeleri finans etkisiyle birlikte yönet.'
    },
    {
        label: 'Campaigns Workspace',
        target: 'CommercePulse_Campaigns',
        copy: 'Kampanya ROI ve kupon performanslarını toparla.'
    },
    {
        label: 'Sync Center',
        target: 'CommercePulse_Sync',
        copy: 'Entegrasyon logları ve sağlık kontrolü ekranını aç.'
    }
];

export default class CommercePulseShell extends NavigationMixin(LightningElement) {
    recentLogColumns = [
        { label: 'Source', fieldName: 'sourceSystem' },
        { label: 'Operation', fieldName: 'operationType' },
        { label: 'Status', fieldName: 'status' },
        { label: 'Created', fieldName: 'createdAt', type: 'date', typeAttributes: { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' } }
    ];

    navLinks = NAV_LINKS;

    @wire(getOverviewData) overview;

    get metricCards() {
        const data = this.overview.data;

        if (!data) {
            return [
                { label: 'Products', value: '...' },
                { label: 'Customers', value: '...' },
                { label: 'Orders', value: '...' },
                { label: 'Returns', value: '...' },
                { label: 'Campaigns', value: '...' },
                { label: 'Sync Logs', value: '...' }
            ];
        }

        return [
            { label: 'Products', value: String(data.productCount) },
            { label: 'Customers', value: String(data.customerCount) },
            { label: 'Orders', value: String(data.orderCount) },
            { label: 'Returns', value: String(data.returnCount) },
            { label: 'Campaigns', value: String(data.campaignCount) },
            { label: 'Sync Logs', value: String(data.syncLogCount) }
        ];
    }

    get recentLogs() {
        return this.overview.data?.recentSyncLogs ?? [];
    }

    get isLoading() {
        return !this.overview.data && !this.overview.error;
    }

    get errorMessage() {
        return this.overview.error?.body?.message || this.overview.error?.message || 'Unable to load overview data.';
    }

    handleNav(event) {
        const apiName = event.currentTarget.dataset.target;

        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName
            }
        });
    }
}
