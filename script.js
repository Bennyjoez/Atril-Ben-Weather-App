let dataArr = [];
let coord = {}
let outputDisplay = {};
const suggestionsBox = document.querySelector("#suggestions")
const input = document.querySelector("#input")
const searchBtn = document.querySelector(".btn")

const citySearched = document.querySelector('.city-searched');
const weatherStatus = document.querySelector(".weather-status")
const temperature = document.querySelector('.temperature')
const image = document.querySelector('.image-icon')

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
    })

    suggestionsBox.addEventListener("click", setSearch)

    function setSearch(e) {
        input.value = e.target.textContent
        suggestionsBox.innerHTML = ""
        const latitude = e.target.value.split(" ")[0]
        const longitude = e.target.value.split(" ")[1]

        coord.latitude = latitude;
        coord.longitude = longitude;
        getWeather(coord)
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
    }
}

function updateDisplay({name,weather,wind,main,sys}) {
    citySearched.textContent = name.toUpperCase()
    weatherStatus.textContent = weather[0].description
    image["src"] = `./icons/` + weather[0].icon + ".png"
}