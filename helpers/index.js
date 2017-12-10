

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
	    text : "Hello, this is a text to speech message",
	    locale : "en-US"
    }]
};

module.exports = {
	numbers,
	removeNumber,
	lookUpNumber,
	sayHello
};