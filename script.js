let dataArr = [];
const outputDisplay = {};
const suggestionsBox = document.querySelector("#suggestions")
const input = document.querySelector("#input")
const searchBtn = document.querySelector(".btn")

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

        outputDisplay.latitude = latitude;
        outputDisplay.longitude = longitude
        console.log(outputDisplay)
    }
}

function getWeather() {

}