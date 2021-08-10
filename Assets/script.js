//Declare global variables
var userCitiesArray = [];
var savedCitiesUl = $(".savedCitiesUl");
var searchBtnEl = $(".searchBtnEl");
var currentTimeVar = moment().format("dddd MM-DD-YYYY");

$(".dateToday").text(currentTimeVar);

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
      `<h3 class="card-title text-dark">${data.city.name}'s current weather: </h3>`
    );
    $(".currentWeather").append(
      `<p class="card-text">Temperature: ${data.list[0].main.temp} degrees Fahrenheight </p>`
    );
    $(".currentWeather").append(
      `<p class="card-text">Wind: ${data.list[0].wind.speed} MPH </p>`
    );
    $(".currentWeather").append(
      `<p class="card-text">Humidity: ${data.list[0].main.humidity} % </p>`
    );
    $(".currentWeather").append(`<p class="card-text">UV Index: </p>`);
  });

  displayForecastWeather();

  function displayForecastWeather() {
    $.ajax({
      url: requestURL,
      method: "GET",
    }).then(function (data) {});
  }
}
