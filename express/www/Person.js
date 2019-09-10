import SuperMongo from './SuperMongo.js'; 

class Person extends SuperMongo{
	sayHi(){
		return "Hello my name is " + this.name || "Earl";
	}
}

export default Person; 
