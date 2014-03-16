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
	question : {
		type : String,
		required : true
	},
	choices : [ choiceSchema ]
});


