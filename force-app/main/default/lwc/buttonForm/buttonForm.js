import { LightningElement, track, api } from 'lwc';
 
export default class LaunchFlowButton extends LightningElement {
    @api flowApiName = 'Public_Form'; // Reemplaza con el nombre API de tu Flow
    @track isFlowRunning = false;
    @track recordId;

    get flowInputs() {
        return [
            {
                name: 'recordId',
                type: 'String',
                value: this.recordId
            }
        ];
    }
 
    // Método para iniciar el Flow
    handleStartFlow() {
        const currentUrl = window.location.href;

        // Encuentra la parte después de "detail/"
        const detailIndex = currentUrl.indexOf('detail/');
        if (detailIndex !== -1) {
            // Extrae todo lo que está después de "detail/"
            this.recordId = currentUrl.substring(detailIndex + 7); // 7 es la longitud de "detail/"
            console.log('Record ID:', this.recordId);
        }  
        this.isFlowRunning = true;
    }
 
    // Manejo del cambio de estado del Flow
    handleStatusChange(event) {
        if (event.detail.status === 'FINISHED') {
            this.isFlowRunning = false;
        }
    }
}