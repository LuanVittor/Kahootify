const script = require('./kahootify/script.js')

jest.mock('../kahootify/script');

describe('1 - testando chamada na API -função getArtistId', () => {
    test('testando mock no fetch id', () => {
      fetch.mockImplementation(async () => {
        return{
          json: async () => {
            return{
              data: { album: { artists: [{ id:'ID_TEST'}] } }
            }
          }
        }
      })
      const id = script.getArtistId();
      expect(id).toBe('ID_TEST');
    })
});
describe('2 - testando o filter dentro do escopo -função buildQuestionObj',() => {
    fetch.mockImplementation(async () => {
        return{
            json: async () => {
            return{
                data: { artists: { artists: [{ id:'ID_TEST'}] } }
            }
            }
            }
          })
      })
    test(() =>{

    })
});

describe(' - testando o filter dentro do escopo -função selectRandomSongs',() => {
    test( () => {

    })
});