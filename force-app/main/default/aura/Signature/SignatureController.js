({
    onClear: function(cmp, evt, h) {
        cmp.find('signature').clear();
    },
    onSave: function(cmp, evt, h) {
        var allValid = cmp.find('field').reduce(function (validSoFar, inputCmp) {
            inputCmp.showHelpMessageIfInvalid();
            return validSoFar && inputCmp.get('v.validity').valid;
        }, true);
        
        if (allValid) {
            var signature = cmp.find('signature');
            var parentWoId = cmp.get("v.recordId");
            signature.capture();
            var signatureDataCmp = signature.get('v.signatureData');
            signatureDataCmp = signatureDataCmp.replace(/^data:image\/(png|jpg);base64,/, "");
            var action = cmp.get("c.saveSignature");
            action.setParams({
                "signatureBody": signatureDataCmp,
                "parentId": parentWoId
            });
            action.setCallback(this, function(response) {
                console.log(response);
                var state = response.getState();
                if (state === "SUCCESS") {
                    signature.clear();
                    $A.get("e.force:closeQuickAction").fire();
                    $A.get('e.force:refreshView').fire();
                } else {
                    console.log("Failed with state: " + state);
                }
            });
            $A.enqueueAction(action);
        } else {
            alert('Please update the invalid form entries and try again.');
        }
    },
    /*doInit:function(cmp, evt, h) {   
	var action = cmp.get("c.getWorkPerformed");
      action.setParams({            
          opportunityId: cmp.get("v.recordId")   
      });
      action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                cmp.set("v.workPerformed", response.getReturnValue().replace(/<\/?[^>]+(>|$)/g,""));
            } else {
                console.log("Failed with state: " + state);
            }
        });
      $A.enqueueAction(action);
  }*/
})