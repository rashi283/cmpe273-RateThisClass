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
			var userRated = false, userItem, totalRating = 0;
			for (i in thisclass.items) {
				var item = thisclass.items[i];
				for (r in item.rating) {
					var rate = item.rating[r];
					totalRating++;
					if(rate.ip === (req.header('x-forwarded-for') || req.ip)) {
						userRated = true;
						userItem = {_id: item._id, category: item.category, text: item.text};
			
					}
				} 
					
			}
			thisclass.userRated = userRated;
			thisclass.userItem = userItem;
			thisclass.totalRating = totalRating;
						
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

//Socket API for saving a rate
exports.rate = function(socket) {
  socket.on('send:rate', function(data) {
    var ip = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address.address;    
    Class.findById(data.class_id, function(err, thisclass) {
      var item = thisclass.items.id(data.item);
      item.rating.push({ ip: ip });      
      thisclass.save(function(err, doc) {
        var theDoc = { 
          className: doc.className, professor: doc.professor, session: doc.session, _id: doc._id, items: doc.items, 
          userRated: false, totalRating: 0 
        };
        for(var i = 0, ln = doc.items.length; i < ln; i++) {
          var item = doc.items[i]; 
          for(var j = 0, jLn = item.rating.length; j < jLn; j++) {
            var rate = item.rating[j];
            theDoc.totalRating++;
            theDoc.ip = ip;
            if(rate.ip === ip) {
              theDoc.userRated = true;
              theDoc.userItem = { _id: item._id, category: item.category, text: item.text };
             
            }
          }
        }       
        socket.emit('myrate', theDoc);
        socket.broadcast.emit('rate', theDoc);
      });     
    });
  });
};

//JSON API for updating a class
