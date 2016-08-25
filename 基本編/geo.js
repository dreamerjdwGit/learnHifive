$(function() {
var x=document.getElementById("canvas");

    navigator.geolocation.getCurrentPosition(showPosition);
  
function showPosition(position)
  {
  	alert("1");
  x.innerHTML="Latitude: " + position.coords.latitude +
  "<br />Longitude: " + position.coords.longitude;
  }
});