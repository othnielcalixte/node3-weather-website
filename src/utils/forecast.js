const request = require('request');

const forecast = (latitude, longitude, callback) => {
  const url =
    'https://api.weatherstack.com/current?access_key=1c882edc1524dea1ad438b33e42bbe58&query=' +
    latitude +
    ',' +
    longitude +
    '&units=f';

  request({ url, json: true }, (error, { body }) => {
    //   const data = JSON.parse(response.body);
    //   console.log(data.current);
    //   console.log(response.body.current);

    if (error) {
      callback('Unable to connect to weather Service!', undefined);
    } else if (body.error) {
      callback(`Unable to find location`, undefined);
    } else {
      callback(
        undefined,
        `${body.current.weather_descriptions[0]}. It is currently ${body.current.temperature} degrees out. It feels like ${body.current.feelslike} degrees out.`
      );
    }
  });
};

module.exports = forecast;
