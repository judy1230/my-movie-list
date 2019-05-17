
//(function() {
	const dataPanel = document.getElementById('data-panel')
	const BASE_URL = 'https://movie-list.alphacamp.io'
	const INDEX_URL = BASE_URL + '/api/v1/movies/'
	const POSTER_URL = BASE_URL + '/posters/'
	const data = []
	//console.log(POSTER_URL)
	//console.log(INDEX_URL)

	axios.get(INDEX_URL).then((response) => {
		data.push(...response.data.results)
		display(data)
		getTotalPages(data)
		getPageData(1, data)    
		console.log(data)
	}).catch((err) =>
		console.log(err))

// listen to data panel
dataPanel.addEventListener('click', (event) => {
	if (event.target.matches('.btn-show-movie')) {
		showMovie(event.target.dataset.id)
	} else if (event.target.matches('.btn-add-favorite')) {
		addFavoriteItem(event.target.dataset.id)
	}
})

function addFavoriteItem(id) {
	const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
	const movie = data.find(item => item.id === Number(id))
	console.log(data)
	console.log(movie)
	if (list.some(item => item.id === Number(id))) {
		alert(`${movie.title} is already in your favorite list.`)
	} else {
		list.push(movie)
		alert(`Added ${movie.title} to your favorite list!`)
	}
	localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

// display 
const List = document.querySelector('#display')
console.log(List)

function display(data){
	
	displayDataCard(data)
	List.addEventListener('click', (event) => {
		if (event.target.matches('.list')) {
			console.log(this)
			console.log(event.target)
			displayDataList(data)
		} else if (event.target.matches('.card')) {
			console.log(this)
			console.log(event.target)
			displayDataCard(data)
		}
		
	})
}

// List.addEventListener('click', (event) => {
// 	if (event.target.matches('.list')) {
// 	   	console.log(this)
// 	  	console.log(target.event)
// 		displayDataList(data)
// 	} else if (event.target.matches('.card')) {
// 		displayDataCard(data)
// 	}
// 	else {
// 		displayDataCard(data)
// 	}
// })

function displayDataCard(data) {
	console.log(this)
	console.log(data)
	let htmlContent = ''
	data.forEach(function (item, index) {
		htmlContent += `
  <div class="col-sm-3">
    <div class="card mb-2">
      <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
      <div class="card-body movie-item-body">
        <h6 class="card-title">${item.title}</h5>
      </div>
     <!-- "More" button -->
        <div class="card-footer">
        <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
				 </div>
			<!-- favorite button -->
          <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>	 
    </div>
	</div>
				
		   	 	
`
	})
	dataPanel.innerHTML = htmlContent

}

function displayDataList(data) {
	console.log(this)
	console.log(data)
	let htmlContent = ''
	data.forEach(function (item, index) {
		htmlContent += `

      <div class="row col-sm-12" style = "margin-bottom:10px;">
        <h5 class="col-sm-9">${item.title}</h5>
     <!-- "More" button -->
				<button class="btn btn-primary btn-show-movie col-sm-1" data-toggle="modal" data-target="#show-movie-modal " data-id="${item.id}"
				style = "margin-right:10px;">More</button>
			<!-- favorite button -->
          <button class="btn btn-info btn-add-favorite col-sm-1" data-id="${item.id}">+</button>	 
			</div>	
						
`
	})
	dataPanel.innerHTML = htmlContent

}



function showMovie(id) {
	// get elements
	const modalTitle = document.getElementById('show-movie-title')
	const modalImage = document.getElementById('show-movie-image')
	const modalDate = document.getElementById('show-movie-date')
	const modalDescription = document.getElementById('show-movie-description')

	// set request url
	const url = INDEX_URL + id
	console.log(url)

	// send request to show api
	axios.get(url).then(response => {
		const data = response.data.results
		console.log(data)

		// insert data into modal ui
		modalTitle.textContent = data.title
		modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
		modalDate.textContent = `release at : ${data.release_date}`
		modalDescription.textContent = `${data.description}`
	})
}
//})()

const searchBtn = document.getElementById('submit-search')
const searchInput = document.getElementById('search')

// listen to search btn click event
searchBtn.addEventListener('click', event => {
	let results = []
	event.preventDefault()

	const regex = new RegExp(searchInput.value, 'i')

	results = data.filter(
		movie => movie.title.match(regex)
	)
	console.log(results)
	//displayDataList(results)
	getTotalPages(results)
	getPageData(1, results)
})





//////pagination/////

const pagination = document.getElementById('pagination')
const ITEM_PER_PAGE = 12

// ...

function getTotalPages(data) {
	console.log(data)
	let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
	console.log(totalPages)
	let pageItemContent = ''
	for (let i = 0; i < totalPages; i++) {
		pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
	}
	pagination.innerHTML = pageItemContent
}

let paginationData = []

// ...
function getPageData(pageNum, data) {
	paginationData = data || paginationData
	let offset = (pageNum - 1) * ITEM_PER_PAGE
	let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
	display(pageData)
}

	// listen to pagination click event
pagination.addEventListener('click', event => {
	console.log(event.target.dataset.page)
	if (event.target.tagName === 'A') {
		getPageData(event.target.dataset.page)
	}
})

