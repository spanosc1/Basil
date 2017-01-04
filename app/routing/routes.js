var Character	= require("../model/character.js"); // Pulls out the Character Model
var path 			= require('path');
var menu = require('../data/menu.json');



// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app){
	app.get('/', function(req, res){
		res.sendFile(path.join(__dirname + '/../public/order/html'))
	});
	app.get('/order', function(req, res){
		res.sendFile(path.join(__dirname + '/../public/order.html'));
	});
	app.get('/order/menu', function(req, res){
		res.json(menu);
	});
	app.use(function(req, res){
		res.sendFile(path.join(__dirname + '/../public/index.html'));
	});
}