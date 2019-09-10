import Person from './Person.js'; 
import Kitten from './Kitten.js'; 


async function run(){


	let p = await Person.findOne({name: 'Benneth', __v: 1}, {populate: ['kittens']});
	console.log(p);


}

run();
