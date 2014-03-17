/**
 * New node file
 */

var mongoose = require('mongoose');
var rateSchema = new mongoose.Schema({
	ip : 'String'
});
var choiceSchema = new mongoose.Schema({
	text : String,
	//category: String //LAB, PROJECT, ASSIGNMENT,
	rate : [ rateSchema ]
});
exports.ClassSchema = new mongoose.Schema({
	//Rashi
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
	category : {
		type : String,
		required : true
	}, 
	//Rashi
	choices : [ choiceSchema ]
});


