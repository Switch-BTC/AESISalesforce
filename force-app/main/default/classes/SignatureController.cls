public with sharing class SignatureController {
    @AuraEnabled
    public static void saveSignature(Id opportunityId, String signatureData) {
        if (opportunityId == null || String.isEmpty(signatureData)) {
            throw new AuraHandledException('Opportunity ID or signature data is missing.');
        }

        // Convert the base64 signature data to a file
        Attachment attachment = new Attachment();
        attachment.ParentId = opportunityId;
        attachment.Name = 'Signature.png';
        attachment.Body = EncodingUtil.base64Decode(signatureData);
        attachment.ContentType = 'image/png';
        insert attachment;
    }
}