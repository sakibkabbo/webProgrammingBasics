/* E4 server.js */
'use strict';
const log = console.log;

const express = require('express')
const bodyParser = require('body-parser')
const { ObjectID } = require('mongodb')

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
        const restaurant = new Restaurant({
	   name: req.body.name,
           description: req.body.description,
	})

	
	restaurant.save().then((result) => {
		res.send(result)
	}, (error) => {
		res.status(400).send(error)
	})

})


/// Route for getting all restaurant information.
// GET /restaurants
app.get('/restaurants', (req, res) => {
	// Add code here
	Restaurant.find().then((restaurants) => {
		res.send({restaurants})
	}, (error) => {
		res.status(400).send(error)
	})
})


/// Route for getting information for one restaurant.
// GET /restaurants/id
app.get('/restaurants/:id', (req, res) => {
	// Add code here
        const id = req.params.id;

	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}

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
app.post('/restaurants/:id', (req, res) => {
	// Add code here
        const id = req.params.id
        if (!ObjectID.isValid(id)) {
	    return res.status(404).send()
	}
        
        Restaurant.findById(id).then((restaurant) => {
                if (!restaurant) {
			res.status(404).send()
		} else {
                     const reservations = restaurant.reservation        
                     reservations.push({time: req.body.time, people: req.body.people})
                  
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
        if (!ObjectID.isValid(id)) {
	    return res.status(404).send()
	}
        const resv_id = req.params.resv_id
        if (!ObjectID.isValid(resv_id)) {
	    return res.status(404).send()
	}
        
        const restaurant = Restaurant.findById(id).then((restaurant) => {
	if (!restaurant) {
		res.status(404).send()
	}else{
           const reservation = restaurant.reservations.id(resv_id)
	   if (!reservation) {
		res.status(404).send()
            }else{
                res.send({ reservation })
            }
        }
        }).catch((error) => {
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
        if (!ObjectID.isValid(id)) {
	    return res.status(404).send()
	}
        const resv_id = req.params.resv_id
        if (!ObjectID.isValid(resv_id)) {
	    return res.status(404).send()
	}
        
        let reservations;
        const restaurant = Restaurant.findById(id).then((restaurant) => {
	if (!restaurant) {
		res.status(404).send()
	}else{
           reservations = restaurant.reservations
           const removedreservation = reservations.id(resv_id).remove()
           restaurant.update({$set: {reservations: reservations}}, {new: true}).then((status) => {
		if (!status) {
		   res.status(404).send()
		} else {
	        res.send({ 'reservation': removedreservation,
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
        if (!ObjectID.isValid(id)) {
	    return res.status(404).send()
	}
        const resv_id = req.params.resv_id
        if (!ObjectID.isValid(resv_id)) {
	    return res.status(404).send()
	}
        
        let reservations
        const restaurant = Restaurant.findById(id).then((restaurant) => {
	if (!restaurant) {
		res.status(404).send()
	}else{
           reservations = restaurant.reservations
           let updatedreservation = reservations.id(resv_id)
           updatedreservation.time = req.body.time
           updatedreservation.people = req.body.people
           restaurant.update({$set: {reservations: reservations}}, {new: true}).then((status) => {
		if (!status) {
		 res.status(404).send()
		} else {
		 res.send({ 'reservation': updatedreservation,
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


//////////

app.listen(port, () => {
	log(`Listening on port ${port}...`)
});
