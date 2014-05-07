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
//var db = mongoose.connect('mongodb://localhost/test');
var db = mongoose.connect('mongodb://shaji:shaji@ds053658.mongolab.com:53658/ratethisclass');
var ClassSchema = require('../models/Class.js').ClassSchema;
var Class = db.model('classes', ClassSchema);

//aws ses
var aws = require('aws-sdk');
aws.config.loadFromPath('config.json');
var ses = new aws.SES({apiVersion: '2010-12-01'});
//verified email id for admin
var to = ['ratethisclass@gmail.com'];
var from = 'ratethisclass@gmail.com';

// JSON API for list of classes
exports.list = function(req, res) {
	Class.find({}, 'className', function(error, classes) {
		res.json(classes);
	});
};
// JSON API for getting a single class
exports.thisclass = function(req, res) {
	var classId = req.params.id;
	var userId = req.query.user;
	console.log("************"+userId);
	Class.findById(classId, '', {lean : true}, function(err, thisclass) {
		var userRated = false, userItem, classRated = true;
		var class_rtng_sum = 0; var class_tot_rating = 0;
		var rated_item = 0;
		if (thisclass) 
		{
			for (i in thisclass.items) 
			{
				var item = thisclass.items[i];
				var total_rate = 0, averageRating = 0;
				if (item.rating.length > 0)
				{
					for (r in item.rating) 
				    {
						var rate = item.rating[r];
						total_rate = total_rate + rate.rating_scale;
				    }
					averageRating = total_rate/item.rating.length;
			        item.averageRating = averageRating;
			        for (rat in item.rating)
			        {
			        	var rte = item.rating[rat];
			        	console.log(rte.user);
			        	console.log(rte.rating_scale);
			        	console.log(userId);
			        	if(rte.ip === (req.header('x-forwarded-for') || req.ip) && (rte.rating_scale))
			        	{
			        		console.log("After checking user id... Entering the loop");
							userRated = true;
							userItem = {_id: item._id, category: item.category, text: item.text, rating: rte.rating_scale, averageRating: item.averageRating };
			        	}
			        }
				}//end of if
				else
				{
					userRated = false;
					userItem = {_id: item._id, category: item.category, text: item.text, rating: item.rating.rating_scale, averageRating: item.averageRating };
				}
				item.userRated = userRated;
				item.userItem = userItem;
				console.log("===================");
				console.log(item.userRated);
				console.log("===================");
			}
			
			for (i in thisclass.items) 
			{
				var item = thisclass.items[i];
				if(item.userRated) 
				{
					var total_rate = 0, averageRating = 0;
					rated_item++; 
					for(var count = 0; count < item.rating.length; count++)
					{
						var rate = item.rating[count];
						total_rate = total_rate + rate.rating_scale;
				    }
					averageRating = total_rate/item.rating.length;
			        item.averageRating = Math.round(averageRating*100)/100;
			        class_rtng_sum = class_rtng_sum + item.averageRating;
				}
				
			}
			console.log("rated item "+rated_item);
			class_tot_rating = class_rtng_sum/rated_item;
			for(a in thisclass.items)
			{
				var get_item = thisclass.items[a];
				if(get_item.userRated == false)
				{
					classRated = false;
					break;
				}
				
			}
			thisclass.userRated = classRated;
			console.log("-------------total rating whioofofofo------------");
			console.log(thisclass.userRated);
			thisclass.totalRating = Math.round(class_tot_rating*100)/100;
			console.log(thisclass.totalRating);
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
			ses.sendEmail( { 
				   Source: from, 
				   Destination: { ToAddresses: to },
				   Message: {
				       Subject: {
				          Data: 'A New Class created - notification from RateThisClass'
				       },
				       Body: {
				           Text: {
				               Data: 'Hello Admin,\nA new class with class name:'+thisclass.className+ ' has been created!.\nPlease make sure that the class '+thisclass.className+' taught by '+thisclass.professor+' exists in Session '+thisclass.session+". Thank you!",
				           }
				        }
				   }
				}
				, function(err, data) {
				    if(err) console.log(err);
				        console.log('Email sent:');
				        console.log(data);
				 });
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
      item.rating.push({ ip: ip, rating_scale: data.rating, user: data.user }); 
      var class_rating_sum = 0; var class_total_rating = 0, item_rated = 0;
      
      thisclass.save(function(err, doc) {
        var class_doc = { 
          className: doc.className, professor: doc.professor, session: doc.session, _id: doc._id, items: doc.items, 
          totalRating: 0 
        };
                
        for(var i = 0, ln = doc.items.length; i < ln; i++) {
        	
          var item = doc.items[i];
          console.log("..............................................");
          console.log(item);
          var sum_rate = 0, averageRating = 0; 
          if(item.rating.length > 0)
          {
          for(var j = 0, jLn = item.rating.length; j < jLn; j++) {
        	  var rating_arr_element = item.rating[j];
        	  sum_rate = sum_rate + rating_arr_element.rating_scale; 
          }
          averageRating = sum_rate/item.rating.length;
          item.averageRating = Math.round(averageRating*100)/100; 
          console.log("-------------Item's average rating.........");
          console.log(item.averageRating);
          class_doc.items[i].averageRating = item.averageRating;
          doc.items[i].averageRating = item.averageRating;
          }//end of if
          /*else
        	  {
        	  	item.averageRating = 0;
        	  }*/
          for(var k = 0, kLn = item.rating.length; k < kLn; k++) 
          {
        	 var rating_array = item.rating[k];
        	 class_doc.ip = ip;
            if((rating_array.ip === ip) && (rating_array.rating_scale)) 
            {
            	class_doc.userRated = true;
	            class_doc.userItem = { _id: item._id, category: item.category, text: item.text, rating: rating_array.rating_scale, averageRating: item.averageRating};
            }
            
          }
          if(item.averageRating)
    	  {
        	  item_rated++;
        	  class_rating_sum = class_rating_sum + item.averageRating;
    	  }
          else
    	  {
        	  item.averageRating = 0;
        	  class_rating_sum = class_rating_sum + item.averageRating;
    	  }
        } 
        console.log("Items that were rated: ", item_rated);
        class_total_rating =  class_rating_sum/item_rated;
        class_doc.totalRating = Math.round(class_total_rating*100)/100;
        console.log("----------------Class's Total Rating---------------");
        console.log(class_doc.totalRating);
        doc.totalRating = class_doc.totalRating; 
        //console.log("============================");
        //console.log(class_doc);
        //console.log("============================");
        doc.save(function(err, result) {
      	  if(result){
      	  console.log("Database updated with total Rating");
      	  }else{
      	  console.log(err);
      	  }
      	  });
        socket.emit('self_rate', class_doc);
        socket.broadcast.emit('rate', class_doc);
      });     
    });
  });
};

//JSON API for updating a class
exports.update=function(req,res){
	var reqBody = req.body;
	console.log(reqBody);
	var item=reqBody; 
	var classId=req.params.id;
	Class.findById(classId, '', {
		lean : true
	}, function(err, thisclass) {
		if (thisclass) {
			
			Class.update({ '_id' : classId}, {$push:{items:reqBody}}, function(err, result){
				if (err || !result) {
					throw 'Error';
				} else {					
					res.json(result);
				}
	            });
		}
	});	
};
//Rashi
exports.del = function(req, res){
	var clsId = req.params.id;
	Class.findById(clsId, '', {
		lean : true
	}, function(err, thisclass) {
		if (thisclass) {
			
			Class.remove({ '_id' : clsId}, function(err, result){
				if (err || !result) {
					throw 'Error';
				} else {
					res.json(result);
				}
	            });
		}
	});	
};
//Rashi

exports.addComment=function(req,res){
	console.log("hi i am here");
	var reqBody = req.body;
	console.log(reqBody);
	var classId=req.params.id;
	Class.findById(classId, '', {
		lean : true
	}, function(err, thisclass) {
		if (thisclass) {
			
			//Class.update({ '_id' : classId}, {$set:reqBody}, function(err, result){
			Class.update({ '_id' : classId}, {$push:{comments:reqBody}}, function(err, result){
				if (err || !result) {
					throw 'Error';
				} else {
					res.json(result);
				}
	            });
		}
	});	
};


