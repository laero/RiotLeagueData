
//Rudimentary

var lolData = require("./lib/loldata");

lolData.initialize('key-goes-here');

lolData.getChampions(true, function(err, data) {
	console.log(data);
});