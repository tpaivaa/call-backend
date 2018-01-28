"use strict";

let toKamailioWithWelcome = require('../callroutes').toKamailioWithWelcome;
let toKamailio = require('../callroutes').toKamailio;
let svaml = require('./svaml');

var numbers = [];
let allowedCallIDs = [];
const inKamailio = [
		358931584391,358931585319,358942415835,358942415975,358942415980
];
var lookUpNumber = (number, list) =>  {
  for (var p in list) {
    if (list[p] == number) {
      return true;
    }
  }
  return false;
};

let removeNumber = (number) => {
  for (var p in numbers) {
    if (numbers[p] == number) {
      numbers.splice(p, 1);
    }
  }
};

let isCallidInArray = (callid, arr) => {
 	console.log(arr);
	arr  = allowedCallIDs;
	console.log(arr);
	if (arr.findIndex(_strCheck) === -1) return false;
		return true;

	function _strCheck(el) {
		return el.match(callid);
	}
};

let removeCallIDFromArray = (req, arr) => {
	arr = allowedCallIDs;
	console.log('Removing from array callid :',req.body.callid);
	delete allowedCallIDs[req.body.callid];
};


let sayHello = {
	Instructions: [{
	    name : "Say",
	    text : "Hello, puhelu välitetään testi numeroon",
	    locale : "fi-FI"
    }],
    Action:
    {
        name : "ConnectPSTN",
        maxDuration : 600,
        number : "46000000000",
        cli : "+358408687375",
        suppressCallbacks : false
    }
};

let rejectCall = (message) => {
	return {
		Instructions: [{
		    name : "Say",
		    text : message || "Kääk, eipä onnistunut yritäthän myöhemmin uudelleen kiitos",
		    locale : "fi-FI"
	    }],
		Action:
			{
	    	"name" : "Hangup"
			}
	};
};

let callRouter = (req,res,next) => {
	return new Promise((resolve, reject) => {
		if (req.body.originationType === 'PSTN'){
				inBound(req,res,next)
				.then((reply) => {resolve(reply)})
				.catch((err) => {
					console.log(err);
					reject(err);
				});
		}
		else if (req.body.originationType === 'SIP') {
				outBound(req,res,next)
				.then((reply) => {resolve(reply)})
				.catch((err) => {
					console.log(err);
					reject(err);
				});
		}
	});
};

let inBound = (req,res,next) => {
	return new Promise((resolve, reject) => {
		if (req.body.event === 'ice'){
				console.log('|--> CALL START');
				let callerID = '+' + req.body.cli;
				let calledID = req.body.to.endpoint;
				if (lookUpNumber(req.body.rdnis, inKamailio)) {
					allowedCallIDs.push(req.body.callid);
					console.log('Added to list of allowedIDs callid : ',req.body.callid);
					resolve(toKamailio(callerID,calledID,null)); // callerID,calledID,recordCall
				}
				else {
					console.log('Call rejected callid: ',req.body.callid);
					reject(calledID + ' number not in allowed list');
				}
			}
			else if (req.body.event === 'ace') {
				console.log('>-- ANSWER -->');
			    if (isCallidInArray(req.body.callid)) {
			      resolve(svaml.action.continue);
			 
			    } else {
			      reject(svaml.action.hangup);
			    }
			}
			else if (req.body.event === 'dice') {
				removeCallIDFromArray(req);
				console.log('>--| CALL END');
				console.log('Removed from allowedCallIDs array callid : ', req.body.callid);
			}
			else if (req.body.event === 'VerificationRequestEvent') {
			    if (lookUpNumber(req.body.identity.endpoint)) {
			      resolve(svaml.action.allow);
			 
			    } else {
			      reject(svaml.action.deny);
			    }
			}
			else if (req.body.event === 'VerificationResultEvent') {
			  	if (req.body.status === 'SUCCESSFUL') {
				  //remove the number if it was SUCCESSFUL
				  removeNumber(req.body.identity.endpoint);
				  resolve(svaml.ok); //Sinch really dosent care if you reply but its a nice gesture to reply to us :D
				}
				else {
					reject(svaml.nok);
				  //take some action in the app to let the user know it failed. 
				}
			}
		});
};

let outBound = (req,res,next) => {
	return new Promise((resolve, reject) => {
		reject(svaml.action.hangup);
	});
	
};

module.exports = {
	numbers:numbers,
	allowedCallIDs,
	removeNumber,
	isCallidInArray,
	lookUpNumber,
	sayHello,
	removeCallIDFromArray,
	callRouter,
	rejectCall,
	toKamailio,
	inKamailio
};