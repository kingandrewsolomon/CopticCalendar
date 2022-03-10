#!/usr/bin/env node
import express from 'express';
import { getData } from './dataCollector.mjs';

const app = express();
const port = '3000';

// get json data (for Scriptable Widgets)
app.get('/json', (req, res) => {
	res.writeHead(200, {
		'Access-Control-Allow-Methods':'GET',
		'Access-Control-Allow-Headers':'Content-type',
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*'
	});
	console.log("attempting to send json");
	getData().then(result => {
		res.end(JSON.stringify(result));
	});
	console.log("sent json");
});

// For scriptable. To sanitize the html in data
app.get('/HTMLSanitizer', (req, res) => {
	res.sendFile('HTMLSanitizer.js', { root: './public' });
});

// retrieve data from CopticChurch.net website and present it to the client
app.get('/view', (req, res) => {
	console.log("received request");
	getData().then(result => {
	   res.render('pages/calendar', result);	
	});
});

app.use(express.static('public'));
app.set('view engine', 'ejs');


app.listen(port, () => console.log("listening on port: " + port));
