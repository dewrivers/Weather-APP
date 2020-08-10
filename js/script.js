// MOMENT FOR THE CURRENT DAY AND TIME
$("#currentDay").text(moment().format('MMMM Do YYYY, h:mm:ss a'));

var cityList = JSON.parse(localStorage.getItem("cityList")) || []

//EVENT LISTENER FOR SEARCH BUTTON 
$(".search").on("click", function (event) {
    event.preventDefault();
    var city = $(".search-control").val().trim()
    getForcast(city)
})

function getForcast(cityName) {
    var apikey = "dc65ec67ee0c11e97e2c814b38aa1f9f"
    //SELECT CITY FROM INPUT
    //console.log(cityName)
    var queryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apikey}`


    console.log("Searching City: " + cityName)
    //MAKE API CALL USING AJAX WITH CITY NAME
    $.get(queryUrl, function (res) {
        var lat = res.coord.lat
        var long = res.coord.lon
        var oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=imperial&appid=${apikey}`

        var found = cityList.find(function (el) {
            return el === cityName
        })
        if (!found) {
            cityList.unshift(cityName)
            localStorage.setItem('cityList', JSON.stringify(cityList))
            let searchElement = $(`<li class="list-group-item city-list-item">${cityName}</li>`);
            $('.city-list').append(searchElement);
        }

        $.get(oneCallUrl, function (data) {
            console.log(data);

            data.daily.map((card, index) => {
                // console.log("card: ", card);
                if (index < 6) {

                    let header = moment.unix(card.dt).format("MMMM Do YYYY")
                    let humidity = `Humidity: ${card.humidity}`;
                    let temp = `Temperature: ${card.temp.day}`;
                    let windSpeed = `Wind Speed: ${card.wind_speed}`;
                    let uvIndex = `UV Index: ${card.uvi}`;
                    let iconURL = `https://openweathermap.org/img/wn/${card.weather[0].icon}.png`;
                    let iconElement = $(`<img src='${iconURL}' alt="Weather Icon" height="50" width="50" />`);

                    if (card.uvi > 5) {
                        $(".uvIndex-0").addClass("severe");
                        $(".severe").css('color', "purple");
                    };

                    if (card.uvi <= 2) {
                        $(".uvIndex-0").addClass("good");
                        $(".good").css("color", "green");

                    };
                    if (card.uvi <= 8) {
                        $(".uvIndex-0").addClass("moderate");
                        $(".moderate").css("color", "yellow");

                    };

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
        // log out response
        console.log(res)

    })
}

function renderCityButtons() {
    for (let i = 0; i < cityList.length; i++) {
        let searchElement = $(`<li class="list-group-item city-list-item">${cityList[i]}</li>`);
        $('.city-list').append(searchElement)
    }
    if (cityList.length > 0) {
        getForcast(cityList[0])
    }
}

renderCityButtons();

$(document).on(`click`, '.city-list-item', function (event) {
    //console.log(event.target)
    var city = $(this).text()
    //console.log(city)
    getForcast(city)
})