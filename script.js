// const fetch = require('node-fetch');

const button = document.querySelector('button');
const input = document.querySelector('input');
const audio = document.querySelector('audio');

const options = {
  "method": "GET",
  "headers": {
    "x-rapidapi-host": "shazam.p.rapidapi.com",
    "x-rapidapi-key": "389559da6dmsh68c34a55cff3f90p1f2601jsnc7eb48f3cbff"
  }
};

button.addEventListener('click', () => {
  const artist = input.value;
  fetch(`https://shazam.p.rapidapi.com/search?term=${artist}&locale=pt-BR&offset=0&limit=5`, options)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const trackNum = Math.floor(Math.random() * 4);
      const song = data.tracks.hits[trackNum].track.hub.actions[1].uri;
      console.log(song);
      audio.src = song;
    })
    .catch(err => {
      console.error(err);
    });
  });