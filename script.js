// GÊNEROS FUNCIONANDO
const genres = [
  "blues",
  // "chill",
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
const genresContainer = document.querySelector('#genres-container');
const pointsViewer = document.getElementById('point-viewer');
const questionNumber = document.querySelector('.question-number');

const audioTag = document.querySelector('audio');
audioTag.volume = .1;
const answer1 = document.querySelector('#answer1');
const answer2 = document.querySelector('#answer2');
const answer3 = document.querySelector('#answer3');
const answer4 = document.querySelector('#answer4');
const answers = document.querySelectorAll('.answer');
let qNum = 0;
let questionsList;
let correctAnswer;
let points = 0;

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

function getAnswerDiv({ target }) {
  if (target.nodeName === 'DIV') {
    return target;
  }
  return target.closest(`div`);
}

// funcao onde adiciono a classe select e remove dos antigos
function selectGenre({ target }) {
  const section = getElementOrClosest(target, 'genre');
  const removeClass = document.querySelector('.selected');
  removeClass.classList.remove('selected');
  section.classList.add('selected');
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
    if (points <= 500) {
      points = 500;
      return points;
    } else if ( /*quando for feito a escolha da musica */ true) {
      return points;
    }
  }, 1000);
}
// continuacao para calcular de forma dinamica
// async function sumPoints(trueOrFalse) {
//   let finalPoint = 0
//   if (trueOrFalse === true) {
//     finalPoint += await getPoints();
//     return pointsViewer.innerHTML = finalPoint;
//   }
//   return pointsViewer.innerHTML = finalPoint;
// }

// funcao para somar pontos
function sumPoints(trueOrFalse) {
  let finalPoint = 0
  if (trueOrFalse === true) {
    finalPoint += 500;
    return pointsViewer.innerHTML = finalPoint;
  }
  return pointsViewer.innerHTML = finalPoint;
}

//#region  Acessos à API
// Cabeçalho das opções para as chamadas da API
function getHeaders() {
  const headers = new Headers({
    'Authorization': `Bearer ${token}`,
  })
  return headers;
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
  return data.artists;
}

// Pega o url do preview de cada track
async function getTrackUrl(trackId) {
  const headers = getHeaders();
  const response = await fetch(`${BASE_URL}/tracks/${trackId}`, {
    headers
  });
  const data = await response.json();
  return data.preview_url; //{ id: trackId, url: data.preview_url };
}

// Pega o Artista da track
async function getTrackArtistImg(trackId) {
  const headers = getHeaders();
  const response = await fetch(`${BASE_URL}/tracks/${trackId}`, {
    headers
  });
  const data = await response.json();
  return { name: data.album.artists[0].name, url: data.album.images[0].url };//retornando o nome junto com a imagem.
}

async function getArtistId(trackId) {
  const headers = getHeaders();
  const response = await fetch(`${BASE_URL}/tracks/${trackId}`, {
    headers
  });
  const data = await response.json();
  return data.album.artists[0].id;
}
//#endregion

// Seleciona aleatoriamente uma playlist
function selectRandomPlaylist(list) {
  const randomNum = Math.floor(Math.random() * (list.length - 1)) + 1;
  return list[randomNum];
}

// Carrega os gêneros na página inicial
async function loadGenres() {
  for (let i = 0; i < genres.length; i += 1) {
    const genre = await getGenre(genres[i]);
    const div = document.createElement('div');
    div.className = 'genre';
    if (i === 7
    ) div.classList.add('selected');
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

// https://api.spotify.com/v1/search?query=rock&type=playlist&offset=0&limit=50"

async function buildQuestionObj(url, id) {
  const artistId = await getArtistId(id);
  const relatedArtists = await getRelatedArtist(artistId);
  const fiteredRelArtists = relatedArtists.filter(artist => artist.name && artist.images.length !== 0);
  // console.log('Lista de artistas relacionados: ',relatedArtists);
  // console.log('Lista filtrada de artistas relacionados: ',fiteredRelArtists);
  const questionObj = {
    songURL: url,
    artist1: { ...await getTrackArtistImg(id), isRightAnswer: true },//indicador de resposta certa
    //retornando nome junto com imagem
    artist3: { name: fiteredRelArtists[1].name, url: fiteredRelArtists[1].images[0].url },
    artist4: { name: fiteredRelArtists[2].name, url: fiteredRelArtists[2].images[0].url },
    artist2: { name: fiteredRelArtists[3].name, url: fiteredRelArtists[3].images[0].url },
  }
  return questionObj;
}

async function buildGameQuestions(songs, ids) {
  const arrQuestionsObjs = [];
  for (let index = 0; index < songs.length; index++) {
    const obj = await buildQuestionObj(songs[index], ids[index]);
    arrQuestionsObjs.push(obj);
    if (arrQuestionsObjs.length === 5) break;
  }
  questionsList = arrQuestionsObjs;
  return arrQuestionsObjs;
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

// // Seleciona as músicas aleatoriamente
// async function selectRandomSongs(songs, number) {
//   // Transformando músicas em array de promessas
//   const filteredListPromises = songs.map(song => getTrackUrl(song.track.id));
//   // Resolvendo as promessas e Filtrando pq nem todas as músicas tem preview
//   const filteredList = (await Promise.all(filteredListPromises)).filter(song => song.url);
//   // Embaralha a lista
//   const shuffledSongs = filteredList.sort(() => 0.5 - Math.random());
//   // Retorna os primeiros NUMBER dessa lista 
//   return shuffledSongs.slice(0, number);
// }

function showAnswerAndLoadNext(answerName, answerDiv) {
  if (answerName === questionsList[qNum].artist1.name) {
    qNum += 1;
    answerDiv.style.border = '5px solid #00D18B';
    points += 200;
    pointsViewer.innerHTML = points;
    setTimeout(() => {
      loadQuestions(questionsList, qNum);
      answerDiv.style.border = '';
    }, 1500);
  } else {
    qNum += 1;
    answerDiv.style.border = '5px solid #CC0000';
    correctAnswer.style.border = '5px solid #00D18B';
    points -= 100;
    pointsViewer.innerHTML = points;
    setTimeout(() => {
      loadQuestions(questionsList, qNum);
      answerDiv.style.borderColor = '';
      correctAnswer.style.border = '';
    }, 1500);
  }
}

// Evento do click nas respostas
async function checkAnswers(event) {
  const answer = getAnswerDiv(event);
  answers.forEach(answer => {
    if (answer.querySelector('span').innerText === questionsList[qNum].artist1.name) {
      correctAnswer = answer;
    }
  });
  const answerName = answer.querySelector('span').innerText;
  showAnswerAndLoadNext(answerName, answer);
  
}

// Carrega música e imagens aleatoriamente
const loadQuestions = (questions, num) => {
  if (num === 5) {
    if (!alert(`Pontuação final: ${points}`)){
      window.location.reload();
    }
  };
  questionNumber.innerText = num + 1;
  audioTag.src = questions[num].songURL;
  const random = [1, 2, 3, 4].sort(() => 0.5 - Math.random());
  for (let i = 0; i < answers.length; i += 1) {
    const artist = questions[num][`artist${random[i]}`];
    answers[i].querySelector('img').src = artist.url;
    answers[i].querySelector('span').innerHTML = artist.name;//preenchendo o span com o nome
    answers[i].addEventListener('click', checkAnswers);
  }
  answers.forEach(answer => answer.classList.remove('selected-answer'));
}

// funcao que a inicia o jogo
async function startGame() {
  frontPage.style.display = 'none';
  gamePage.style.display = 'block';
  mkLoadpg()
  setTimeout(() => {
    let div = document.getElementById('load');
    div.remove()
  }, 2000);
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
  const questionsObjs = await buildGameQuestions(urlsList, idsList);
  loadQuestions(questionsObjs, qNum);
}

function mkLoadpg() {
  let div = document.getElementById('load');
  let loading = ['G', 'N', 'I', 'D', 'A', 'O', 'L']
  for (let i = 0; i < loading.length; i += 1) {
    let newDiv = document.createElement('div');
    newDiv.innerText = loading[i]
    div.appendChild(newDiv);
  }
}

window.onload = async () => {
  await getToken();
  await loadGenres();
}
