var Character	= require("../model/character.js"); // Pulls out the Character Model
var path 			= require('path');




// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app){
	app.get('/', function(req, res){
		res.sendFile(path.join(__dirname + ''))
	});
	app.get('/order', function(req, res){
		res.sendFile(path.join(__dirname + '/../public/order.html'));
	});
	app.use(function(req, res){
		res.sendFile(path.join(__dirname + '/../public/index.html'));
	});
}