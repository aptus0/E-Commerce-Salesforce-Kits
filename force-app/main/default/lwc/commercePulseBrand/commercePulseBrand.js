import { LightningElement, api } from 'lwc';

export default class CommercePulseBrand extends LightningElement {
    @api subtitle = 'Salesforce Commerce Operations';
    @api theme = 'light';

    get brandClass() {
        return `brand ${this.theme}`;
    }
}
