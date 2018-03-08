
var lonStr = "";
var latStr = "";
var theUnits;
var rawTemp;
function failLocation() {
  console.log("failed to get location");
}

function successLocation(pos) {
  latStr += pos.coords.latitude;
  lonStr += pos.coords.longitude;
  console.log(latStr);
  console.log(lonStr);
  var GEOCODING = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latStr + '%2C' + lonStr + '&language=en';
  
  $.getJSON(GEOCODING).done(function(location) {
                //$('#country').html(location.results[0].address_components[5].long_name);
                $('#state').html(location.results[0].address_components[4].long_name);
                $('#city').html(location.results[0].address_components[2].long_name +',\t');
                //$('#address').html(location.results[0].formatted_address);
                //$('#latitude').html(position.coords.latitude);
                //$('#longitude').html(position.coords.longitude);
            })
  
  getWeather();
}

function getLocation() {
  navigator.geolocation.getCurrentPosition(successLocation, failLocation);
}

function skycon(val) {
  var skycons = new Skycons({"color": "white", "resizeClear": true});
  skycons.add('icon1', val);
  
  skycons.play();
}

function getWeather() {

  var keywapi = ""; //put your dark sky api key here

  var darkSkyLink = "";
  
  
  darkSkyLink += 'https://api.darksky.net/forecast/';
  darkSkyLink += keywapi +'/' + latStr + ',' + lonStr;
  darkSkyLink += '?callback=?&exclude=minutely,hourly,daily,alerts';
  
  //console.log(darkSkyLink);
  
  $.getJSON(darkSkyLink).then(function(forecast) {
    //console.log(forecast);
    //console.log(forecast.currently.temperature);
    rawTemp = forecast.currently.temperature;
    var curtmp = Math.floor(forecast.currently.temperature);
    $('#temp').html(curtmp +'&deg;');
    var units = forecast.flags.units;
    if(units === "us"){
      $('#units').html('F');
      theUnits = 'F';
    }else{
      $('#units').html('C');
      theUnits = 'C';
    }
    
    var curskycon = forecast.currently.icon;
    skycon(curskycon);
  });
  
}

function switchUnits() {
  if(theUnits === 'F'){
    var newTemp = Math.floor((rawTemp - 32) / 1.8);
    theUnits = 'C';
    $('#temp').html(newTemp +'&deg;');
    $('#units').html('C');
  }else{
    var newTemp = Math.floor(rawTemp);
    theUnits = 'F';
    $('#temp').html(newTemp +'&deg;');
    $('#units').html('F');
  }
}

$("document").ready(function(){
  getLocation();
  $('#units').click(switchUnits);
});
