/*
 * GET home page.
 */

exports.index = function(req, res) {
	res.render('index', {
		title : 'RateThisClass'
	});
};
var mongoose = require('mongoose');
//var db = mongoose.createConnection('localhost', 'ratethisclass');
var db = mongoose.connect('mongodb://localhost/test');
var ClassSchema = require('../models/Class.js').ClassSchema;
var Class = db.model('classes', ClassSchema);

// JSON API for list of classes
exports.list = function(req, res) {
	Class.find({}, 'className', function(error, classes) {
		res.json(classes);
	});
};
// JSON API for getting a single class
exports.thisclass = function(req, res) {
	var classId = req.params.id;
	Class.findById(classId, '', {
		lean : true
	}, function(err, thisclass) {
		if (thisclass) {
			//Anne
			for (r in thisclass.items) {
				 thisclass.items[r].rate=0;
				
			}
			
			res.json(thisclass);
		} else {
			res.json({
				error : true
			});
		}
	});
};
// JSON API for creating a new class
exports.create = function(req, res) {
	var reqBody = req.body, items = reqBody.items.filter(function(v) {
		return v.text !== '';
	}), classObj = {
		className : reqBody.className,
		professor : reqBody.professor,
		session : reqBody.session,
		items : items
	};
	var thisclass = new Class(classObj);
	thisclass.save(function(err, doc) {
		if (err || !doc) {
			throw 'Error';
		} else {
			res.json(doc);
		}
	});
};