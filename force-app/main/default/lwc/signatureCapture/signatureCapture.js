import { LightningElement, api } from 'lwc';
import saveSignature from '@salesforce/apex/SignatureController.saveSignature';
import { FlowNavigationNextEvent } from 'lightning/flowSupport';

export default class SignatureCapture extends LightningElement {
    @api recordId; // The Opportunity ID from the Screen Flow
    canvas;
    context;
    isDrawing = false;

    renderedCallback() {
        // Configura el lienzo después de que se renderiza
        if (!this.canvas) {
            this.canvas = this.template.querySelector('.signature-canvas');
            this.context = this.canvas.getContext('2d');
            this.resizeCanvas();
            this.initializeCanvasEvents();
        }
    }

    resizeCanvas() {
        if (this.canvas) {
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;
            this.context.lineWidth = 2;
            this.context.lineCap = 'round';
            this.context.strokeStyle = '#000'; // Color negro
        }
    }

    initializeCanvasEvents() {
        // Eventos del mouse
        this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvas.addEventListener('mousemove', this.draw.bind(this));
        this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
        this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));

        // Eventos táctiles (para dispositivos móviles)
        this.canvas.addEventListener('touchstart', this.startDrawing.bind(this));
        this.canvas.addEventListener('touchmove', this.draw.bind(this));
        this.canvas.addEventListener('touchend', this.stopDrawing.bind(this));
    }

    startDrawing(event) {
        this.isDrawing = true;
        const { x, y } = this.getCanvasCoordinates(event);
        this.context.beginPath();
        this.context.moveTo(x, y);
    }

    draw(event) {
        if (!this.isDrawing) return;
        const { x, y } = this.getCanvasCoordinates(event);
        this.context.lineTo(x, y);
        this.context.stroke();
    }

    stopDrawing() {
        this.isDrawing = false;
        this.context.closePath();
    }

    getCanvasCoordinates(event) {
        const rect = this.canvas.getBoundingClientRect();
        const offsetX = event.clientX || event.touches[0].clientX;
        const offsetY = event.clientY || event.touches[0].clientY;
        return {
            x: offsetX - rect.left,
            y: offsetY - rect.top
        };
    }

    handleClear() {
        if (this.context) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    handleSave() {
        console.log('record Id...'+this.recordId);
        if (!this.canvas) return;
        const dataUrl = this.canvas.toDataURL('image/png');
        const base64Data = dataUrl.split(',')[1]; // Elimina el prefijo `data:image/png;base64,`
        console.log('antes de llamar al Apex');
        saveSignature({ opportunityId: this.recordId, signatureData: base64Data })
            .then(() => {
                // Notificación de éxito
                this.dispatchEvent(
                    new CustomEvent('notify', {
                        detail: { message: 'Signature saved successfully!' },
                    })
                );
            })
            .catch((error) => {
                console.error('Error saving signature:', error);
            });
            // Navegar al siguiente paso del flujo
            const nextNavigationEvent = new FlowNavigationNextEvent();
            this.dispatchEvent(nextNavigationEvent);
    }
}