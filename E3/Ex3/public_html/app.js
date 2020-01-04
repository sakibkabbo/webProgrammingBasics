/* E3 app.js */
'use strict';

const log = console.log
const yargs = require('yargs').option('addRest', {
    type: 'array' // Allows you to have an array of arguments for particular command
  }).option('addResv', {
    type: 'array' 
  }).option('addDelay', {
    type: 'array' 
  })

const reservations = require('./reservations');
let date_time = require('date-and-time')
const yargs_argv = yargs.argv
//log(yargs_argv) // uncomment to see what is in the argument array

if ('addRest' in yargs_argv) {
	const args = yargs_argv['addRest']
	const rest = reservations.addRestaurant(args[0], args[1]);	
	if (rest.length > 0) {
		/* complete */ 
                console.log('Added restaurant ' + args[0] + '.')
	} else {
		/* complete */
                console.log('Duplicate restaurant not added.')
	}
}

if ('addResv' in yargs_argv) {
	const args = yargs_argv['addResv']
	const resv = reservations.addReservation(args[0], args[1], args[2]);

	// Produce output below
	console.log('Added reservation at ' + args[0] + ' on ' + date_time.format(new Date(args[1]), 'MMMM DD YYYY at hh:mm A') + ' for ' + args[2] + ' people.' )
}

if ('allRest' in yargs_argv) {
	const restaurants = reservations.getAllRestaurants(); // get the array
	// Produce output below
        for (let i = 0; i < restaurants.length; i++){
            console.log(restaurants[i].name + ': ' + restaurants[i].description + ' - ' + restaurants[i].numReservations + ' active reservations')
        }
}

if ('restInfo' in yargs_argv) {
	const restaurants = reservations.getRestaurtantByName(yargs_argv['restInfo']);

	// Produce output below
        console.log(restaurants[0].name + ': ' + restaurants[0].description + ' - ' + restaurants[0].numReservations + ' active reservations')

}

if ('allResv' in yargs_argv) {
	const restaurantName = yargs_argv['allResv']
	const reservationsForRestaurant = reservations.getAllReservationsForRestaurant(restaurantName); // get the arary
	
	// Produce output below
        console.log('Reservations for ' + restaurantName + ':')
        for (let i = 0; i < reservationsForRestaurant.length; i++){
            console.log('- ' + date_time.format(new Date(reservationsForRestaurant[i].time), 'MMM. DD YYYY, hh:mm A') + ', table for ' + reservationsForRestaurant[i].people)
        }
}

if ('hourResv' in yargs_argv) {
	const time = yargs_argv['hourResv']
	const reservationsForRestaurant = reservations.getReservationsForHour(time); // get the arary
	
	// Produce output below
        console.log("Reservations in the next hour:")
        for (let i = 0; i < reservationsForRestaurant.length; i++){
            console.log("- " + reservationsForRestaurant[i].restaurant + ": " + date_time.format(new Date(reservationsForRestaurant[i].time), 'MMM. DD YYYY, hh:mm A') + ", table for " + reservationsForRestaurant[i].people)
        }        
}

if ('checkOff' in yargs_argv) {
	const restaurantName = yargs_argv['checkOff']
	const earliestReservation = reservations.checkOffEarliestReservation(restaurantName); 
	
	// Produce output below
        console.log("Checked off reservation on " + date_time.format(new Date(earliestReservation.time), 'MMM. DD YYYY, hh:mm A') + ", table for " + earliestReservation.people)
        
}

if ('addDelay' in yargs_argv) {
	const args = yargs_argv['addDelay']
	const resv = reservations.addDelayToReservations(args[0], args[1]);	

	// Produce output below
	console.log("Reservations for " + resv[0].restaurant + ":")
        for (let i = 0; i < resv.length; i++){
            console.log("- " + date_time.format(new Date(resv[i].time), 'MMM. DD YYYY, hh:mm A') + ", table for " + resv[i].people)
        }
}

if ('status' in yargs_argv) {
	const status = reservations.getSystemStatus()

	// Produce output below
        log("Number of restaurants: " + status.numRestaurants)
        log("Number of total reservations: " + status.totalReservations)
        log("Busiest restaurant: " + status.currentBusiestRestaurantName)
        log("System started at: " + status.systemStartTime)
}

