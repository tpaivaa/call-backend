"use strict";

var toKamailioWithWelcome = (message,callerID,calledID,recordCall) => {

	return {
		Instructions: [{
		    name : "Say",
		    text : message || "Hei, puhelu välitetään keskukseen dodii",
		    locale : "fi-FI"
	    }],
		Action:
			{
			    name : "ConnectSIP",
			    destination : {
			    		endpoint: calledID + "@obelix1.lucentia.com" },
			    maxDuration : 3000,
			    cli : callerID || "private",
			    record: recordCall || false,
			    suppressCallbacks : false
			}
		};
};



module.exports = {
	toKamailioWithWelcome
};