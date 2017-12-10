

var numbers = [];

var lookUpNumber = (number) =>  {
  for (var p in numbers) {
    if (numbers[p] == number) {
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
        number : "+46000000000",
        cli : "+358408687375",
        suppressCallbacks : false
    }
};

module.exports = {
	numbers,
	removeNumber,
	lookUpNumber,
	sayHello
};