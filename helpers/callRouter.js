"use strict";
"use es:6";
let isCallidInArray = require('../helpers').isCallidInArray;
let removeCallIDFromArray = require('../helpers').removeCallIDFromArray;
let lookUpNumber = require('../helpers').lookUpNumber;
let removeNumber = require('../helpers').removeNumber;
let allowedCallIDs = require('../helpers').allowedIDs;
let toKamailio = require('../helpers').toKamailio;
let inKamailio = require('../helpers').inKamailio;

let svaml = require('./svaml');


let callRouter = (req,res,next) => {
	return new Promise((resolve, reject) => {
		if (req.body.originationType === 'pstn'){
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
		reject(svaml.nok);
	});
	
};

module.exports = {
	callRouter
};
