

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

module.exports = {
	numbers,
	removeNumber,
	lookUpNumber
}