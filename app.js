// use <dbname>
// db.<collection>.insert({})  # does not have to be a pre created collection
// db.students.insert([{"name":"dale","gpa":3.5}])
// db.students.find({}).pretty()
const express = require('express');
const app = express();
const mongo = require('mongodb');
const c = console.log;
const url = "mongodb://localhost:27017/samplesite";
let MongoClient = mongo.MongoClient;

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
			})
		}
	})
})


app.listen(3000,(err)=>{
	if(!err){
		c("listening on port ", 3000);
	}else{
		c("err",err);
	}
})
