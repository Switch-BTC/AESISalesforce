import { LightningElement, track, api } from 'lwc';
 
export default class LaunchFlowButton extends LightningElement {

 
    // Método para redirigir
    handleRedirect() {
        window.location.href = 'https://aesinternational20--aesidevop.sandbox.my.site.com/trainingevents/s/';
    }
}