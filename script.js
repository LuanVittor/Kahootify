// GÊNEROS FUNCIONANDO
const genres = [
  "blues",
  "chill",
  "classical",
  "country",
  "funk",
  "holidays",
  "jazz",
  "latin",
  "metal",
  "party",
  "pop",
  "rock",
  "romance",
  "soul",
  "summer",
]

const CLIENT_ID = 'd3a1926665894c0eba61809861699489';
const CLIENT_SECRET = '0af3490fc1914e6fb60eba886a639901';
const BASE_URL = 'https://api.spotify.com/v1';
const startButton = document.getElementById('start-button');
startButton.addEventListener('click', startGame);
const frontPage = document.getElementById('front-page');
const gamePage = document.getElementById('game-page');
const answersDiv = document.querySelectorAll('.answer');
const audioTag = document.querySelector('audio source');
const genresContainer = document.querySelector('#genres-container');

let finalPoint = 0;

let token;

// Colocando evento nas Divs de respostas
// const gotSelected = (event) => {
// answersDiv.forEach((div) => div.classList.remove('selected-div'));
// event.target.classList.add('selected-div');
// }

// answersDiv.forEach((div) => div.addEventListener('click', gotSelected));

// funcao q pegao elemento que tiver a classe dada como parametro ou o mais proximo
function getElementOrClosest(event, className) {
  if (event.classList.contains(className)) {
    return event;
  }
  return event.closest(`.${className}`);
}

// funcao onde adiciono a classe select e remove dos antigos
function selectGenre({ target }) {
  const section = getElementOrClosest(target, 'genre');
  const removeClass = document.querySelector('.selected');
  removeClass.classList.remove('selected');
  section.classList.add('selected');
}

// Cabeçalho das opções para as chamadas da API
function getHeaders() {
  const headers = new Headers({
    'Authorization': `Bearer ${token}`,
  })
  return headers;
}

// Verifica seleção da página inicial para iniciar o jogo
function getOption() {
  const selectedGenre = document.querySelector('.selected').id;
  return selectedGenre;
}

// funcao que calcula os pontos de forma assincrona
const getPoints = async () => {
  let points = 3000;
  const interval = setInterval(() => {
    points -= Math.floor(Math.random() * 50) + 51;
    if (points <= 500 /* ou quando for feito a escolha da musica */) {
      points = 500;
      clearInterval(interval);
    }
  }, 1000);
  return points;
}

// funcao para somar pontos
function sumPoints(trueOrFalse) {
  if (trueOrFalse === true) {
    finalPoint += getPoints();
    return finalPoint;
  }
  return finalPoint;
}

// Token de acesso à API
async function getToken() {
  const idAndSecret = `${CLIENT_ID}:${CLIENT_SECRET}`;
  const authorizationHeader = `Basic ${btoa(idAndSecret)}`

  const headers = new Headers();
  headers.append('Content-Type', 'application/x-www-form-urlencoded')
  headers.append('Authorization', authorizationHeader)

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers,
  })

  const data = await response.json();

  token = data.access_token;

  return token;
}

// Pegar dados de cada gênero
async function getGenre(genre) {
  const headers = getHeaders();
  const response = await fetch(`${BASE_URL}/browse/categories/${genre}`, {
    headers
  });
  const data = await response.json();
  return data;
}

// Carrega os gêneros
async function loadGenres() {
  for (let i = 0; i < genres.length; i += 1) {
    const genre = await getGenre(genres[i]);
    const div = document.createElement('div');
    div.className = 'genre';
    if (i === 10) div.classList.add('selected');
    div.id = genre.id;
    div.addEventListener('click', selectGenre)
    const img = document.createElement('img');
    img.src = genre.icons[0].url;
    const p = document.createElement('p');
    p.innerHTML = genre.name;
    div.append(img);
    div.append(p);
    genresContainer.appendChild(div);
  }
}

// Pegando playlists do gênero selecionado
async function getGenrePlaylists(id) {
  const headers = getHeaders();
  const response = await fetch(`${BASE_URL}/browse/categories/${id}/playlists`, {
    headers
  });
  const data = await response.json();
  return data;
}

// Pegando as tracks de uma playlist
async function getPlaylistTracks(id) {
  const headers = getHeaders();

  const response = await fetch(`${BASE_URL}/playlists/${id}/tracks`, {
    headers
  });

  const data = await response.json();

  return data.items;
}

// GET https://api.spotify.com/v1/artists/{id}/related-artists
async function getRelatedArtist(id) {
  const headers = getHeaders();

  const response = await fetch(`${BASE_URL}/artists/${id}/related-artists`, {
    headers
  });

  const data = await response.json();

  return data.items;
}

// Pega o url do preview de cada track
async function getTrackUrl(trackId) {
  const headers = getHeaders();
  const response = await fetch(`${BASE_URL}/tracks/${trackId}`, {
    headers
  });
  const data = await response.json();
  return data.preview_url;
}

// Seleciona aleatoriamente uma playlist
function selectRandomPlaylist(list) {
  const randomNum = Math.floor(Math.random() * (list.length - 1)) + 1;
  return list[randomNum];
}

function buildQuestionObj(songId) {
  return {
    songURL: '',
    artist1: '',
    artist2: '',
    artist3: '',
    artist4: '',
  }
}

function buildGameQuestions(selectedSongs) {
  selectedSongs.forEach(song => {

  })
}

async function buildTrackList() {
  const genre = getOption();
  const list = await getGenrePlaylists(genre);
  const playlistSelectedID = selectRandomPlaylist(list.playlists.items).id;
  const songs = await getPlaylistTracks(playlistSelectedID);
  return songs;
}

// Seleciona as músicas aleatoriamente
async function selectRandomSongs(songs, number) {
  // Filtrando pq nem todas as músicas tem preview
  const filteredList = songs.filter(async song => await getTrackUrl(song.track.id));
  // Embaralha a lista
  const shuffledSongs = filteredList.sort(() => 0.5 - Math.random());
  // Retorna os primeiros NUMBER dessa lista 
  return shuffledSongs.slice(0, number);
}

// funcao que a inicia o jogo
async function startGame() {
  frontPage.style.display = 'none';
  gamePage.style.display = 'block';
  // aqui vai continuar chamando as funcoes para gerar a pagina do game de acordo com o genero musical selecionado
  const songsList = await buildTrackList();
  const selectedList = await selectRandomSongs(songsList, 20);
  const urlsList = [];
  const idsList = [];
  for (let i = 0; i < selectedList.length; i += 1) {
    const songUrl = await getTrackUrl(selectedList[i].track.id);
    if (!songUrl) continue;
    idsList.push(selectedList[i].track.id);
    urlsList.push(songUrl);
  };
  console.log(urlsList);
  console.log(idsList);
}



window.onload = async () => {
  getPoints()
  await getToken();
  await loadGenres();
}
