"use strict";

let toKamailioWithWelcome = require('../callroutes').toKamailioWithWelcome;
let toKamailio = require('../callroutes').toKamailio;
let svaml = require('./svaml');
let callRouter = require('./callRouter').callRouter;

let numbers = [];
let allowedCallIDs = [];
const inKamailio = [
		358931584391,358931585319,358942415835,358942415975,358942415980
];
let lookUpNumber = (number, list) =>  {
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

module.exports = {
	numbers,
	allowedCallIDs,
	removeNumber,
	isCallidInArray,
	lookUpNumber,
	sayHello,
	removeCallIDFromArray,
	callRouter,
	rejectCall,
	toKamailio
};