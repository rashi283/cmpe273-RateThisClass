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
	Class.find({}, 'question', function(error, classes) {
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
			var userVoted = false, userChoice, totalVotes = 0;
			for (c in thisclass.choices) {
				var choice = thisclass.choices[c];
				for (v in choice.votes) {
					var vote = choice.votes[v];
					totalVotes++;
					if (vote.ip === (req.header('x-forwarded-for') || req.ip)) {
						userVoted = true;
						userChoice = {
							_id : choice._id,
							text : choice.text
						};
					}
				}
			}
			thisclass.userVoted = userVoted;
			thisclass.userChoice = userChoice;
			thisclass.totalVotes = totalVotes;
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
	var reqBody = req.body, choices = reqBody.choices.filter(function(v) {
		return v.text !== '';
	}), classObj = {
		question : reqBody.question,
		choices : choices
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