const dataArr = [];
const suggestionsBox = document.querySelector("#suggestions")
const input = document.querySelector("#input")
const searchBtn = document.querySelector(".btn")

searchBtn.addEventListener("click", respond)
input.addEventListener("keypress", respond)

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '4f02c2c106msh9d82fbac7d29585p139b23jsndeed0f527155',
		'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
	}
};


function respond()  {
    suggestionsBox.innerHTML = ""
    const searched = input.value.toLowerCase()

    fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${searched}`, options)
        .then(response => response.json())
        .then(response => {
            if(response.data) {
                return response.data.map(loc => {
                    let {city, country, latitude, longitude} = loc
                    dataArr.push({city, country, latitude, longitude})
                })
            }
        })
        .catch(err => console.error(err));

        if(dataArr.length > 0) {
            suggestions(dataArr)
        }
}



function suggestions(dataArr) {
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
    }
}