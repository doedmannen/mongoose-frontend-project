import Person from './Person.js'; 
import Kitten from './Kitten.js'; 


async function run(){

	/*
	 *
	 * Put code for testing here
	 *
	 * */


	let lindeman = new Person({name: 'Malte Lindeman', age: 32});
	await lindeman.save();
	let hasse = new Kitten({name: 'Hasse', age: 4});
	let tage = new Kitten({name: 'Tage', age: 5}); 
	await hasse.save(); 
	await tage.save(); 
	lindeman.kittens.push(hasse); 
	lindeman.kittens.push(tage);
	await lindeman.save();


	let p = await Person.findOne({name: 'Malte Lindeman'}, {populate: ['kittens']});

	console.log(p);

}

run();
