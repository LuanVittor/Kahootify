const CLIENT_ID = 'd3a1926665894c0eba61809861699489';
const CLIENT_SECRET = '0af3490fc1914e6fb60eba886a639901';
const BASE_URL = 'https://api.spotify.com/v1';
const startButton = document.getElementById('start-button');
startButton.addEventListener('click', startGame);
const frontPage = document.getElementById('front-page');
const allCard = document.querySelectorAll('.genre')
let finalPoint = 0;

let token;

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

// Seleciona aleatoriamente uma playlist
function selectRandomPlaylist(list) {
  const randomNum = Math.floor(Math.random() * (list.length - 1)) + 1;
  return list[randomNum];
}

// Embaralha e seleciona as primeiras músicas
function selectRandomSongs(songs, number) {
  const shuffledSongs = songs.sort(() => 0.5 - Math.random());
  return shuffledSongs.slice(0, number);
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

async function getGenrePlaylists(id) {
  const headers = getHeaders();

  const response = await fetch(`${BASE_URL}/browse/categories/${id}/playlists`, {
    headers
  });

  const data = await response.json();
  return data;
}

async function getPlaylistTracks(id) {
  const headers = getHeaders();

  const response = await fetch(`${BASE_URL}/playlists/${id}/tracks`, {
    headers
  });

  const data = await response.json();

  return data.items;
}

// GET https://api.spotify.com/v1/artists/{id}/related-artists

// funcao que a inicia o jogo
async function startGame() {
  frontPage.style.display = 'none'
  // aqui vai continuar chamando as funcoes para gerar a pagina do game de acordo com o genero musical selecionado
  const genre = getOption();
  const list = await getGenrePlaylists(genre);
  const playlistSelectedID = selectRandomPlaylist(list.playlists.items).id;
  const songs = await getPlaylistTracks(playlistSelectedID);
  console.log(selectRandomSongs(songs, 5));
}

window.onload = async () => {
  getPoints()
  try {
    await getToken();
    startGame();
  } catch (error) {
    console.log(error)
  }
}

const genres = [
  "acoustic",
  "afrobeat",
  "alt-rock",
  "alternative",
  "ambient",
  "anime",
  "black-metal",
  "bluegrass",
  "blues",
  "bossanova",
  "brazil",
  "breakbeat",
  "british",
  "cantopop",
  "chicago-house",
  "children",
  "chill",
  "classical",
  "club",
  "comedy",
  "country",
  "dance",
  "dancehall",
  "death-metal",
  "deep-house",
  "detroit-techno",
  "disco",
  "disney",
  "drum-and-bass",
  "dub",
  "dubstep",
  "edm",
  "electro",
  "electronic",
  "emo",
  "folk",
  "forro",
  "french",
  "funk",
  "garage",
  "german",
  "gospel",
  "goth",
  "grindcore",
  "groove",
  "grunge",
  "guitar",
  "happy",
  "hard-rock",
  "hardcore",
  "hardstyle",
  "heavy-metal",
  "hip-hop",
  "holidays",
  "honky-tonk",
  "house",
  "idm",
  "indian",
  "indie",
  "indie-pop",
  "industrial",
  "iranian",
  "j-dance",
  "j-idol",
  "j-pop",
  "j-rock",
  "jazz",
  "k-pop",
  "kids",
  "latin",
  "latino",
  "malay",
  "mandopop",
  "metal",
  "metal-misc",
  "metalcore",
  "minimal-techno",
  "movies",
  "mpb",
  "new-age",
  "new-release",
  "opera",
  "pagode",
  "party",
  "philippines-opm",
  "piano",
  "pop",
  "pop-film",
  "post-dubstep",
  "power-pop",
  "progressive-house",
  "psych-rock",
  "punk",
  "punk-rock",
  "r-n-b",
  "rainy-day",
  "reggae",
  "reggaeton",
  "road-trip",
  "rock",
  "rock-n-roll",
  "rockabilly",
  "romance",
  "sad",
  "salsa",
  "samba",
  "sertanejo",
  "show-tunes",
  "singer-songwriter",
  "ska",
  "sleep",
  "songwriter",
  "soul",
  "soundtracks",
  "spanish",
  "study",
  "summer",
]
