"use strict";

let toKamailioWithWelcome = require('../callroutes').toKamailioWithWelcome;
let toKamailio = require('../callroutes').toKamailio;
let toPSTN = require('../callroutes').toPSTN;
let svaml = require('./svaml');

let winston = require('winston');
require('winston-azure-table-storage');

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
	arr = allowedCallIDs;	
	
	if (arr.findIndex(_strCheck) === -1) return false;
		return true;

	function _strCheck(el) {
		return el.match(callid);
	}
};

let addCallIDToArray = (callid, arr, dir) => {
	arr = allowedCallIDs;	

	//console.log('Adding to allowed id\'s array callid : ',callid);
	logger.log('info','Adding to allowed id\'s array callid : %s', callid, {});
	arr.push(callid);
};

let removeCallIDFromArray = (callid, arr, dir) => {
	arr = allowedCallIDs;	
	//console.log('Removing from array callid :',callid);
	logger.log('info','Removing from array callid : %s', callid, {});
	delete arr[callid];
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
		if (req.body.originationType === 'PSTN') {
				inBound(req,res,next)
				.then((reply) => {
					resolve(reply);
				})
				.catch((err) => {
					reject(err);
				});
		}
		else if (req.body.originationType === 'SIP') {
				outBound(req,res,next)
				.then((reply) => {
					resolve(reply);
				})
				.catch((err) => {
					reject(err);
				});
		}
		else {
			inCallhandle(req,res,next)
			.then((reply) => {
				resolve(reply);
			})
			.catch((err) => {
				reject(err);
			});
		}
	});
};

let inBound = (req,res,next) => {
	return new Promise((resolve, reject) => {
		if (req.body.event === 'ice'){
				//console.log('|--> inBound CALL START');
				logger.log('info','|--> inBound CALL START');
				let callerID = '+' + req.body.cli;
				let calledID = req.body.to.endpoint;
				if (lookUpNumber(req.body.rdnis, inKamailio)) {
					addCallIDToArray(req.body.callid, null, 'in');
					resolve(toKamailio(callerID,calledID,null)); // callerID,calledID,recordCall
				}
				else {
					//console.log('Call rejected callid: ',req.body.callid);
					logger.log('info','Call rejected callid: %s', req.body.callid, {});
					reject(calledID + ' number not in allowed list');
				}
			}
			else if (req.body.event === 'VerificationRequestEvent') {
			    if (lookUpNumber(req.body.identity.endpoint)) {
			      resolve(svaml.action.allow);
			    } 
			    else {
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
		if (req.body.event === 'ice'){
				//console.log('|--> outBound CALL START');
				logger.log('info','|--> outBound CALL START');
				let callerID = req.body.cli;
				let calledID = req.body.to.endpoint;
				if (lookUpNumber(req.body.cli, inKamailio)) {
					addCallIDToArray(req.body.callid, null, 'out');
					resolve(toPSTN(callerID,calledID,null)); // callerID,calledID,recordCall
				}
				else {
					//console.log('Call rejected callid: ',req.body.callid);
					logger.log('info','Call rejected callid: %s',req.body.callid, {});
					reject(calledID + ' number not in allowed list');
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

let inCallhandle = (req,res,next) => {
	return new Promise((resolve, reject) => {
		if (req.body.event === 'ace') {
				//console.log('>-- ANSWER -->');
				logger.log('info','>-- ANSWER -->');
			    if (isCallidInArray(req.body.callid)) {
			      resolve(svaml.action.continue);
			 	} 
			    else {
			      reject(svaml.action.hangup);
			    }
			}
		else if (req.body.event === 'dice') {
				removeCallIDFromArray(req.body.callid);
				//console.log('>--| inBound CALL END');
				//console.log('Removed from allowedCallIDs array callid : ', req.body.callid);
				logger.log('info','>--| inBound CALL END');
				logger.log('info','Removed from allowedCallIDs array callid : %s', req.body.callid, {});
			}
		});
};

let logger = winston.createLogger({
	  level: 'info',
	  transports: [
		new (winston.transports.Console)({ colorize:true }),
		new (winston.transports.AzureTable) ({
		account:process.env.AZURE_TABLE_STORAGE_ACCOUNT || '',
		key:process.env.AZURE_TABLE_STORAGE_KEY || '',
		table: process.env.AZURE_TABLE_STORAGE_TABLE  || 'log',
		partition: require('os').hostname() + ':' + process.pid,
		level: 'info',
		metaAsColumns: true
		})
	    ]
});



module.exports = { callRouter, numbers, logger };