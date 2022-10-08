let todayConditionsEl = $('.todayConditions');

let userCityInput;
let savedCityName = [];
let latitude;
let longitude;
let dailyConditions;
let cityName;

init();
//set city storage to an empty array when page is refreshed
function init() {
    savedCityName = [];
    localStorage.setItem("city", JSON.stringify(savedCityName));
    if (localStorage.getItem("city")) {
      savedCityName = JSON.parse(localStorage.getItem("city"));
    } else {
      savedCityName = [];
    }
  }
console.log(savedCityName)

//listens for the input click and assign value to cityName
function handleCityInput(event) {
// $("#citySearchForm").on("click", "#cityFormBtn", function (event) {
    event.preventDefault();
    userCityInput = $(this).siblings("#cityFormInput").val();
    console.log(userCityInput);
    savedCityName.push(userCityInput);
    localStorage.setItem('city', JSON.stringify(savedCityName));
     //clear input field
     $('input[name="cityInput"]').val("");
     getCityNames(userCityInput);
     createCityList(savedCityName);
   
};
console.log(savedCityName)

// Create list of saved cities to search in future
function createCityList() {
  $('.searchedCities').empty();
  for (var i = 0; i < savedCityName.length; i++) {
    cityButtonEl = $("<button>");
    let buttonText = cityButtonEl.text(savedCityName[i]);
    cityButtonEl.append(buttonText);
    cityButtonEl.attr({
      type: "submit",
      class: "btn btn-primary",
      id: savedCityName[i],
    });
    $('.searchedCities').append(cityButtonEl);
  }
}

// Verify which City user wants
// Get city Latitude, Longitude
function getCityNames(searchCities) {
    // let requestUrl = ' http://api.openweathermap.org/geo/1.0/direct?q=' + searchCities + '&limit=1&appid=e821e3b80ebc742487bb15e97528ea81';
    let requestUrl = ' http://api.openweathermap.org/geo/1.0/direct?q=' + searchCities + '&limit=3&appid=e821e3b80ebc742487bb15e97528ea81';
  
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
       
      createModal(data);
        
      });
  }


  function getCityDetails(latitude, longitude) {
    console.log('before round, '+ latitude + longitude);
    latitude = Math.round((latitude + Number.EPSILON) * 100) / 100;
    console.log(latitude);
    longitude = Math.round((longitude + Number.EPSILON) * 100) / 100;
    console.log(longitude);
    let requestCityCond =   
    'https://api.openweathermap.org/data/3.0/onecall?lat=' + latitude + '&lon=' + longitude + '&units=imperial&appid=053f4ed773048dce5e5a984df3967ade';  
    
    fetch(requestCityCond)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);

      todayConditions(data)
      });
  }

//Create card to show Today's weather conditions for specific city
  function todayConditions(weather) {
      todayConditionsEl.empty();

      let cityTitleEl = $('<h5>')
        .addClass("card-title, CityLocation")
        .text(cityName)

      let todayDateEl = ('Today: ' + moment().format("ddd, MMMM Do YYYY"))

      let todayIconEl = $("<img>")
       .attr("src", 'http://openweathermap.org/img/wn/' + weather.current.weather[0].icon + '.png');
      
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
      console.log(dailyConditions)
      fiveDayOutlook(dailyConditions);
  }
  
  function fiveDayOutlook(day) {
    $('.dayContainer').empty();
    for (var i = 1; i < 6; i++) {   
      let fiveDayCardEl = $('<div>')
        .addClass("card col-2 m-2");
        // `fiveDayCard-${[i]}`
      let fiveDayBodyEl = $('<div>')
      .addClass("card-body");
      
      let dayTitleEl = $('<h6>')
        .addClass("card-title")
        .text(moment().add([i], 'day').format("ddd, M/D/YYYY"));

      let dayIconEl = $("<img>")
       .attr("src", 'http://openweathermap.org/img/wn/' + day[i].weather[0].icon + '.png');
      
    //\xB0F creates the degrees sign before F
      let dayTempEl = $("<p>")
        .text('Temp: ' + Math.ceil(day[i].temp.max) + ' \xB0F');
      
      let dayWindEl = $("<p>")
        .text('Wind: ' + Math.ceil(day[i].wind_speed) + ' MPH');
         
      let dayHumidityEl = $("<p>")
        .text('Humidity: ' + day[i].humidity + ' %');
      
      fiveDayBodyEl.append(
       dayTitleEl, 
       dayIconEl, 
       dayTempEl, 
       dayWindEl, 
       dayHumidityEl);

      fiveDayCardEl.append(fiveDayBodyEl);
      // $("#`${[i]}`").append(fiveDayCardEl);
      $('.dayContainer').append(fiveDayCardEl)
    }
      
  }

  // ***MODAL***
  function createModal(confirmCity){
    console.log(confirmCity);
    //set names of each button
    $('#btnOne').text(confirmCity[0].name + ", " + confirmCity[0].state + " in " + confirmCity[0].country);
      $('#btnTwo').text(confirmCity[1].name + ", " + confirmCity[1].state + " in " + confirmCity[1].country);
      $('#btnThree').text(confirmCity[2].name + ", " + confirmCity[2].state + " in " + confirmCity[2].country);

      $('#btnOne').attr({
        latitude: confirmCity[0].lat,
        longitude: confirmCity[0].lon,
      })

      $('#btnTwo').attr({
        latitude: confirmCity[1].lat,
        longitude: confirmCity[1].lon,
      })

      $('#btnThree').attr({
        latitude: confirmCity[2].lat,
        longitude: confirmCity[2].lon,
      })
    }

  const exampleModal = document.getElementById('exampleModal')
  exampleModal.addEventListener('show.bs.modal', event => {
    // Button that triggered the modal
    const button = event.relatedTarget
    // Extract info from data-bs-* attributes
    const recipient = button.getAttribute('data-bs-whatever')
    
  })

  $("#citySearchForm").on("click", "#cityFormBtn", handleCityInput);
  
 
$('#btnOne').on('click', function () {
  console.log('after click');
  latitude = $(this).attr("latitude");
  console.log(latitude);
  longitude = $(this).attr("longitude");

  // convert lat and lon from string to a number
  latitude = + (latitude);
  longitude = + (longitude)
  console.log(longitude);
  getCityDetails(latitude, longitude);
})

$('#btnTwo').on('click', function () {
  console.log('after click');
  latitude = $(this).attr("latitude");
  console.log(latitude);
  longitude = $(this).attr("longitude");

  // convert lat and lon from string to a number
  latitude = + (latitude);
  longitude = + (longitude)
  console.log(longitude);
  getCityDetails(latitude, longitude);
})

$('#btnThree').on('click', function () {
  console.log('after click');
  latitude = $(this).attr("latitude");
  console.log(latitude);
  longitude = $(this).attr("longitude");

  // convert lat and lon from string to a number
  latitude = + (latitude);
  longitude = + (longitude)
  console.log(longitude);
  getCityDetails(latitude, longitude);
})