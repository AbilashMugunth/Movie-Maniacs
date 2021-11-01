// *! MODAL /////////////////////////

let modal = document.querySelector(".modal");

//  select the open-btn button
let openBtn = document.getElementById("open-btn");

//  select the modal-background
let modalBackground = document.getElementById("modal-background");

//  select the close-btn
let closeBtn = document.getElementById("close-btn");

//  shows the modal when the user clicks open-btn
openBtn.addEventListener("click", function () {
  modalBackground.style.display = "block";
});

//  hides the modal when the user clicks close-btn
closeBtn.addEventListener("click", function () {
  modalBackground.style.display = "none";
});

// hides the modal when the user clicks outside the modal
window.addEventListener("click", function (event) {
  //  check if the event happened on the modal-background
  if (event.target === modalBackground) {
    //  hides the modal
    modalBackground.style.display = "none";
  }
});

// !! /////////////////////////////////////////////////////////

const searchTab = document.querySelector(".search");
const searchBtn = document.querySelector(".searchbutton");
const container = document.querySelector(".container");

const trendingUrl = `https://api.themoviedb.org/3/trending/all/day?api_key=75542ca7e7e28fbe66275047177d4cd2`;
const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=75542ca7e7e28fbe66275047177d4cd2&query=`;

searchTab.addEventListener("keyup", function (event) {
  const string = searchTab.value;

  if (event.keyCode === 13 && searchTab.value !== undefined) {
    event.preventDefault();
    movieDb(`${searchUrl}+${string}`);

    if (searchTab.value == "") {
      window.location.reload();
    }
  }
});

const movieDb = async function (url) {
  try {
    const getJson = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    // console.log(getJson);
    const getMovie = await getJson.json();
    const movieList = getMovie.results;
    insert(movieList);
  } catch (error) {
    console.log(error);
  }
};

//Displays initial trending page
movieDb(trendingUrl);

function insert(movieList) {
  container.innerHTML = "";
  movieList.forEach((element) => {
    // console.log(element);
    const movieContainer = document.createElement("div");
    movieContainer.classList.add("movie");

    if (element.poster_path == null) {
      movieContainer.style.display = "none";
    }

    function naming() {
      if (element.title == undefined) {
        return element.name;
      } else {
        return element.title;
      }
    }

    function date() {
      if (element.release_date == undefined) {
        return "Unknown";
      } else {
        return element.release_date.slice(0, 4);
      }
    }

    movieContainer.innerHTML = `
    <img class="poster" src="https://image.tmdb.org/t/p/w500${
      element.poster_path
    }" alt="image not found :(">
    <div class='movieinfo'>
      <div class='movie-head'>
        <p class="title">${naming()}</p>
        <i class="fas  list-icon fa-plus"></i>
      </div>
      <p class="date">${date()}</p>
      <p class="overview">${element.overview}</p>
      
      <p class="vote"> <i class="fas fa-star"></i>
      ${element.vote_average}</p>
    </div>`;
    container.appendChild(movieContainer);
  });

  const addToWatchlistIcons = document.querySelectorAll(".list-icon");
  checking(addToWatchlistIcons);
}

function toastNotification() {
  Toastify({
    text: "Added to watchlist",
    duration: 1000,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      color: "#041c35",
      background: "#F5C518",
    },
  }).showToast();
}

function checking(icons) {
  icons.forEach((icon) => {
    icon.addEventListener("click", () => {
      toastNotification();
    });
    icon.addEventListener("click", addToWatchlist);
  });
}

function addToWatchlist(event) {
  const clickedIcon = event.target;
  console.log(clickedIcon);

  const infoContainer = document.createElement("tr");
  infoContainer.classList.add("infocontainer");

  const eachMovieBox = clickedIcon.parentElement.parentElement.parentElement;
  console.log(typeof eachMovieBox);
  const modalMovieImg = eachMovieBox.children[0].src;
  const modalMovieTitle =
    eachMovieBox.children[1].children[0].children[0].innerText;

  const modalMovieVote = eachMovieBox.children[1].children[3].innerText;

  //////////////////////////////////////////

  // const key = modalMovieTitle;
  // const value = modalMovieImg;

  // for (let i = 0; i < localStorage.length; i++) {
  //   const key = localStorage.key(i);
  //   const value = localStorage.getItem(key);
  //   console.log(`${key} ${value}`);
  // }
  addComponents(modalMovieImg, modalMovieTitle, modalMovieVote, infoContainer);
  localStorage.setItem("movie", eachMovieBox);

  //////////////////////////////////////////
}

function addComponents(img, title, vote, container) {
  container.innerHTML = ` 
  <td><img class='modalMovieImg'src="${img}" alt="movie not found"></td>
  <td class="uk-table-link">
    <p class="modalMovieTitle">${title}</p>
  </td>
  <td class="modalMovieVote"><p>${vote}</p></td>
  <label class="label">
  <input class="label__checkbox watched-btn" type="checkbox" />
  <span class="label__text">
    <span class="label__check">
      <i class="fa fa-check icon"></i>
    </span>
  </span>
</label>`;
  modal.append(container);

  const watchedBtns = document.querySelectorAll(".watched-btn");
  removeModalMovie(watchedBtns);
}

function removeModalMovie(watchedBtns) {
  watchedBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const watchedBtn = event.target;
      const removeParent = watchedBtn.parentElement.parentElement;
      setTimeout(() => {
        removeParent.remove();
      }, 700);
    });
  });
}

console.log(localStorage);

/////////////////////////////////////////////////
