// add requires
var express = require('express');
var router = express.Router();
var helpers = require('../helpers');

router.post('/', function (req, res, next) {
	if (req.body['event'] === 'ice'){
		res.json(helpers.sayHello);
	}	
	else if (req.body['event'] === 'VerificationRequestEvent') {
	    if (helpers.lookUpNumber(req.body['identity']['endpoint'])) {
	      res.json({ action: 'allow' });
	 
	    } else {
	      res.json({ 'action': 'deny' });
	    }
	}
	else if (req.body['event'] === 'VerificationResultEvent') {
	  	if (req.body['status'] === 'SUCCESSFUL') {
		  //remove the number if it was SUCCESSFUL
		  helpers.removeNumber(req.body['identity']['endpoint']);
		  res.status(200); //Sinch realy dosent care if you reply but its a nice gesture to reply to us :D
		  res.json();
		}
		else {
		  //take some action in the app to let the user know it failed. 
		}
	}
});


router.post('/addnumber', function (req, res) {
  //your custom api security like an oath bearer token
  //in this tutorials we are going to save the numbers in memory, 
  //in production you prob want to either persist it or use a rediscache or similiar
  helpers.numbers.push(req.body['number']);
  res.json({ message: 'Ok' });
});






module.exports = router;