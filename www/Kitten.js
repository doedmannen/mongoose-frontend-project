import SuperMongo from './SuperMongo.js'; 

class Kitten extends SuperMongo{
	sayHi(){
		return "Hello my name is " + this.name || "Gurfeld";
	}
}

export default Kitten;
