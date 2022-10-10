let todayConditionsEl = $('.todayConditions');

let userCityInput;
let searchedCity;
let cityList = [];
let latitude;
let longitude;
let dailyConditions;
let cityName;

// init();
// //set city storage to an empty array when page is refreshed
// function init() {
//   cityList = [];
//   localStorage.setItem("city", JSON.stringify(cityList));
// }

// UserInput returns 3 top matches sent to Modal
function getCityNames(event) {
  event.preventDefault();
  userCityInput = $(this).siblings("#cityFormInput").val();
  if (userCityInput == "") {
    console.log('empty input')
  } else {
  let requestUrl = ' http://api.openweathermap.org/geo/1.0/direct?q=' + userCityInput + '&limit=3&appid=e821e3b80ebc742487bb15e97528ea81';

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

// Modal trigger
const exampleModal = document.getElementById('exampleModal')
exampleModal.addEventListener('show.bs.modal', event => {
  // Button that triggered the modal
  const button = event.relatedTarget
})

// Handle choice of city from Modal
$('#btnOne').on('click', function () {
  latitude = $(this).attr("latitude");
  longitude = $(this).attr("longitude");
  cityName = $('#btnOne').text();

  handleSavedCity(cityName, latitude, longitude);
  getCityDetails(latitude, longitude);
})

$('#btnTwo').on('click', function () {
  latitude = $(this).attr("latitude");
  longitude = $(this).attr("longitude");
  cityName = $('#btnTwo').text();

  // convert lat and lon from string to a number
  latitude = + (latitude);
  longitude = + (longitude)
  console.log(longitude);
  handleSavedCity(cityName, latitude, longitude);
  getCityDetails(latitude, longitude);
})

$('#btnThree').on('click', function () {
  latitude = $(this).attr("latitude");
  console.log(latitude);
  longitude = $(this).attr("longitude");
  cityName = $('#btnThree').text();
1
  // convert lat and lon from string to a number
  latitude = + (latitude);
  longitude = + (longitude)
  console.log(longitude);
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
      fiveDayOutlook(dailyConditions);
  }
  
  function fiveDayOutlook(day) {
    $('.dayContainer').empty();
    for (var i = 1; i < 6; i++) {   
      let fiveDayCardEl = $('<div>')
        .addClass("card col-2 m-2 day");
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
    console.log(latitude);
    longitude = $(this).attr("longitude");
    console.log(longitude);
    cityName = $(this).text();
    console.log(cityName);
    getCityDetails(latitude, longitude, cityName);
  });

$("#citySearchForm").on("click", "#cityFormBtn",getCityNames);
