
//Rudimentary 
var lolData = require("./lib/loldata");

lolData.initialize('key-goes-here');

lolData.getChampions(true, function(err, data) {

	if (!err) {
		console.log(data);
	}
	else {
		console.log("Error code: " + err.status + " " + err.status.message);
	}

	console.log(data);
});