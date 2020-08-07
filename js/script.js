// MOMENT FOR THE CURRENT DAY AND TIME
$("#currentDay").text(moment().format('MMMM Do YYYY, h:mm:ss a'));



//EVENT LISTENER FOR SEARCH BUTTON 
$(".search").on("click", function (event) {
    event.preventDefault();
    var apikey = "dc65ec67ee0c11e97e2c814b38aa1f9f"
    //SELECT CITY FROM INPUT
    var cityName = $(".search-control").val().trim()
    //console.log(cityName)
    var queryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apikey}`


    console.log("Searching City: " + cityName)
    //make api call using ajax with city name
    $.get(queryUrl, function (res) {
        var lat = res.coord.lat
        var long = res.coord.lon
        var oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&
        units=Imperial&appid=${apikey}`



        let searchElement = $(`<li class="list-group-item city-list-item">${cityName}</li>`);
        $('.city-list').append(searchElement);


        $.get(oneCallUrl, function (data) {
            console.log(data);

            data.daily.map((card, index) => {
                // console.log("card: ", card);
                if (index < 6) {
                    let header = `Day # ${index + 1}`;
                    let humidity = `Humidity: ${card.humidity}`;
                    let temp = `Temperature: ${card.temp.day}`;
                    let windSpeed = `Wind Speed: ${card.wind_speed}`;
                    let uvIndex = `UV Index: ${card.uvi}`;

                    let iconURL = `https://openweathermap.org/img/wn/${card.weather[0].icon}.png`;
                    let iconElement = $(`<img src='${iconURL}' alt="Weather Icon" height="50" width="50" />`);

                    //UPDATE HTML WITH CURRENT WEATHER DATA 

                    $(`.card-title-${index}`).empty();
                    $(`.city`).html("<h1>" + res.name + "</h1>");
                    $('.city').append(iconElement);
                    $(`.card-title-${index}`).append(iconElement);
                    $(`.header-${index}`).text(header);
                    $(`.windSpeed-${index}`).text(windSpeed + ` MPH`);
                    $(`.humidity-${index}`).text(humidity + ` %`);
                    $(`.uvIndex-${index}`).text(uvIndex);
                    $(`.temp-${index}`).text(temp + ` ºF`);
                }

            });


        })
        searchElement.on(`click`, function (event) {

            console.log(event.target.html, cityName);
            //get the city out of the event.target
            //Set the .search-contorl element to be the city
            $(`.search-control`).val().trim()
                //send a click to the .search element
                .searchElement.on(`click`)
            //console.log(`clicked li`)
        })
        // log out response
        console.log(res)



    })
})