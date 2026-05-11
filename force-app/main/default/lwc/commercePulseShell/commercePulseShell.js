import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

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
    metricCards = [
        { label: 'Custom Objects', value: '7' },
        { label: 'Apex Triggers', value: '7' },
        { label: 'Handler Classes', value: '7' },
        { label: 'Test Classes', value: '7' },
        { label: 'LWC Nav Tabs', value: '6' },
        { label: 'Frontend Surfaces', value: 'React + LWC' }
    ];

    navLinks = NAV_LINKS;

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
