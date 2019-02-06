// console.log('hola mundo!');
// const noCambia = "Leonidas";

// let cambia = "@LeonidasEsteban"

// function cambiarNombre(nuevoNombre) {
//   cambia = nuevoNombre
// }

// const getUserAll = new Promise(function(todoBien, todoMal) {
//   // llamar a un api
//   setTimeout(function() {
//     // luego de 3 segundos
//     todoBien('se acabá el tiempo');
//   }, 5000)
// })

// const getUser = new Promise(function(todoBien, todoMal) {
//   // llamar a un api
//   setTimeout(function() {
//     // luego de 3 segundos
//     todoBien('se acabá el tiempo 3');
//   }, 3000)
// })

// getUser
//   .then(function() {
//     console.log('todo estÃ¡ bien en la vida')
//   })
//   .catch(function(message) {
//     console.log(message)
//   })

// Promise.race([
//   getUser,
//   getUserAll,
// ])
// .then(function(message) {
//   console.log(message);
// })
// .catch(function(message) {
//   console.log(message)
// })

// Ajax con JQuery 

// $.ajax('https://randomuser.me/api/sdfdsfdsfs', {
//   method: 'GET',
//   success: function(data) {
//     console.log(data)
//   },
//   error: function(error) {
//     console.log(error)
//   }
// })

// Ajax con JavaScript

// fetch('https://randomuser.me/api')
//   .then(function (response) {
//     // console.log(response)
//     return response.json()
//   })
//   .then(function (user) {
//     console.log('user', user.results[0].name.first)
//   })
//   .catch(function() {
//     console.log('algo falla')
//   });




(async function load() {
  // Primera parte del reto: Usuarios: 
  async function getUser(url) {
    const response = await fetch(url);
    const dataUser = await response.json();
    return dataUser.results[0];
  }

  const USER_URL = 'https://randomuser.me/api';
  const NUMBER_USERS = 8;

  function userTemplate(user){
    return(`
      <li class="playlistFriends-item">
        <a href="#">
          <img src="${user.picture.large}" alt="echame la culpa" />
          <span>${user.name.first} ${user.name.last}</span>
        </a>
      </li >
    `);
  }

  async function usersList (numberUsers){
    const usersArray = new Array();
    for (let index = 0; index < numberUsers; index++) {
      await getUser(USER_URL)
      .then((user) => {
        usersArray.push(user);
      });
    }
    return usersArray;
  } 

  function createUserTemplate(userHTML) {
    const html = document.implementation.createHTMLDocument();
    html.body.innerHTML = userHTML;
    return html.body.children[0];
  }
   
  function renderPlaylist(list, $container) {
    $container.children[0].remove();
    list.forEach((user) => {
      const userHTML = userTemplate(user);
      const userElement = createUserTemplate(userHTML);
      $container.append(userElement);
      const image = userElement.querySelector('img');
      image.addEventListener('load', (event) => {
        event.srcElement.classList.add('fadeIn');
      });
    });
  };
  
  const userList = await usersList(NUMBER_USERS);
  const $playlistFriends = document.querySelector('.playlistFriends');
  renderPlaylist(userList, $playlistFriends);
  // Fin reto primera parte

  // Reto segunda parte: top 10 peliculas

  function topMoviesTemplate(peli, category){
    return(`
      <li class="myPlaylist-item" data-id="${peli.id}" data-category="${category}">
        <a href="#">
          <span>${peli.title}</span>
        </a>
      </li>
    `);
  }
  
  async function getData(url) {
    const response = await fetch(url);
    const data = await response.json();
    if(data.data.movie_count > 0){
      return data;
    }
    throw new Error('No se encontró ningún resultado');
  }

  const $form = document.getElementById('form');
  const $home = document.getElementById('home');
  const $featuringContainer = document.getElementById('featuring');

  function setAttributes($element, attributes){
    for (const attribute in attributes) {
      $element.setAttribute(attribute, attributes[attribute]);
    }
  }
  function featuringTemplate(peli){
    return(
      `
      <div class="featuring">
      <div class="featuring-img">
        <img src="${peli.medium_cover_image}" width="70" height="100" alt="">
          </div>
        <div class="featuring-content">
          <p class="featuring-title">pelicula encontrada</p>
          <p class="featuring-album">${peli.title}</p>
        </div>
      </div>
      `
    )
  }
  const BASE_API = 'https://yts.am/api/v2/'
  $form.addEventListener('submit', async (event) => {
    event.preventDefault();
    $home.classList.add('search-active');
    const $loader = document.createElement('img');
    setAttributes($loader, {
      src : 'src/images/loader.gif',
      height: 50,
      width: 50 
    });
    $featuringContainer.append($loader);
    const data =  new FormData($form);
    try{
      const {
        data: {
          movies: pelis
        }
      } = await getData(`${BASE_API}list_movies.json?limit=1&query_term=${data.get('name')}`)
      const HTMLString = featuringTemplate(pelis[0])
      $featuringContainer.innerHTML = HTMLString;
    } catch (error){
      alert(error.message);
      $loader.remove();
      $home.classList.remove('search-active');
    }
    
  });
  

  function videoItemTemplate(movie, category){
    return(
      `<div class="primaryPlayListItem" data-id="${movie.id}" data-category="${category}">
        <div class="primaryPlayListItem-image">
          <img src="${movie.medium_cover_image}" />
        </div>
        <h4 class="primaryPlaylistItem-title">
          ${movie.title}
        </h4>
      </div>`
    ) 
  }

  function createTemplate(HTMLString) {
    const html = document.implementation.createHTMLDocument();
    html.body.innerHTML = HTMLString;
    return html.body.children[0];
  }

  const $modal = document.getElementById('modal');
  const $overlay = document.getElementById('overlay');
  const $hideModal = document.getElementById('hide-modal');

  const $modalTitle = $modal.querySelector('h1');
  const $modalImage = $modal.querySelector('img');
  const $modalDescription = $modal.querySelector('p'); 

  function findById(list, id) {

    return list.find(movie => movie.id === parseInt(id, 10));
  }

  function findMovie(id, category) {
    switch (category) {
      case 'action': {
        return findById(actionList, id);
      }
      case 'drama': {
        return findById(dramaList, id);
      }
      case 'animation': {
        return findById(animationList, id);
      }
      default: {
        return findById(topTenList, id);
      }
    }
  }

  function showModal($element) {
    $overlay.classList.add('active');
    $modal.style.animation = 'modalIn .8s forwards';
    const id = $element.dataset.id;
    const category = $element.dataset.category;
    const data = findMovie(id, category);
    console.log($element.category);
    $modalTitle.textContent = data.title;
    $modalImage.setAttribute('src', data.medium_cover_image);
    $modalDescription.textContent = data.description_full;
  }
  
  function hideModal() {
    $overlay.classList.remove('active');
    $modal.style.animation = 'modalOut .8s forwards';
  }
  $hideModal.addEventListener('click', hideModal);

  function addEventClick($element){
    $element.addEventListener('click', () => {
      showModal($element);
    });
  }

  function renderMovieList(list, $container, category){
    // actionList.data.movies
    $container.children[0].remove();
    list.forEach((movie)=>{
      const HTMLString = videoItemTemplate(movie, category);
      const movieElement = createTemplate(HTMLString);
      $container.append(movieElement);
      const image = movieElement.querySelector('img');
      image.addEventListener('load', (event) => {
        event.srcElement.classList.add('fadeIn');
      });
      addEventClick(movieElement);
    });
  };
  function renderTopList(list, $container, category){
    $container.children[0].remove();
    list.forEach((movie)=>{
      const HTMLString = topMoviesTemplate(movie, category);
      const movieElement = createTemplate(HTMLString);
      $container.append(movieElement);
      addEventClick(movieElement);
    });
  };

  async function cacheExist(category){
    const listName = `${category}List`
    const cacheList = window.localStorage.getItem(listName)
    if(cacheList){
      return JSON.parse(cacheList);
    }
    const {data: {movies: data}} = await getData(`${BASE_API}list_movies.json?genre=${category}`);
    localStorage.setItem(listName, JSON.stringify(data));
    return data;
  }

  const {data: {movies: topTenList}} = await getData(`${BASE_API}list_movies.json?limit=10&sort_by=like_count`)
  $myTopTenContainer = document.querySelector('.myPlaylist');
  renderTopList(topTenList, $myTopTenContainer, 'top10');

  // const {data: {movies: actionList}} = await getData(`${BASE_API}list_movies.json?genre=action`)
  const actionList = await cacheExist('action')
  // localStorage.setItem('actionList', JSON.stringify(actionList));
  const $actionContainer = document.querySelector('#action');
  renderMovieList(actionList, $actionContainer, 'action');
  
  const dramaList = await cacheExist('drama')
  // localStorage.setItem('dramaList', JSON.stringify(dramaList));
  const $dramaContainer = document.getElementById('drama');
  renderMovieList(dramaList, $dramaContainer, 'drama');
  
  const animationList = await cacheExist('animation')
  // localStorage.setItem('animationList', JSON.stringify(animationList));
  const $animationContainer = document.getElementById('animation');
  renderMovieList(animationList, $animationContainer, 'animation');
  
})()
