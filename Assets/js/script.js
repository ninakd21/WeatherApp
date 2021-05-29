function searchWeather() {
    var search = document.querySelector('#search').value;
    fetch(
      'http://api.openweathermap.org/data/2.5/weather?q=?' +
        search +
        '&appid={d1208842c138ecd1329f632d35edf359}'
    )
      .then(function(response) {
        return response.json();
      })
      .then(function(response) {
        console.log(response.data[0]);
        var responseContainerEl = document.querySelector('#response-container');
        responseContainerEl.innerHTML = '';
        var weatherImg = document.createElement('img');
        weatherImg.setAttribute('src', response.data[0].images.fixed_height.url);
        responseContainerEl.appendChild(weatherImg);
      });
  }
  