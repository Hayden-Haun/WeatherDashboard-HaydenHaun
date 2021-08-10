console.log("this is working!!");

// loads any existing localstorage data after components created

var userCitiesArray = [];
var savedCitiesUl = $(".savedCitiesUl");
var searchBtnEl = $(".searchBtnEl");

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

function saveCities() {
  localStorage.setItem("userCitiesArray", JSON.stringify(userCitiesArray));
}

function displayCities() {
  userCitiesArray.forEach(function (counter) {
    var savedCity = $("<li>").attr({
      class: "list-group-item list-group-item-info",
    });
    savedCitiesUl.append(savedCity.text(counter));
  });
}

//creates <li> for each item in array

searchBtnEl.on("click", function (event) {
  event.preventDefault();

  //add new city to array
  var newCityValue = $(this).siblings(".inputCity").val();
  userCitiesArray.push(newCityValue);

  //display new city on list
  var savedCity = $("<li>").attr({
    class: "list-group-item list-group-item-info",
  });
  savedCitiesUl.append(savedCity.text(newCityValue));

  $(".inputCity").val("");
  saveCities();
});

// creates the visuals for the scheduler body
// myDay.forEach(function(thisHour) {
//     // creates timeblocks row
//     var hourRow = $("<form>").attr({
//         "class": "row"
//     });
//     $(".container").append(hourRow);

//     // creates time field
//     var hourField = $("<div>")
//         .text(`${thisHour.hour}${thisHour.meridiem}`)
//         .attr({
//             "class": "col-md-2 hour"
//     });

//     // creates schdeduler data
//     var hourPlan = $("<div>")
//         .attr({
//             "class": "col-md-9 description p-0"
//         });
//     var planData = $("<textarea>");
//     hourPlan.append(planData);
//     planData.attr("id", thisHour.id);
//     if (thisHour.time < moment().format("HH")) {
//         planData.attr ({
//             "class": "past",
//         })
//     } else if (thisHour.time === moment().format("HH")) {
//         planData.attr({
//             "class": "present"
//         })
//     } else if (thisHour.time > moment().format("HH")) {
//         planData.attr({
//             "class": "future"
//         })
//     }

//     // creates save button
//     var saveButton = $("<i class='far fa-save fa-lg'></i>")
//     var savePlan = $("<button>")
//         .attr({
//             "class": "col-md-1 saveBtn"
//     });
//     savePlan.append(saveButton);
//     hourRow.append(hourField, hourPlan, savePlan);
// })
