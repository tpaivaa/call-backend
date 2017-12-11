"use strict";

let toKamailioWithWelcome = require('../callroutes').toKamailioWithWelcome;

var numbers = [];
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

var callRouter = (req,res,next) => {
	return new Promise((resolve, reject) => {
		let callerID = '+' + req.body.cli;
		let calledID = req.body.to.endpoint;
		if (lookUpNumber(req.body.rdnis, inKamailio)) {
			resolve(toKamailioWithWelcome(null,callerID,calledID,null)); // message,callerID,calledID,recordCall
		}
		else {
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
	lookUpNumber,
	sayHello,
	callRouter,
	rejectCall
};