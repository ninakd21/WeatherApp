$(document).ready(function() {
  var inputEl = $(".form-control");
  var searchHistory = JSON.parse(localStorage.getItem("search"));
  if(!searchHistory) {
  var searchHistory = [];
  }
  else {
  generateHistory();
  }

  $("#search-button").on("click", searchCity)

  // Search by city
  function searchCity() {
    var cityName = inputEl.val();
    getWeather(cityName);
    searchHistory.unshift(cityName);
    localStorage.setItem("search",JSON.stringify(searchHistory));
    $(".hide").removeAttr("hidden");
    generateHistory();
}
  // Fetch API
  function getWeather(cityName) {
    var currentDayURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=d1208842c138ecd1329f632d35edf359";
    fetch(currentDayURL)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
      var currentTitle = document.createElement("h2")
      var weatherIcon = document.createElement("img")
      var temperature = document.createElement("p")
      var humidity = document.createElement("p")
      var windSpeed = document.createElement("p")
      var currentDate = moment().format("l")

      $(currentTitle).addClass("city-name align-middle")
      .html(data.name + " (" + currentDate + ")")

      $(weatherIcon).addClass("weather-icon")
      .attr("src", "http://openweathermap.org/img/wn/" + data.weather[0].icon + ".png")
      .attr("alt", data.weather[0].description);

      $(temperature).html("Temperature: " + data.main.temp + "°F");
      
      $(humidity).html("Humidity: " + data.main.humidity + "%");

      $(windSpeed).html("Wind: " + data.wind.speed + "MPH");

      $("#currentWeather").addClass("white-card").html("").append(currentTitle, weatherIcon, temperature, windSpeed, humidity)
      
      callUV(data.coord.lat, data.coord.lon);
  })
  


  // 5 day forcast
  var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=d1208842c138ecd1329f632d35edf359";
  fetch(forecastURL)
  .then(function(response) {
      return response.json();
  })
  .then(function(data) {
      $("#forecast").html("")     
      for (i = 0; i < 5; i++) {
          var card = $("<div>");
          card.addClass("card text-white mb-3 p-3")
          $("#forecast").append(card)

          $(forecastDates).html(futureDates)

                $(weatherIcon).addClass("icon-small")
                .attr("src", "http://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + ".png")
                .attr("alt", data.list[i].weather[0].description);

                var forecastDates = document.createElement("h5")
                var futureDates = moment().add(i+1, "days").format("l")
                var weatherIcon = document.createElement("img")
                var temperature = document.createElement("p")
                var windSpeed= document.createElement("p")
                var humidity = document.createElement("p")
            

                $(weatherIcon).addClass("icon-small")
                .attr("src", "http://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + ".png")
                .attr("alt", data.list[i].weather[0].description);

                $(forecastDates).html(futureDates)
                $(temperature).html("Temp: " + data.list[i].main.temp + "°F")
                $(windSpeed).html("Wind: " + data.list[i].wind.speed + "MPH")
                $(humidity).html("Humidity: " + data.list[i].main.humidity + "%")

                card.append(card, forecastDates, weatherIcon, temperature, windSpeed, humidity)
                      }
                    })
                    }

  function callUV(lat, lon) {
    var uvURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=d1208842c138ecd1329f632d35edf359"
    fetch(uvURL)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        var uvEl = document.createElement("p")
        $(uvEl).text("UV index: ")
        var uvColor = document.createElement("span")
        $(uvColor).addClass("btn btn-sm").html(data.current.uvi)

        if (data.current.uvi >= 0 && data.current.uvi < 3) {
            $(uvColor).addClass("btn-success")
        }
        else if (data.current.uvi >=3 && data.current.uvi < 6) {
            $(uvColor).addClass("btn-yellow")
        }
        else if (data.current.uvi >= 6 && data.current.uvi < 8) {
            $(uvColor).addClass("btn-orange")
        }
        else if (data.current.uvi >= 8 && data.current.uvi < 11) {
            $(uvColor).addClass("btn-danger")
        }
        else {
            $(uvColor).addClass("btn-violet")
        }
        $("#currentWeather").append(uvEl)
        uvEl.append(uvColor)
    })
}
      // get search history
      function generateHistory() {
        $("#history").html("");
        for(i = 0; i < searchHistory.length; i++){
        var historyEl = document.createElement("li")
        $(historyEl).addClass("list-group-item btn bg-light").text(searchHistory[i]);
        $("#history").append(historyEl)
        }
    }

    // Click to Get the Search Result Again
    $("#history").on("click", "li", function() {
      $(".hide").removeAttr("hidden");
      getWeather($(this).text());
    })

    // Clears Local Storage
    $("#clear-button").on("click", function(){
      localStorage.clear();
    })

})