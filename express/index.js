const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

/*
 *
 * Use mongoose to connect to MongoDB
 *
 * */
let dbName = 'horribleTesting'
mongoose.connect(`mongodb://localhost/${dbName}`);

/*
 *
 * do note: making db a global variable 
 * available from all files
 *
 * */
global.db = mongoose.connection;
db.on('error', () => console.log('Could not connect to DB'));
db.once('open', () => {
  console.log('Connected to DB');
 /*
  *
  * Do not start express until we 
  * have connection to mongodb
  *
  * */
  startWebServer();
});

/*
 * 
 * Define port for express
 *
 * */
const PORT = 3333;


/*
 * 
 * Full map of schemas
 * 
 * */
const collectionMap = {
	person: require('./schema/Person'),
	kitten: require('./schema/Kitten')
}

/*
 * 
 * Strip and collect collection from map
 *
 * */
function getCollection(s) {
	let name = s.replace(/[^a-z]/gi, "").toLowerCase();
	return Object.keys(collectionMap).includes(name) ? collectionMap[name] : null;
}

/*
 * 
 * Strip id
 *
 * */
function stripId(id){
	let keyhold = id.replace(/[^a-f0-9]/gi, "");
	return keyhold.length === 24 ? keyhold : null;
}



/*
 * 
 * Parse query
 *
 * */
function parseQuery(q){
	let o = {};
	for(let k in q){
		try{
			o[k] = JSON.parse(decodeURIComponent(q[k]));
		} catch(err){	}
	}
	return o; 
}

/*
 *
 * Serve static www
 * 
 * */
app.use(express.static('www'));

/*
 * 
 * Serve routes API
 * 
 * */

/*
 *
 * Post to backend
 * Used on frontend for creating new object
 *
 * */

app.post('/api/:collection', async (req, res) => {
	let collection = getCollection(req.params.collection);
	
	if(collection){
		let entity = new collection(req.body);
		await entity.save();
		res.json(entity);
	} else {
		res.status(500);
		res.json({error: "No such collection"});
	}
});


/*
 *
 * Get list of object from mongo based on query
 * Can take extra params for sort, populate etc. 
 * 
 * Used on frontend as findOne by giving distinctFirst=true in query
 *
 * */
app.get('/api/:collection', async (req, res) => {
	let collection = getCollection(req.params.collection), query = parseQuery(req.query);

	if(collection){
		let r = null; 
		r = await collection.find(query.q || {}, null, query.e || {});

		if(r.length){
			if(query.distinctFirst){
				res.json(r[0]);
			} else {
				res.json(r); 
			}
		} else {
			res.status(404);
			res.json(null)
		}
	} else {
		res.status(500);
		res.json({error: "No such collection"});
	}
}); 


/*
 *
 * Not used by frontend project 
 * Used for getting single object by id
 *
 * */
app.get('/api/:collection/:id', async (req, res) => {
	let collection = getCollection(req.params.collection); 
	let id = stripId(req.params.id);
	if(collection && id){
		res.json(await collection.findOne({_id: id}))
	} else {
		res.status(500);
		res.json({ error: !collection ? 'No such collection' : 'Invalid id format' });
	}

});

/*
 *
 * Update objects in mongo
 *
 * */
app.put('/api/:collection/:id', async (req, res) => {
	let collection = getCollection(req.params.collection); 
	let id = stripId(req.params.id);
	if(collection && id){
		let entity = await collection.findOne({_id: id});
		let replacementBody = req.body;
		Object.assign(entity, replacementBody);
		entity.save();	
		res.json(entity);
	} else {
		res.status(500);
		res.json({ error: !collection ? 'No such collection' : 'Invalid id format' });
	}	
});


/*
 *
 * Not used on frontend
 *
 * */
app.delete('/api/:collection/:id', async (req, res) => {
	let collection = getCollection(req.params.collection); 
	let id = stripId(req.params.id);
	if(collection && id){
		res.json({ successful: (await collection.deleteOne({_id: id})).n ? true : false })
	} else {
		res.status(500);
		res.json({ error: !collection ? 'No such collection' : 'Invalid id format' });
	}	
});


/*
 * 
 * Catch any 404 by serving a little tea 
 *
 * */
app.all('*', (req, res) => {
	res.status(418);
	res.send('I\'m a little teapot short and stout\nHere is my handle\nHere is my snout');
});


/*
 *
 * Create webserver 
 * 
 * */
function startWebServer(){
	app.listen(PORT, () => console.log('Listening on port ' + PORT));
}
