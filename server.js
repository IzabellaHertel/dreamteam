var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('chatdatabase', ['users', 'conversations']);
var bodyParser = require('body-parser');

app.use(express.static(__dirname + "/public"));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use(bodyParser.json());

// See your work in a browser by going to "localhost:3000"
app.listen(3000, function(){
	console.log("Chat server has started");
});

// ------------------------------------ DUMMY DATA -------------------------------------//

db.users.insert( [{   
    "avatar" : {
        "name" : "Ugly Fish",
        "src" : "assets/img/av01.png"
    },
    "online" : false,
    "username" : "Izabella",
    "password" : "hejhej"
	},
	{  
    "avatar" : {
        "name" : "Zombie",
        "src" : "assets/img/av02.png"
    },
    "online" : false,
    "username" : "Colin",
    "password" : "hejhej"
	},
	{   
    "avatar" : {
        "name" : "Rico Tequila",
        "src" : "assets/img/av03.png"
    },
    "online" : false,
    "username" : "Tobias",
    "password" : "hejhej"
	},
	{ 
    "avatar" : {
        "name" : "Doggy style",
        "src" : "assets/img/av04.png"
    },
    "online" : false,
    "username" : "Daniel",
    "password" : "hejhej"
	}
])	

// ------------------------------------ USERS -------------------------------------//

// Checks & displays any messages sent to the server/database.

app.get('/users', function(request, res) {
	console.log("GET - users");

	db.users.find(function(err, docs) {
		//console.log(docs);
		res.json(docs);
	});
});

// Adding a user to the database (users)

app.post('/users/', function(req, res) {
	//console.log(req.body);
	db.users.insert(req.body, function(err, doc) {
		res.json(doc);
	});
});

// Deleting a user of the database (users)

app.delete('/users/:id', function(req, res) {
	var id = req.params.id;
	//console.log(id);
	db.users.remove({_id: mongojs.ObjectId(id)}, function(err, doc) {
		res.json(doc);
	});
});



// --------------------------------- OFFLINE / ONLINE -------------------------------------//


app.get('/users/:id', function(req, res) {
	var id = req.params.id;
	db.users.findOne({_id: mongojs.ObjectId(id)}, function (err, doc) {
		res.json(doc);
	});
});

// login


app.put('/users/:id', function(req, res) {
	var id = req.params.id;
	console.log("test");
	db.users.findAndModify({query: {_id: mongojs.ObjectId(id)},
		update: {$set: { online: true }},
		new: true}, function (err, doc) {
			res.json(doc);
	});
});

app.post('/users/:id', function(req,res) {
	console.log(req.body);
	db.users.insert(req.body, function(req, res) {
		res.json(doc);
	});
});

// logout

app.put('/users/1/:id', function(req, res) {
	var id = req.params.id;

	db.users.findAndModify({query: {_id: mongojs.ObjectId(id)},
		update: {$set: { online: false }},
		new: true}, function (err, doc) {
			res.json(doc);
	});
});


// ------------------------------------ MESSAGES -------------------------------------//

// Checks & displays any messages sent to the server/database.

app.get('/conversations', function(request, res) {
	console.log("Get - conversations");

	db.conversations.find(function(err, docs) {
		res.json(docs);
	});
});

// Adding a message

app.post('/conversations/', function(req, res) {
	db.conversations.insert(req.body, function(err, doc) {
		res.json(doc);
	});
});

app.get('/users/private/:id', function(req, res) {
	var id = req.params.id;
	console.log(id);
	db.users.findOne({_id: mongojs.ObjectId(id)}, function (err, doc) {
		res.json(doc);
	});
});

// ----------------------------------- EDIT USER ----------------------------------- //

// If the user wants to unregister
app.delete('/users/3/:id', function(req, res){
	var id = req.params.id;
	db.users.remove({_id: mongojs.ObjectId(id)}, function(err, doc){
		res.json(doc);
	});
});

// If the user wants to change password
app.put('/users/password/:id', function(req, res){
	var id = req.params.id;
	db.users.findAndModify({
		query: {_id: mongojs.ObjectId(id)},
		update: {$set: {password: req.body.password}},
		new: true }, 
		function(err, doc){
			res.json(doc);
		}
	);
});

// If the user wants to change avatar
