"use strict";

var toKamailioWithWelcome = (message,callerID,calledID,recordCall) => {

	return {
		Instructions: [{
		    name : "Say",
		    text : message || "Hei, puhelu välitetään keskukseen",
		    locale : "fi-FI"
	    }],
		Action:
			{
			    name : "ConnectSIP",
			    destination : {
			    		endpoint: calledID + "@obelix2.lucentia.com" },
			    maxDuration : 3000,
			    cli : callerID || "private",
			    record : recordCall || false,
			    suppressCallbacks : false
			}
	};
};

var toKamailio = (callerID,calledID,recordCall) => {

	return {
		Action:
			{
			    name: "ConnectSIP",
			    destination: { endpoint: calledID + "@obelix2.lucentia.com" },
				maxDuration: 3000,
				cli: callerID || "private",
				record: recordCall || false,
				suppressCallbacks: false
			}
	};
};

var toPSTN = (callerID,calledID,recordCall) => {
	return {
		Action:
			{
			    name: "ConnectPSTN",
    			number: calledID,
    			locale: "en-US",
    			maxDuration: 3000,
    			cli:  callerID || "private",
    			record: recordCall || false,
    			suppressCallbacks: false

			}

	};
};



module.exports = {
	toKamailioWithWelcome,
	toKamailio,
	toPSTN
};