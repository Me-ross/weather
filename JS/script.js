let todayConditionsEl = $('.todayConditions');
let userCityInput;
let searchedCity;
let cityList = [];
let latitude;
let longitude;
let dailyConditions;
let cityName;

init();
//check local storage for saved cities and set to empty if none
function init() {
  if (localStorage.getItem("city")) {
    cityList = JSON.parse(localStorage.getItem("city"));
    createCityList(cityList);
  } else {
    cityList = [];
    localStorage.setItem("city", JSON.stringify(cityList));
  }
}

// UserInput returns 3 top matches sent to Modal
function getCityNames(event) {
  userCityInput = $("#cityFormInput").val();

  if (userCityInput == "") {
    console.log('empty input')
  } else {
  let requestUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + userCityInput + '&limit=3&appid=e821e3b80ebc742487bb15e97528ea81';

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
    //clear input field
    $('input[name="cityInput"]').val("");
    createModal(data);        
    });
  }
}

// ***MODAL***
function createModal(confirmCity){
  console.log(confirmCity)
  $('.modal-body').empty();
  for (var i = 0; i <confirmCity.length; i++) {
    let modalBtnEl = $("<button>")
      .text(confirmCity[i].name + ", " + confirmCity[i].state + " in " + confirmCity[i].country);
    modalBtnEl.attr({
      type: "button",
      id: "modalBtn",
      //  + [i],
      class: "btn blue-btn mb-2 form-control",
      latitude: confirmCity[i].lat,
      longitude: confirmCity[i].lon,
      "data-bs-dismiss": "modal",
    });
    $('.modal-body').append(modalBtnEl);
  }
}

// capture button click of chosen city
  $('.modal-body').on('click', "#modalBtn", function () {
    console.log('arrived at modal click');
    latitude = $(this).attr("latitude");
    longitude = $(this).attr("longitude");
    cityName = $(this).text();

  handleSavedCity(cityName, latitude, longitude);
  getCityDetails(latitude, longitude);
    })
  

// Save searched city to local storage
function handleSavedCity(cityName, latitude, longitude) {
  searchedCity = {
    name: cityName,
    lat: latitude,
    lon: longitude,
  };
  cityList.push(searchedCity);
  localStorage.setItem("city", JSON.stringify(cityList));
  createCityList(cityList);
}

// Create list of saved cities to search in future
function createCityList() {
  $('.searchedCities').empty();
  for (var i = 0; i <cityList.length; i++) {
    cityButtonEl = $("<button>");
    let buttonText = cityButtonEl.text(cityList[i].name);
    cityButtonEl.append(buttonText);
    cityButtonEl.attr({
      type: "submit",
      class: "btn citylist-btn",
      latitude: ((cityList[i].lat)),
      longitude: ((cityList[i].lon)),
      id: "cityListed",
    });
    $('.searchedCities').append(cityButtonEl);
  }
}

function getCityDetails(latitude, longitude) {  
  // convert lat and lon from string to a number
  latitude = + (latitude);
  //round Latitude to 2 digit demical
  latitude = Math.round((latitude + Number.EPSILON) * 100) / 100;

  longitude = + (longitude)
  longitude = Math.round((longitude + Number.EPSILON) * 100) / 100;

  let requestCityCond =   
  'https://api.openweathermap.org/data/3.0/onecall?lat=' + latitude + '&lon=' + longitude + '&units=imperial&appid=053f4ed773048dce5e5a984df3967ade';  
    
  fetch(requestCityCond)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {

    todayConditions(data, cityName)
    });
}

//Create card to show Today's weather conditions for specific city
  function todayConditions(weather, cityName) {
      todayConditionsEl.empty();

      let cityTitleEl = $('<h5>')
        .addClass("card-title, CityLocation")
        .text(cityName)

      let todayDateEl = ('Today: ' + moment().format("ddd, MMMM Do YYYY"))

      let todayIconEl = $("<img>")
       .attr("src", 'https://openweathermap.org/img/wn/' + weather.current.weather[0].icon + '.png');
      
    //\xB0F creates the degrees sign before F
      let todayTempEl = $("<p>")
        .text('Temp: ' + Math.ceil(weather.current.temp) + ' \xB0F');
      
      let todayWindEl = $("<p>")
        .text('Wind: ' + Math.ceil(weather.current.wind_speed) + ' MPH');
         
      let todayHumidityEl = $("<p>")
        .text('Humidity: ' + weather.current.humidity + ' %');

      todayConditionsEl.append(
        cityTitleEl, 
        todayDateEl, 
        todayIconEl, 
        todayTempEl, 
        todayWindEl, 
        todayHumidityEl)

      dailyConditions = weather.daily
      fiveDayOutlook(dailyConditions);
  }
  
  function fiveDayOutlook(day) {
    $('.dayContainer').empty();
    for (var i = 1; i < 6; i++) {   
      let fiveDayCardEl = $('<div>')
        .addClass("card col-lg-2 col-md-10 m-2 day");
        // `fiveDayCard-${[i]}`
      let fiveDayBodyEl = $('<div>')
      .addClass("card-body");
      
      let dayTitleEl = $('<h6>')
        .addClass("card-title")
        .text(moment().add([i], 'day').format("ddd, M/D/YYYY"));

      let dayIconEl = $("<img>")
       .attr("src", 'https://openweathermap.org/img/wn/' + day[i].weather[0].icon + '.png');
      
    //\xB0F creates the degrees sign before F
      let dayTempEl = $("<p>")
        .text("Temp:\n" + Math.ceil(day[i].temp.min) + ' / ' + Math.ceil(day[i].temp.max) + ' \xB0F');
      
      let dayWindEl = $("<p>")
        .text('Wind:\n' + Math.ceil(day[i].wind_speed) + ' MPH');
         
      let dayHumidityEl = $("<p>")
        .text('Humidity:\n' + day[i].humidity + ' %');
      
      fiveDayBodyEl.append(
       dayTitleEl, 
       dayIconEl, 
       dayTempEl, 
       dayWindEl, 
       dayHumidityEl);

      fiveDayCardEl.append(fiveDayBodyEl);
      $('.dayContainer').append(fiveDayCardEl)
    }    
  }

  $('.searchedCities').on('click', '#cityListed', function(){
    latitude = $(this).attr("latitude");
    longitude = $(this).attr("longitude");
    cityName = $(this).text();
    getCityDetails(latitude, longitude, cityName);
  });

//Tigger button click on input 'enter'
  var inputField = document.getElementById("cityFormInput")
  inputField.addEventListener("keypress", function(event){
    if (event.key === "Enter"){
      event.preventDefault();
      userCityInput = $("#cityFormInput").val();
      $('#cityFormBtn').click();
      getCityNames();
    }
  });

//Trigger button click on 'submit' button
$("#citySearchForm").on("click", "#cityFormBtn",getCityNames);
 
// Modal trigger
const exampleModal = document.getElementById('exampleModal')
exampleModal.addEventListener('show.bs.modal', event => {
  // Button that triggered the modal
  const button = event.relatedTarget
})