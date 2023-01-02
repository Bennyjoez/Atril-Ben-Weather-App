const input = document.querySelector("#input")
const searchBtn = document.querySelector(".btn")

searchBtn.addEventListener("click", respond)

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '4f02c2c106msh9d82fbac7d29585p139b23jsndeed0f527155',
		'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
	}
};


function respond()  {
    const searched = input.value.toLowerCase()

    const data = fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${searched}`, options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
    console.log(data)
}