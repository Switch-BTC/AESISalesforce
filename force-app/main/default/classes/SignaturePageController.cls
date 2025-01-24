public with sharing class SignaturePageController {
 
    @AuraEnabled
    public static boolean saveSignature(String signatureBody, id parentId){
        try{
            Attachment a = new Attachment();
            a.ParentId = parentId;
            a.Body = EncodingUtil.base64Decode(signatureBody);
            a.ContentType = 'image/png';
            a.Name = 'Signature Capture.png';
            insert a;

            Schema.SObjectType sobjectType = parentId.getSObjectType();
            String sobjectName = sobjectType.getDescribe().getName();
            sObject s = Schema.getGlobalDescribe().get(sobjectName).newSObject() ;
            s.put('Id',parentId);
            s.put('SignatureId__c', a.Id);
            update s;
            //sendEmail(parentId);
            return true;
        }catch(Exception e){
            system.debug('Error: ' + e);
            return false;
        }
    }
}