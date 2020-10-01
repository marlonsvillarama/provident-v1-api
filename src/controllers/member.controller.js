/*
	admin_account
	firstname
	middlename
	lastname
	dob
	email
	mobilephone
	homephone
	empid
	title
	location
	office
    membersince
    bankname
    accname
    accnumber
    pwd
    isactive
    hasaccess
	
	beneficiaries [] = 
		firstname
		middlename
		lastname
		dob
		email
		relationship
*/
const { MongoClient, ObjectID } = require('mongodb');
const DB_CONFIG = require('../db.config');

exports.create = (req, res) => {
    console.log('create...');
    console.log(req.body);

    const client = new MongoClient(DB_CONFIG.url);

    async function run() {
        try {
            await client.connect();
    
            const db = client.db(DB_CONFIG.db);
            console.log("Successfully connected to the database!");
            // res.send({ msg: "Successfully connected to the database!" });
    
            var objMem = req.body;
            objMem.beneficiaries = [];

            // const coll = db.collection(DB_CONFIG.collections.MEMBERS);
            const result = await db.collection(DB_CONFIG.collections.MEMBERS).insertOne(objMem);
            console.log(result);
            res.send(result);
        }
        finally {
            await client.close();
            console.log("Closed connection. Goodbye!");
        }
    }
    run().then().catch(console.dir);
    
}

exports.delete = (req, res) => {

}

exports.find = (req, res) => {
    // console.log({ DB_CONFIG });
    const client = new MongoClient(DB_CONFIG.url);

    const name = req.query.name;
    const loc = req.query.loc;

    var condition = name ? { fullname: { $regex: new RegExp(name), $options: "i" }} : {};

    if (loc) {
        condition.location = loc;
    }
    console.log({ condition });

    var fields = {
        firstname: 1,
        lastname: 1,
        dob: 1,
        title: 1,
        email: 1,
        mobilephone: 1
    };

    async function run() {
        try {
            await client.connect();
    
            const db = client.db(DB_CONFIG.db);
            console.log("Successfully connected to the database!");
    
            // const coll = db.collection(DB_CONFIG.collections.MEMBERS);
            const members = await
                db.collection(DB_CONFIG.collections.MEMBERS)
                    .find(condition)
                    .project(fields)
                    .toArray();
            console.log(members);
            res.send(members);
        }
        finally {
            await client.close();
            console.log("Closed connection. Goodbye!");
        }
    }
    run().then().catch(console.dir);
}

exports.get = (req, res) => {
    // console.log({ DB_CONFIG });
    const client = new MongoClient(DB_CONFIG.url);

    const id = req.params.id;
    console.log(`get id = ${id}`);
    // var condition = name ? { fullname: { $regex: new RegExp(name), $options: "i" }} : {};
    // console.log({ condition });

    async function run() {
        try {
            await client.connect();
    
            const db = client.db(DB_CONFIG.db);
            console.log("Successfully connected to the database!");
    
            // const coll = db.collection(DB_CONFIG.collections.MEMBERS);
            const rset = await db.collection(DB_CONFIG.collections.MEMBERS).findOne({ "_id": ObjectID(id) });
            console.log(rset);
            res.send(rset);
        }
        finally {
            await client.close();
            console.log("Closed connection. Goodbye!");
        }
    }

    run().then()
        .catch(err => {
            console.log(err);
        });
}

exports.getContributions = (req, res) => {
}

exports.update = (req, res) => {
    const id = req.query.id;
    console.log(`updating id=${id}`);
    console.log(req.body);

    const client = new MongoClient(DB_CONFIG.url);

    if (Object.keys(req.body).length <= 0) {
        res.send({ ok: true, msg: 'Success' });
        return;
    }

    async function run() {
        try {
            await client.connect();
            
            const db = client.db(DB_CONFIG.db);
            console.log("Successfully connected to the database!");
            
            const result = await db.collection(DB_CONFIG.collections.MEMBERS)
                .updateOne({ "_id": ObjectID(id) }, {$set:req.body});
            console.log(result);
            res.send({ ok: true, msg: 'Success' });
        }
        finally {
            await client.close();
            console.log("Closed connection. Goodbye!");
        }
    }

    run().then().catch(err => {
        res.send({ ok: false, msg: err.resultText.toString() });
    });
}

