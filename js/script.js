const URL = "https://japceibal.github.io/japflix_api/movies-data.json"
const btnSearch = document.getElementById("btnBuscar");
const inputSearch = document.getElementById("inputBuscar");
let list = document.getElementById('lista');

document.addEventListener('DOMContentLoaded', () => {
    listMovies(URL); 
});

async function listMovies(url){
    try { 
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Hubo un problema con la solicitud: ${response.status}`);
        }
        const data = await response.json();
        btnSearch.addEventListener('click', () => {
            search(data)
        });
    } catch (error) {
        console.log(error);
    }
}

function search(movies){
    if (inputSearch.value.toLowerCase().trim()) {
        showMovies(movies);
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Debes ingresar al menos una letra!'
          })
    }
}

function showMovies(movies){
    list.innerHTML = '';
    for (const movie of filteredMovies(movies)) {
        list.innerHTML += `
        <li> 
            <div class="media-body border border-secondary border-1 px-3 py-2 text-light" type="button" data-bs-toggle="offcanvas"  data-bs-target="#offcanvasTop${movie.id}" aria-controls="offcanvasTop${movie.id}"> 
                <div class="d-flex align-items-center">
                    <p class="mb-0 text-light"><strong> ${movie.title} </strong> - ${showStars(movie.vote_average)} </p>
                </div>
                <p class="mb-0 text-muted"> <i>${movie.tagline}</i> </p>
            </div>
        </li>
        <div class="offcanvas offcanvas-top text-light" tabindex="-1" id="offcanvasTop${movie.id}" aria-labelledby="offcanvasTopLabel" style="background-color:#1c3147;">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="offcanvasTopLabel" style="color:#E1E5F2;">${movie.title}</h5>
                <button type="button" class="btn-close btn-light" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                <p>${movie.overview}</p>
                <hr>
            </div>
            <div class="d-flex container-fluid justify-content-between px-3 mb-2">
                <div class="d-flex align-items-center">
                    <small>${movie.genres.map(genre => genre.name).join(' - ')}</small>
                </div>
                <div class="dropdown d-grid d-flex justify-content-end">
                    <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        More
                    </button>
                    <ul class="dropdown-menu">
                        <li class="dropdown-item">Year: ${convertDate(movie.release_date)}</li>
                        <li class="dropdown-item">Runtime: ${movie.runtime} mins</li>
                        <li class="dropdown-item">Budget: ${movie.budget}</li>
                        <li class="dropdown-item">Revenue: USD ${movie.revenue}</li>
                    </ul>
                </div>
            </div>
        </div>
        ` 
    }
}
function filteredMovies(movies) {
    const typedLetters = inputSearch.value.toLowerCase().trim();
    const filteredMovies = movies.filter((movie) => {
        return ( 
            movie.title.toLowerCase().includes(typedLetters) || 
            movie.tagline.toLowerCase().includes(typedLetters) || 
            movie.overview.toLowerCase().includes(typedLetters) ||
            movie.genres.some((genre) => genre.name.toLowerCase().includes(typedLetters))
        );
      });
      return filteredMovies;
}

//Función que genera las estrellas para los comentarios.
function showStars(quantity){
  let stars = "";
  let quantityd = parseInt(quantity / 2)
  for (let i = 0; i < quantityd; i++) {
    stars += `<span class="fa fa-star checked"></span>`;
  }

  for (let i = quantityd; i < 5; i++) {
    stars += `<span class="fa fa-star"></span>`;
  }
  return stars;
}

function convertDate(date) {
    return new Date(date).getFullYear();
}

