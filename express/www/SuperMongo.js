class SuperMongo{

	/*
	 *
	 * Constructor runs assign
	 * 
	 * */
	
	constructor(copy){
		if(!!copy && copy instanceof Object && !Array.isArray(copy)){
			Object.assign(this, copy);
		}
	}

	/*
	 *
	 * Check if an input object is a valid object
	 * 
	 * */
	
	static validObject(o){
		return o instanceof Object && o !== null && !Array.isArray(o);
	}

	/*
	 * 
	 * Sends object to backend 
	 * create a new if not already consisting of _id field 
	 * or update old
	 *
	 * */

	async save(){
		let r, url, method;
		url = `${window.location.origin}/api/${this.constructor.name}`
		url += this._id ? `/${this._id}` : ``; 
		method = this._id ? 'PUT' : 'POST';
		r = await fetch(url, {
				method,
				body: JSON.stringify(this), 
				headers: {
					'Content-Type': 'application/json'
				}
		});

		if(r.status === 200){
			r = await r.json();
			Object.assign(this, r);
		} else {
			if(r.status === 500){
				r = r.json();
				throw(r.error)
			} else {
				throw("Somethings fucky"); 
			}
		}
	}

	/*
	 *
	 * Sends a query to backend requesting an array of objects to be returned 
	 * 
	 * */

	static async find(o, e){
		let query = this.validObject(o) ? o : {}, extra = this.validObject(e) ? e : {}, arrayOfObjects = null, baseUrl = `${window.location.origin}/api/${this.name}`, parsedArrayOfObjects = [];
		
		query = encodeURIComponent(JSON.stringify(query))
		extra = encodeURIComponent(JSON.stringify(extra));
		arrayOfObjects = await fetch(`${baseUrl}?q=${query}&e=${extra}`);
		try{
			arrayOfObjects = arrayOfObjects.status === 200 ? await arrayOfObjects.json() : null;
		} catch(err) {	}

		if(Array.isArray(arrayOfObjects)){
			for(let ob of arrayOfObjects){
				let instance = new this();
				Object.assign(instance, ob);
				parsedArrayOfObjects.push(instance);
			}
		}
	
		return parsedArrayOfObjects;	
	}

	/*
	 *
	 * Sends a query to backend requesting one object to be returned
	 *
	 * */

	static async findOne(o, e){
		let query = this.validObject(o) ? o : {}, extra = this.validObject(e) ? e : {}, instance = null, instanceFromDb = null, baseUrl = `${window.location.origin}/api/${this.name}`;
		
		query = encodeURIComponent(JSON.stringify(query));
		extra = encodeURIComponent(JSON.stringify(extra));
		instanceFromDb = await fetch(`${baseUrl}?q=${query}&e=${extra}&distinctFirst=true`);
		instanceFromDb = instanceFromDb.status === 200 ? await instanceFromDb.json() : null;
			
		if(this.validObject(instanceFromDb)){
			instance = new this();
			Object.assign(instance, instanceFromDb);
		}
	
		return instance; 		
	}
}

export default SuperMongo; 
