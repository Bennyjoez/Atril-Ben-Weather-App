let dataArr = [];
let coord = {}
let outputDisplay = {};
const suggestionsBox = document.querySelector("#suggestions")
const input = document.querySelector("#input")
const searchBtn = document.querySelector(".btn")

const citySearched = document.querySelector('.city-searched');
const weatherStatus = document.querySelector(".weather-status")
const temperature = document.querySelector('.temp-value')
const image = document.querySelector('.image-icon')
const minMax = document.querySelector(".minMax")
const humidity = document.querySelector(".humidity")
const pressure = document.querySelector('.pressure')
const seaLevel = document.querySelector('.sea-level')
const weatherPredictions = document.querySelector('.weather-predictions')

searchBtn.addEventListener("click", fetchCityData)
input.addEventListener("keypress", update)

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '4f02c2c106msh9d82fbac7d29585p139b23jsndeed0f527155',
		'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
	}
};

function update(e) {
    if(e.key == "Enter") {
        fetchCityData(e)
    }
}

async function fetchCityData(e) {
    e.preventDefault()
    if(input.value != "") {
        const searched = input.value.toLowerCase()
        const response = await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${searched}`, options)
        const json = await response.json()
        json.data.map(loc => {
            let {city, country, latitude, longitude} = loc;
            dataArr.push({city, country, latitude, longitude})
        })

        if(dataArr.length > 0) {
            suggestions(dataArr)
            dataArr = []
        }
    }
}

function suggestions(dataArr) {
    suggestionsBox.innerHTML = ""
    dataArr.map(city => {
        const suggestion = document.createElement("div")
        suggestion.textContent += `${city.city}, ${city.country}`
        suggestion.value = `${city.latitude} ${city.longitude}`
        suggestionsBox.appendChild(suggestion)
        suggestion.addEventListener('click', setSearch)
    })


    function setSearch(e) {
        let cityName = e.target.textContent.split(', ')[0]
        input.value = e.target.textContent
        suggestionsBox.innerHTML = ""
        const latitude = e.target.value.split(" ")[0]
        const longitude = e.target.value.split(" ")[1]

        coord.latitude = latitude;
        coord.longitude = longitude;
        getWeather(coord)
        
        if(cityName) {
            predictWeather(cityName)
        }
    }
}

async function getWeather({latitude, longitude}) {
    const key = "fb2362ceeb96e21d536c54406253b2ec"

    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`)
    const response = await res.json()

    const {name, weather, wind, main, sys} = response
    
    outputDisplay = {
        name,
        weather,
        wind,
        main,
        sys
    }

    if(outputDisplay.name) {
        updateDisplay(outputDisplay)
        changeBackground()
    }

}

async function predictWeather(name) {
    weatherPredictions.innerHTML = ""
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${name}&appid=dd7436824d3359164bc4c6a7375b1dfc`);
    const response = await res.json()
    let arr = response.list

    for(let i = 8; i < arr.length; i+=8) {
        let day
        const timeStamp = arr[i].dt
        const dey = new Date(timeStamp * 1000).getDay()
        switch(dey) {
            case 0:
                day = 'Sunday'
                break;
            case 1:
                day = "Monday"
                break;
            case 2: 
                day = "Tuesday"
                break;
            case 3:
                day = "Wednesday"
                break;
            case 4:
                day = "Thursday"
                break;
            case 5: 
                day = "Friday"
                break;
            case 6: 
                day = "Saturday"
                break;
        }
        
        predictionTile(arr[i], day)
    }
    
    function predictionTile(obj, day) {
        const tile = document.createElement('div')
        tile.innerHTML = 
        `<div class="weather-prediction-tile">
                        <h1>${day}</h1>
                        <div class="weather-status">
                            ${obj.weather[0].description}
                        </div>
                        <img src="./icons/${obj.weather[0].icon}.png" alt="" class="image-icon-prediction">
                        <div class="temperature">
                            <span class="temp-value">${convTemp(obj.main.temp)}</span>°C
                        </div>
        </div>`

        weatherPredictions.appendChild(tile)
    }
}

function updateDisplay({name,weather,wind,main,sys}) {
    citySearched.textContent = name.toUpperCase();
    weatherStatus.textContent = weather[0].description ;
    image["src"] = `./icons/` + weather[0].icon + ".png";
    temperature.textContent = convTemp(main.temp);
    minMax.textContent = `${convTemp(main.temp_min)}/${convTemp(main.temp_max)}`;
    humidity.textContent = main.humidity;
    pressure.textContent = main.pressure;
    seaLevel.textContent = main["sea_level"]
}

function convTemp(temp) {
    return Math.round(temp - 273)
}

function changeBackground() {
    let weather = outputDisplay.weather[0].main

    if(weather == "Clouds") {
        document.body.style.backgroundImage = "url('https://images.pexels.com/photos/209831/pexels-photo-209831.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')";
    } else if(weather == "Clear") {
        document.body.style.backgroundImage = "url('https://images.pexels.com/photos/912364/pexels-photo-912364.jpeg?auto=compress&cs=tinysrgb&w=600')";
    } else if(weather == "Mist"){
        document.body.style.backgroundImage = "url('https://images.pexels.com/photos/4215110/pexels-photo-4215110.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')";
    } else if (weather == "Rain") {
        document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1593981211728-41e4e796ec96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80')";
    } else if(weather == "Fog"){
        document.body.style.backgroundImage = "url('https://images.pexels.com/photos/163323/fog-dawn-landscape-morgenstimmung-163323.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')";
    } else if(weather == "Drizzle"){
        document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1525087740718-9e0f2c58c7ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80')";
    } else if(weather == "Smoke"){
        document.body.style.backgroundImage = "url('https://images.pexels.com/photos/4406353/pexels-photo-4406353.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')";
    }
}


  