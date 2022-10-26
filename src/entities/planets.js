
import fetch from 'node-fetch';
import  { getPersonNameByUrl } from './people.js';

const getPlanets = async () => {

  let planets = await getAllPagePlanets();

  let planetsWithResidentsByName = await replaceAllPlanetsResidentsWithNames(planets);

  return planetsWithResidentsByName;
}

const replaceAllPlanetsResidentsWithNames = async (planets) => {
  console.log('Changing residents url by name per planet...');
  let planetsWithResidentsByName = await Promise.all(Array.from(planets).map(async planet => {
    let residents = await getPlanetResidentsbyName(planet.residents);
    console.log('changing residents of', planet.name)
    return {...planet, residents: residents}
  }));
  console.log('All residents of all planets updated');
  return planetsWithResidentsByName;
}

const getPlanetResidentsbyName = async (residents) => {
  let residentsByName = await Promise.all(Array.from(residents).map(async resident => {
    let personName = await getPersonNameByUrl(resident);
    return personName;
  }));
  return residentsByName;
}

const getAllPagePlanets = async () => {

  let planets = [];
  let page = 1;
  let pagedplanets;
  console.log("Processing pages...");
    do {
      pagedplanets = await getPlanetsByPage(page);
      planets = planets.concat(pagedplanets.results);
      page++;
    } while (pagedplanets.next !== null);
  
    console.log('Pages processed');
  
    return planets;
  
}

const getPlanetsByPage = async (page) => {
  console.log('Getting page', page);
  return fetch('https://swapi.dev/api/planets/?page=' + page)
  .then((apiResponseJson) => apiResponseJson.json())
  .catch((err) => {
    console.log(err);
    throw new Error("Error found in getPlanetsByPage, page", page)
  });
}

export default getPlanets;