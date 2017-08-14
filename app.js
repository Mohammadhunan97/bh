// use <dbname>
// db.<collection>.insert({})  # does not have to be a pre created collection
// db.students.insert([{"name":"dale","gpa":3.5}])
// db.students.find({}).pretty()
const express = require('express');
const app = express();
const mongo = require('mongodb');
const url = "mongodb://localhost:27017/samplesite";
const bodyParser = require("body-parser");
const c = console.log;
const MongoClient = mongo.MongoClient;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.get("/",(req,res)=>{
	MongoClient.connect(url,(err,db)=>{
		if(err){c("err",err)}else{
			c("connection established");
			let collection = db.collection('students');
			collection.find({}).toArray((err,result)=>{
				if(err){
					res.send(err);
				}else if(result.length){
					res.send(JSON.stringify(result));
					res.end();
				}else{
					res.send("no documents found")
				}
				db.close();
			})
		}
	})
})


app.get("/students/new/:id",(req,res)=>{
	res.send("entry created");
	MongoClient.connect(url,(err,db)=>{
		if(!err){
			let collection = db.collection('students');
			collection.insert({"name":req.params.id,"gpa":3.5})
		}
	})
	res.end();
})

app.get("/students/gpa/:name/:newgpa",(req,res)=>{
	MongoClient.connect(url,(err,db)=>{
		if(!err){
			let collection = db.collection('students');
			collection.updateOne({name:req.params.name},{$set: {gpa: req.params.newgpa}},function(err,result){
				if(err){c(err)}else{c(result)}
			})
		}
	})
	res.send("updated " + req.params.name + " set gpa to " + req.params.newgpa);
	res.end();
})

app.get("/students/delete/:name",function(req,res){
		let name = req.params.name;
		MongoClient.connect(url,(err,db)=>{
			if(!err){
				let collection = db.collection('students');
				collection.remove({name:req.params.name}, function (err, result){ 
	              if(err){c(err)}else{c(result)}
	            });
			}else{
				c("err",err);
			}
		})
	res.send("deleted " + name);
	res.end();
})

app.listen(3000,(err)=>{
	if(!err){
		c("listening on port ", 3000);
	}else{
		c("err",err);
	}
})
