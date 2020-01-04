/* Reservations.js */ 
'use strict';

const log = console.log
const fs = require('fs');
const datetime = require('date-and-time')

const startSystem = () => {

	let status = {};

	try {
		status = getSystemStatus();
	} catch(e) {
		status = {
			numRestaurants: 0,
			totalReservations: 0,
			currentBusiestRestaurantName: null,
			systemStartTime: new Date(),
		}

		fs.writeFileSync('status.json', JSON.stringify(status))
	}

	return status;
}

const getSystemStatus = () => {
        updateSystemStatus()
	const status = fs.readFileSync('status.json')
	return JSON.parse(status)
}

/*********/

/* Helper functions to save JSON */
const updateSystemStatus = () => {
	const status = {
			numRestaurants: 0,
			totalReservations: 0,
			currentBusiestRestaurantName: null,
			systemStartTime: datetime.format(new Date(), 'YYYY/MM/DD HH:mm:ss')
		}
	
	/* Add your code below */
        const restaurants = getAllRestaurants()
        const reservations = getAllReservations()
        status.numRestaurants = restaurants.length
        status.totalReservations = reservations.length
        let busiestRestaurantReservationNumber = restaurants[0].numReservations
        let busiestRestaurant = " "
        for (let i = 0; i < restaurants.length; i++){
            if (restaurants[i].numReservations >= busiestRestaurantReservationNumber){
                busiestRestaurant = restaurants[i].name
            }
        }
        status.currentBusiestRestaurantName = busiestRestaurant
	fs.writeFileSync('status.json', JSON.stringify(status))
}

const saveRestaurantsToJSONFile = (restaurants) => {
	/* Add your code below */        
        fs.writeFileSync('restaurants.json', JSON.stringify(restaurants))

};

const saveReservationsToJSONFile = (reservations) => {
	/* Add your code below */
        fs.writeFileSync('reservations.json', JSON.stringify(reservations))
};

/*********/

// Should return an array
const addRestaurant = (name, description) => {
	// Check for duplicate names
        const restaurants = getAllRestaurants()
        const duplicateRestaurant = restaurants.filter(restaurant => restaurant.name === name)
        if (duplicateRestaurant.length){
	   return [];
        }

	// if no duplicate names:
	const restaurant = {
            name: name,
            description: description,
            numReservations: 0
        };
        restaurants.push(restaurant)
        saveRestaurantsToJSONFile(restaurants)
	return [restaurant]

}

const addReservation = (restaurant, time, people) => {
	
	/* Add your code below */
        const restaurants = getAllRestaurants()
        let restaurantToReserve = []
        for (let i = 0; i < restaurants.length; i++){
            if (restaurants[i].name === restaurant){                
                restaurantToReserve = restaurants[i]
            }
        }
        const restaurantsToSave = restaurants.filter(restaurant => restaurant.name !== restaurantToReserve.name)
        restaurantToReserve.numReservations = restaurantToReserve.numReservations + 1
        restaurantsToSave.push(restaurantToReserve)
        saveRestaurantsToJSONFile(restaurantsToSave)
        
        const reservations = getAllReservations()
        const date1 = new Date(time)
	const reservation = {
            restaurant: restaurant,
            time: date1,
            people: people
        };
        reservations.push(reservation)
        saveReservationsToJSONFile(reservations)
	return reservation;

}


/// Getters - use functional array methods when possible! ///

// Should return an array - check to make sure restaurants.json exists
const getAllRestaurants = () => {
	/* Add your code below */
        if (fs.existsSync('restaurants.json')){
            const restaurantsJSONString = fs.readFileSync('restaurants.json')
            const restaurantsParsed = JSON.parse(restaurantsJSONString)
            return restaurantsParsed
        }
        else {
            return []
        }
};


const getRestaurtantByName = (name) => {
	/* Add your code below */
        const restaurants = getAllRestaurants()
        const restaurantByName = restaurants.filter(restaurant => restaurant.name === name)
        return restaurantByName
};

// Should return an array - check to make sure reservations.json exists
const getAllReservations = () => {
  /* Add your code below */
          if (fs.existsSync('reservations.json')){
            const reservationsJSONString = fs.readFileSync('reservations.json')
            const reservationsParsed = JSON.parse(reservationsJSONString)
            return reservationsParsed
        }
        else{
            return []
        }
  
};

// Should return an array
const getAllReservationsForRestaurant = (name) => {
	/* Add your code below */
        const reservations = getAllReservations()
        const reservationsByName = reservations.filter(reservation => reservation.restaurant === name)
        return reservationsByName
};


// Should return an array
const getReservationsForHour = (time) => {
	/* Add your code below */
        const reservations = getAllReservations()
        const reqTime = new Date(time) 
        const reservationsForHour = reservations.filter(reservation => ((new Date(reservation.time)).getTime() >= reqTime.getTime()) && ((new Date(reservation.time)).getTime() <= (reqTime.getTime() + (60*60*1000))))
        const sortedReservations = reservationsForHour.sort(reservation => (new Date(reservation.time)).getTime())
        return sortedReservations        
}


const checkOffEarliestReservation = (restaurantName) => {
        const restaurants = getAllRestaurants()        
        const checkedOffRestaurant = getRestaurtantByName(restaurantName)
        const restaurantsToKeep = restaurants.filter(restaurant => restaurant.name !== restaurantName)
        checkedOffRestaurant[0].numReservations = checkedOffRestaurant[0].numReservations - 1
        restaurantsToKeep.push(checkedOffRestaurant[0])
        saveRestaurantsToJSONFile(restaurantsToKeep)
        
        const allreservations = getAllReservations()
        const reservations = getAllReservationsForRestaurant(restaurantName)               
	const checkedOffReservation = reservations[0];
        const reservationsToKeep = allreservations.filter(reservation => (reservation.restaurant !== checkedOffReservation.restaurant) || ((new Date(reservation.time).getTime() != (new Date(checkedOffReservation.time)).getTime())))
        saveReservationsToJSONFile(reservationsToKeep)
 	return checkedOffReservation;
}


const addDelayToReservations = (restaurant, minutes) => {
	// Hint: try to use array.map()
        const reservations = getAllReservations()
        const reservationsToDelay = reservations.filter(reservation => reservation.restaurant === restaurant)
        const unchangedReservations = reservations.filter(reservation => reservation.restaurant !== restaurant)
        const reservationsAfterDelay = reservationsToDelay.map(reservation =>  reservation.time = datetime.addMinutes(new Date(reservation.time), minutes))
        for(let i = 0; i < reservationsAfterDelay.length; i++){
            reservationsToDelay[i].time = new Date(reservationsAfterDelay[i])
        }
        for(let i = 0; i < reservationsAfterDelay.length; i++){
            unchangedReservations.push(reservationsToDelay[i])
        }
        saveReservationsToJSONFile(unchangedReservations)
        return reservationsToDelay
	
}

startSystem(); // start the system to create status.json (should not be called in app.js)

// May not need all of these in app.js..but they're here.
module.exports = {
	addRestaurant,
	getSystemStatus,
	getRestaurtantByName,
	getAllRestaurants,
	getAllReservations,
	getAllReservationsForRestaurant,
	addReservation,
	checkOffEarliestReservation,
	getReservationsForHour,
	addDelayToReservations
}
