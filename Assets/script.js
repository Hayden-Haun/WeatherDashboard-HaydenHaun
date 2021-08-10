//Declare global variables
var userCitiesArray = [];
var savedCitiesUl = $(".savedCitiesUl");
var searchBtnEl = $(".searchBtnEl");
var headerDateVar = moment().format("dddd MM-DD-YYYY");
var cardDateVar = moment().format("dddd, MMMM Do");

$(".dateToday").text(headerDateVar);

// APIkey 9755019e33699b27f6c1bafe2406d0ce;

init();

//loads localStorage data, displays to screen
function init() {
  var savedCity = JSON.parse(localStorage.getItem("userCitiesArray"));

  if (savedCity) {
    userCitiesArray = savedCity;
  }

  saveCities();
  displayCities();
}

//saves array of cities to local storage
function saveCities() {
  localStorage.setItem("userCitiesArray", JSON.stringify(userCitiesArray));
}

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

var cityBtnEl = $(".cityBtn");
savedCitiesUl.on("click", ".cityBtn", displayCurrentWeather);

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
    $(".currentWeather").append(`<p class="card-text m-2">UV Index: </p>`);
  });

  displayForecastWeather();

  function displayForecastWeather() {
    $.ajax({
      url: requestURL,
      method: "GET",
    }).then(function (data) {
      for (var i = 0; i < data.list.length; i++) {
        if (data.list[i].dt_txt.search("15:00:00") != -1) {
          var rawDateVar = data.list[i].dt_txt;
          var dateVar = moment(rawDateVar).format("dddd, MMMM Do");

          var tempVar = data.list[i].main.temp;
          var windVar = data.list[i].wind.speed;
          var humidVar = data.list[i].main.humidity;
          var iconVar = data.list[i].weather[0].icon;

          $(".forecastWeather").append(`
            <div class="card m-3 col-sm-4">
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
