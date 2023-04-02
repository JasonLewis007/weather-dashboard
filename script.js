//variables used
var ApiKey = '45a60be73c969f62ea353cb6d90300ce';
var openWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
var forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=';
var formEL = $('#search-city');
var currentDate = moment().format('DD/M/YYYY');
var forecastEl = $('.forecast');
var historyEl = $('#history');
var cityEl = $('#city');
var fiveForecastEl = $('#five-forecast');
var weatherIcon = 'http://openweathermap.org/img/wn/';
var citySearch = [];