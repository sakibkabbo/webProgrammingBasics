/* E4 server.js */
'use strict';
const log = console.log;

const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

// Mongoose
const { mongoose } = require('./db/mongoose');
const { Restaurant } = require('./models/restaurant')

// Express
const port = process.env.PORT || 3000
const app = express();
app.use(bodyParser.json());

/// Route for adding restaurant, with *no* reservations (an empty array).
/* 
Request body expects:
{
	"name": <restaurant name>
	"description": <restaurant description>
}
Returned JSON should be the database document added.
*/
// POST /restaurants
app.post('/restaurants', (req, res) => {
	// Add code here
	log('req.body')
	log(req.body);

	// Create a new restaurant
	const restaurant = new Restaurant({
		name: req.body.name,
		description: req.body.description
	});
	log('restaurant')
	log(restaurant)
	// save restaurant to database
	restaurant.save().then((result) => {
		// Save and send object that was saved
		log('result')
		log(result)
		res.send({result})
	}, (error) => {
		res.status(400).send(error) // 400 for bad request
	})
})


/// Route for getting all restaurant information.
// GET /restaurants
app.get('/restaurants', (req, res) => {
	// Add code here
	Restaurant.find().then((restaurants) => {
		res.send({ restaurants }) // put in object in case we want to add other properties
	}, (error) => {
		res.status(400).send(error)
	})
})


/// Route for getting information for one restaurant.
// GET /restaurants/id
app.get('/restaurants/:id', (req, res) => {
	// Add code here
	const id = req.params.id // the id is in the req.params object

	// Good practise is to validate the id
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}

	// Otheriwse, findById
	Restaurant.findById(id).then((restaurant) => {
		if (!restaurant) {
			res.status(404).send()
		} else {
			res.send({ restaurant })
		}
		
	}).catch((error) => {
		res.status(400).send(error)
	})
})


/// Route for adding reservation to a particular restaurant.
/* 
Request body expects:
{
	"time": <time>
	"people": <number of people>
}
*/
// Returned JSON should have the restaurant database 
//   document that the reservation was added to, AND the reservation subdocument:
//   { "reservation": <reservation subdocument>, "restaurant": <entire restaurant document>}
// POST /restaurants/id
//curl -H "Content-Type: application/json" -d '{"time":"17:20", "people":"2"}' http://localhost:3000/restaurants/5c070f612b560d1d777c8a6b
app.post('/restaurants/:id', (req, res) => {
	// Add code here
	//find the restaurant
	const id = req.params.id
	//log(req.body)
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}

	let rst;
	Restaurant.findById(id).then((restaurant) => {
		if (!restaurant) {
			res.status(404).send()
		} else {
			rst = restaurant.reservations
			rst.push({time: req.body.time, people: req.body.people});
			//restaurant.update({$set: {reservations: rst}}, {new: true}).then((status) => {
				
			restaurant.update({$push: {reservations: {time: req.body.time, people: req.body.people}}}, {new: true}).then((status) => {
				if (!status) {
					res.status(404).send()
				} else {
					res.send({ 'reservation': reservations,
						'restaurant': restaurant })
				}
			}).catch((error) => {
				res.status(400).send(error)
			})
		}	
	}).catch((error) => {
		res.status(400).send(error)
	})
})


/// Route for getting information for one reservation of a restaurant (subdocument)
// GET /restaurants/id
app.get('/restaurants/:id/:resv_id', (req, res) => {
	// Add code here
	const id = req.params.id
	const resv_id = req.params.resv_id
	log(id)
	log(resv_id)
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}
	//if (!ObjectID.isValid(resv_id)) {
	//	return res.status(404).send()
	//}

	//Find the restaurant first
	Restaurant.findById(id).then((restaurant) => {
		if (!restaurant) {
			log('pos1')
			res.status(404).send()
		} else {
			log('pos5')
			log(restaurant.reservations[0])
			let reservation = restaurant.reservations.id(resv_id);
			log('pos5.1')
			if (!reservation) {
				log('pos2')
				res.status(404).send()
			} else {
				res.send({ reservation })
			}
		}
		
	}).catch((error) => {
		log('pos4')
		log(error)
		res.status(400).send(error)
	})
})


/// Route for deleting reservation
// Returned JSON should have the restaurant database
//   document from which the reservation was deleted, AND the reservation subdocument deleted:
//   { "reservation": <reservation subdocument>, "restaurant": <entire restaurant document>}
// DELETE restaurant/<restaurant_id>/<reservation_id>
app.delete('/restaurants/:id/:resv_id', (req, res) => {
	// Add code here
	const id = req.params.id
	const resv_id = req.params.resv_id
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}
	if (!ObjectID.isValid(resv_id)) {
		return res.status(404).send()
	}

	//again, first, find the restaurant
	let rst
	Restaurant.findById(id).then((restaurant) => {
		if (!restaurant) {
			res.status(404).send()
		} else {
			//res.send({ restaurant })
			rst = restaurant.reservations
		}	
	}).catch((error) => {
		res.status(400).send(error)
	})

	//then, update rst:
	rst.id(resv_id).remove();

	//Finally, update restaurant.
	Restaurant.findByIdAndUpdate(id, {$set: {reservations: rst}}, {new: true}).then((restaurant) => {
		if (!restaurant) {
			res.status(404).send()
		} else {
			var obj = {
				reservation: rst,
				restaurant: restaurant
			}
			res.send({ obj })
		}
	}).catch((error) => {
		res.status(400).send(error)
	})
})


/// Route for changing reservation information
/* 
Request body expects:
{
	"time": <time>
	"people": <number of people>
}
*/
// Returned JSON should have the restaurant database
//   document in which the reservation was changed, AND the reservation subdocument changed:
//   { "reservation": <reservation subdocument>, "restaurant": <entire restaurant document>}
// PATCH restaurant/<restaurant_id>/<reservation_id>
app.patch('/restaurants/:id/:resv_id', (req, res) => {
	// Add code here
	const id = req.params.id
	const resv_id = req.params.resv_id
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}
	if (!ObjectID.isValid(resv_id)) {
		return res.status(404).send()
	}

	//again, first, find the restaurant
	let rst
	Restaurant.findById(id).then((restaurant) => {
		if (!restaurant) {
			res.status(404).send()
		} else {
			//res.send({ restaurant })
			rst = restaurant.reservations
		}	
	}).catch((error) => {
		res.status(400).send(error)
	})

	//then, update rst:
	//THE ID might be  CHANGED!!!!!!!
	rst.id(resv_id).remove();
	rst.push({time: req.body.time, people: req.body.people});

	//Finally, update restaurant.
	Restaurant.findByIdAndUpdate(id, {$set: {reservations: rst}}, {new: true}).then((restaurant) => {
		if (!restaurant) {
			res.status(404).send()
		} else {
			var obj = {
				reservation: rst,
				restaurant: restaurant
			}
			res.send({ obj })
		}
	}).catch((error) => {
		res.status(400).send(error)
	})
/* It's the best one I have. However, I am not sure if it's correct.
	Restaurant.findByIdAndUpdate(id, {$set: {"reservations.$": reservation}}, {new: true}).then((restaurant) =>{
		if (!restaurant) {
			res.status(404).send()
		}else{
			if (!reservation) {
				res.status(405).send()
			}else{
				reservation.time = req.body.time
				reservation.people = req.body.people
			}
		}
	})
*/
})


//////////

app.listen(port, () => {
	log(`Listening on port ${port}...`)
});
