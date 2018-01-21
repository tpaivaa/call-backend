"use strict";

let toKamailioWithWelcome = require('../callroutes').toKamailioWithWelcome;
let toKamailio = require('../callroutes').toKamailio;

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

var removeNumber = (number) => {
  for (var p in numbers) {
    if (numbers[p] == number) {
      numbers.splice(p, 1);
    }
  }
};

var isCallidInArray = (callid, arr) => {
 	console.log(arr);
	arr  = allowedCallIDs;
	console.log(arr);
	if (arr.findIndex(_strCheck) === -1) return false;
		return true;

	function _strCheck(el) {
		return el.match(callid);
	}
};

var removeCallIDFromArray = (req, arr) => {
	arr = allowedCallIDs;
	delete allowedCallIDs[req.body.callid];
};

var callRouter = (req,res,next) => {
	return new Promise((resolve, reject) => {
		let callerID = '+' + req.body.cli;
		let calledID = req.body.to.endpoint;
		if (lookUpNumber(req.body.rdnis, inKamailio)) {
			//resolve(toKamailioWithWelcome(null,callerID,calledID,null)); // message,callerID,calledID,recordCall
			allowedCallIDs.push(req.body.callid);
			console.log('Added to list of allowedIDs callid : ',req.body.callid);
			resolve(toKamailio(callerID,calledID,null)); // callerID,calledID,recordCall
		}
		else {
			console.log('Call rejected callid: ',req.body.callid);
			reject(calledID + ' number not in allowed list');
		}
	});
};

var sayHello = {
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
		    text : message || "Hei, puhelu välitetään keskukseen dodii",
		    locale : "fi-FI"
	    }],
		Action:
			{
	    	"name" : "Hangup"
			}
	};
};

module.exports = {
	numbers,
	removeNumber,
	isCallidInArray,
	lookUpNumber,
	sayHello,
	removeCallIDFromArray,
	callRouter,
	rejectCall
};