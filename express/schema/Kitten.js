const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

let kittenSchema = new Schema({
  name: String,
  age: Number
});

class KittenClass {

  sayHi(){
    return `Meow name is ${this.name} and I am ${this.age} months old.`;
  }

  sayBye(){
    return `${this.name} says 'Bye, bye'!`;
  }

}


kittenSchema.loadClass(KittenClass);
module.exports = db.model('Kitten', kittenSchema);
