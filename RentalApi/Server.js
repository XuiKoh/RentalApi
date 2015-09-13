var express = require('express');
var Flickr = require('./Route/AppModule');
var app = express();

// Set Folder AS Root Folder
app.use(express.static(__dirname + '/Images'));
app.use(express.static(__dirname + '/Script'));
app.use(express.static(__dirname + '/View'));

// Set HomePage
app.get('/', function(req, res) {
	res.sendFile('index.html');
});

// Define ApiModule Acessible And Carries Parameter
app.get('/Flickr/:parameterflickrtags', Flickr.FlickrApi);
app.get('/Foursquare/:foursquareparameter',Flickr.FourSquareApi);
app.get('/FoursquareID/:foursquareidparameter',Flickr.FourSquareApiByID);

app.listen(80);

console.log('Listening on port 80');