/**
 * New node file
 */

var mongoose = require('mongoose');
var rateSchema = new mongoose.Schema({
	ip : 'String',
	rating_scale : Number,
	user: 'String'
});
var itemSchema = new mongoose.Schema({
	text : String,
	//Shaji
	category: String, //LAB, PROJECT, ASSIGNMENT etc
	rating : [ rateSchema ],
	averageRating : Number
});
var commentSchema=new mongoose.Schema({
	text:String
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
	items : [ itemSchema ],
	comments:[ commentSchema ],
	totalRating : Number
});


