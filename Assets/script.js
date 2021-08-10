//DECLARE GLOBAL VARIABLES
var userCitiesArray = [];
var savedCitiesUl = $(".savedCitiesUl");
var searchBtnEl = $(".searchBtnEl");
var headerDateVar = moment().format("dddd, MM-DD-YYYY");
var cardDateVar = moment().format("dddd, MMMM Do");
var cityLatVar;
var cityLongVar;

//PUT TODAY'S DATE IN THE NAVBAR
$(".dateToday").text(headerDateVar);

//OPEN WEATHER MAP API INFO
//KEY
//9755019e33699b27f6c1bafe2406d0ce

//API: 5 DAY FORECAST: https://openweathermap.org/forecast
//API: ONE CALL: https://openweathermap.org/api/one-call-api

init();

//LOADS LOCAL STORAGE DATA, DISPLAYS TO SCREEN
function init() {
  var savedCity = JSON.parse(localStorage.getItem("userCitiesArray"));

  if (savedCity) {
    userCitiesArray = savedCity;
  }

  saveCities();
  displayCities();
}

//SAVE ARRAY OF CITIES TO LOCAL STORAGE
function saveCities() {
  localStorage.setItem("userCitiesArray", JSON.stringify(userCitiesArray));
}

//DISPLAYS THE CITIES SAVED IN LOCAL STORAGE TO THE WEB PAGE
function displayCities() {
  userCitiesArray.forEach(function (counter) {
    var savedCity = $("<button>").attr({
      class: "btn btn-info cityBtn",
      type: "button",
    });
    savedCitiesUl.append(savedCity.text(counter));
  });
}

//creates <li> for each item in saved array
searchBtnEl.on("click", function (event) {
  event.preventDefault();

  //add new city to array
  var newCityValue = $(this).siblings(".inputCity").val();
  userCitiesArray.push(newCityValue);

  //display new city on list
  var savedCity = $("<button>").attr({
    class: "btn btn-info cityBtn",
    type: "button",
  });
  savedCitiesUl.append(savedCity.text(newCityValue));
  $(".inputCity").val("");
  saveCities();
});

//EVENT HANDLER FOR WHEN USER CLICKS ON CITY in LOCAL STORAGE
var cityBtnEl = $(".cityBtn");
savedCitiesUl.on("click", ".cityBtn", displayCurrentWeather);

//FIRST SECTION PULLS & DISPLAYS CURRENT DATA FOR CITY
function displayCurrentWeather() {
  $(".currentWeather").empty();
  $(".forecastWeather").empty();

  var cityName = $(this).text();
  var requestURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    cityName +
    "&units=imperial&appid=9755019e33699b27f6c1bafe2406d0ce";

  $.ajax({
    url: requestURL,
    method: "GET",
  }).then(function (data) {
    cityLatVar = data.city.coord.lat;
    cityLongVar = data.city.coord.lon;

    // console.log(cityLatVar);
    // console.log(cityLongVar);
    $(".currentWeather").append(
      `<h2 class="card-title text-dark m-2">${data.city.name}'s current weather: </h2>`
    );

    $(".currentWeather").append(
      `<img src="https://openweathermap.org/img/w/${data.list[0].weather[0].icon}.png">`
    );

    $(".currentWeather").append(
      `<p class="card-text m-2">Date: ${cardDateVar} </p>`
    );

    $(".currentWeather").append(
      `<p class="card-text m-2">Temperature: ${data.list[0].main.temp} degrees Fahrenheight </p>`
    );
    $(".currentWeather").append(
      `<p class="card-text m-2">Wind: ${data.list[0].wind.speed} MPH </p>`
    );
    $(".currentWeather").append(
      `<p class="card-text m-2">Humidity: ${data.list[0].main.humidity}% </p>`
    );

    //Calls function to display UV Index
    displayUVI();
  });

  //THIS FUNCTION PULLS THE LONG & LAT DATA FROM THE SELECTED CITY, AND USES THIS INFORMATION IN A DIFFERENT OPEN-WEATHER-MAP API TO RETURN THE UV INDEX. THE UV INDEX IS DISPLAYED RED, YELLOW, OR GREEN DEPENDING ON THE SEVERITY
  function displayUVI() {
    var uviURL =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      cityLatVar +
      "&lon=" +
      cityLongVar +
      "&exclude={part}&appid=9755019e33699b27f6c1bafe2406d0ce";

    $.ajax({
      url: uviURL,
      method: "GET",
    }).then(function (data) {
      var indexUVI = data.daily[0].uvi;

      if (indexUVI >= 7) {
        $(".currentWeather").append(
          `<button type="button" class="btn btn-danger">UV Index: ${indexUVI}</button>`
        );
      } else if (indexUVI < 7 && indexUVI >= 3) {
        $(".currentWeather").append(
          `<button type="button" class="btn btn-warning uviBtn">UV Index: ${indexUVI}</button>`
        );
      } else {
        $(".currentWeather").append(
          `<button type="button" class="btn btn-success uviBtn">UV Index: ${indexUVI}</button>`
        );
      }
    });
  }

  //DISPLAY 5-DAY FORECAST DATA FOR SELECTED CITY
  displayForecastWeather();
  function displayForecastWeather() {
    $.ajax({
      url: requestURL,
      method: "GET",
    }).then(function (data) {
      //   console.log(data);
      for (var i = 0; i < data.list.length; i++) {
        if (data.list[i].dt_txt.search("18:00:00") != -1) {
          var rawDateVar = data.list[i].dt_txt;
          var dateVar = moment(rawDateVar).format("dddd, MMMM Do");

          var tempVar = data.list[i].main.temp;
          var windVar = data.list[i].wind.speed;
          var humidVar = data.list[i].main.humidity;
          var iconVar = data.list[i].weather[0].icon;

          $(".forecastWeather").append(`
            <div class="card m-3 col-sm-4 border border-info text-white bg-info">
                <div class="card-body">
                    <h5 class="card-title">${dateVar}</h5>
                    <img src="https://openweathermap.org/img/w/${iconVar}.png">
                    <div class="card-text">
                        <p class="card-text">Temp: ${tempVar} degrees</p>
                        <p class="card-text">Wind: ${windVar} MPH</p>
                        <p class="card-text">Humidity: ${humidVar}%</p>
                    </div>
                </div>
            </div>
          
          `);
        }
      }
    });
  }
}
