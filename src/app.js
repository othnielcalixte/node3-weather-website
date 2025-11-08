const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

console.log(__dirname); // This is the path to the folder that your file lives in
console.log(path.join(__dirname, '../public')); // This is the path that your file exactly

const app = express();

//Defined paths for Expess config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

//Setup handlebars engine and views location
app.set('view engine', 'hbs'); // installing, this single line is all we need to get handle bars set up.
app.set('views', viewsPath); // this is how you point express to your own custom directory so you don't have to name the folder views -- Also views is case sensitive, we aware if that.
hbs.registerPartials(partialsPath);

//Setup static directory to serve
app.use(express.static(publicDirectoryPath)); // this is coming from the static directory, it is loading in our HTML page

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather',
    name: 'Othniel Calixte',
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About me',
    name: 'Othniel Calixte',
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    helpText: 'Here is your help message',
    title: 'Help',
    name: 'Othniel Calixte',
  });
});
// get first takes the route which is  everything after the .com and then it secondly takes a function
// In the function(which describes what to send back to them):
//req means request
// res means response
// const pathToHelp = path.join(__dirname, '../public/help.html');
// app.use(express.static(pathToHelp));

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: 'You must provide an address!',
    });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }

      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }

        res.send({
          forecast: forecastData,
          location,
          address: req.query.address,
        });
      });
    }
  );
});

app.get('/products', (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: 'You must provide a search term',
    });
  }
  console.log(req.query.search);
  res.send({
    products: [],
  });
});

//app.com
//app.com/help
//app.com/aboout

app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '404',
    errorMsg: 'Help article not found',

    name: 'Othniel Calixte',
  });
});

// * this means all of the pages that we did not specify or does not exist
// the wild character means that everything is a match
app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Othniel Calixte',
    errorMsg: 'Page not found',
  });
});

// THis is how you start the server

app.listen(3000, () => {
  console.log('Server is up on port 3000.');
});
