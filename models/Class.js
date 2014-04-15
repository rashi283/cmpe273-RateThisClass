/**
 * New node file
 */

var mongoose = require('mongoose');
var rateSchema = new mongoose.Schema({
	ip : 'String'
});
var itemSchema = new mongoose.Schema({
	text : String,
	//Shaji
	category: String, //LAB, PROJECT, ASSIGNMENT etc
	rating : [ rateSchema ]
});
exports.ClassSchema = new mongoose.Schema({
	
	className : {
		type : String,
		required : true
	},
	professor : {
		type : String, 
		required : true
	},
	session : {
		type : String, 
		required : true
	},	
	//Shaji
	items : [ itemSchema ]
});


