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

// Fetch weather data from API url

function fetchWeather(city) {
    var coordinates = `${openWeatherUrl}${city}&appid=${ApiKey}`
    fetch (coordinates) 
        .then (function (coordinateResult) {
            if (coordinateResult.ok) {
                coordinateResult.json().then(function (data) {
                    var lon = data.coord.lon;
                    var lat = data.coord.lat;
                    var apiFetch = forecastUrl + lat + '&lon=' + lon + '&appid=' + ApiKey + '&units=metric';

                    fetch(apiFetch)
                        .then(function (weatherResult) {
                            if (weatherResult.ok) {
                                weatherResult.json().then(function (weatherInfo) {

                                    // current day container
                                    var weatherNow = $('<div></div>')
                                    .attr({ id: 'weather-now'})
                                    var current = weatherInfo.list[0];
                                    var icon = current.weather[0].icon;
                                    var cityIcon = weatherIcon + icon + '.png';
                                    var iconEL = $('<img>')
                                        .attr({ id: 'weather-current-icon',
                                                src: cityIcon,
                                                alt: 'Icon for weather'});

                                    var currentHeading = $('<h2></h2>')
                                        .text(city + ' (' + currentDate + ')');

                                    var weatherListCurrent = $('<ul></ul>');

                                    var weatherDetailsCurrent = ['Temp: ' + current.main.temp + ' °C', 'Wind: ' + current.wind.speed + ' MPH', 'Humidity: ' + current.main.humidity + '%']
                                    
                                    for (var i = 0; i < weatherDetailsCurrent.length; i++) {
                                        var currentWeatherItem = $('<li></li>')
                                            .text(weatherDetailsCurrent[i])
                                        weatherListCurrent.append(currentWeatherItem);    
                                    }

                                    weatherNow.append(currentHeading);
                                    currentHeading.append(iconEL);
                                    weatherNow.append(weatherListCurrent);
                                    $('#five-forecast').before(weatherNow);

                                    

                                    // Five day forecast

                                    var fiveForecastHeader = $('<h2></h2>')
                                        .text("5-Day-Forecast:")
                                        .attr({id: 'five-forecast-header'})

                                    $('#weather-now').after(fiveForecastHeader)

                                    var fiveForecastArray = [];

                                    for (var i = 0; i < 5; i++) {
                                        let date = moment().add(i + 1, 'days').format('DD/M/YYYY');

                                        fiveForecastArray.push(date);
                                    }

                                    // Weather cards for five day forecast

                                    for (var i = 0; i < fiveForecastArray.length; i++) {
                                        var weatherCard = $('<div></div>')
                                            .addClass('card');

                                        var weatherCardMain = $('<div></div>')
                                            .addClass('card-main');

                                        var cardH3 = $('<h3></h3>')
                                            .addClass('card-h3')
                                            .text(fiveForecastArray[i]);

                                        var fiveIcon = weatherInfo.list[i].weather[0].icon;

                                        var fiveIconEl = $('<img></img>')
                                            .attr({
                                                src: weatherIcon + fiveIcon + '.png',
                                                alt: 'Forecast Icon'
                                            });
                                        
                                        var tempInfo = $('<p></p>')
                                            .text('Temp: ' + weatherInfo.list[i].main.temp_max  + "\u2103");
                                        
                                        var windInfo = $('<p></p>')
                                            .text('Wind: ' + weatherInfo.list[i].wind.speed + 'MPH');
                                        
                                        var humidityInfo = $('<p></p>')
                                            .text('Humidity: ' + weatherInfo.list[i].main.humidity + '%');

                                        fiveForecastEl.append(weatherCard);
                                        weatherCard.append(weatherCardMain);
                                        weatherCardMain.append(cardH3);
                                        weatherCardMain.append(fiveIconEl);
                                        weatherCardMain.append(tempInfo);
                                        weatherCardMain.append(windInfo);
                                        weatherCardMain.append(humidityInfo)
                                    }                         

                                })
                            }
                        })
                   });
                
            } else {
                alert('Open Weather Server could not find city')           
            }
        })
        
        .catch(function (err) {
            alert('Unable to connect');
        });

}

// local storage

function insertLocalStorage() {
    var historyArray = JSON.parse(localStorage.getItem('history'));

    if (!historyArray) {
        historyArray = {
            citySearch: [],
        };

    } else {
    for (var i = 0; i < historyArray.citySearch.length; i++) {
        history(historyArray.citySearch[i]);
    }}

    return historyArray;
}

function saveLocalStorage() {
    localStorage.setItem('history', JSON.stringify(insertLocalStorage()));    
}

// history btns
function history(city) {
    var historyButton = $('<button></button>')
        .addClass('btn')
        .text(city)
        .on('click', function () {
            $('#weather-now').remove();
            $('#five-forecast').empty();
            $('#five-forecast-header').remove();
            fetchWeather(city);
        })
        .attr({ type: 'button'
        });

        historyEl.append(historyButton);

}

// function to submit search input
function submitSearch(event) {
    event.preventDefault();
    var city = cityEl.val().trim();

    if (city) {
    fetchWeather(city);
    history(city);
    insertLocalStorage().citySearch.push(city);
    saveLocalStorage();
    cityEl.val('')

    } else {
        alert('City input invalid');
    }
}

// search button click listener
$('#search-button').on('click', function () {
    $('#weather-now').remove();
    $('#five-forecast').empty();
    $('#five-forecast-header').remove();
})

formEL.on('submit', submitSearch);


