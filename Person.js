const mongoose = require('mongoose');
const Schema = mongoose.Schema; 
const { ObjectId } = Schema.Types;


let personSchema = new Schema({
	name: String, 
	age: Number,
	kittens: [{type: ObjectId, ref: 'Kitten'}]
}); 

class PersonClass{
	sayHi(){
		return `Hello my name is ${this.name} and I'm ${this.age} years old `; 
	}

	sayBye(){
		return `I'm off to kill myself somewhere now!`;
	}
}

personSchema.loadClass(PersonClass);
module.exports = db.model('Person', personSchema); 
