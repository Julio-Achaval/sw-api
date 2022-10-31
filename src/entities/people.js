
import fetch from 'node-fetch';

export const getPeople = async (sortBy=undefined) => {

  let people = await getAllPagePeople();

  if (sortBy) people = sortPeopleBy(people, sortBy);

  return people;
}

const sortPeopleBy = (people, sortBy) => {
  try {
    console.log('sorting people by', sortBy);
    people.sort(function(a, b) {

      let aIsNumber = !isNaN(a[sortBy].replace(',', ''));
      let bIsNumber = !isNaN(b[sortBy].replace(',', ''));

      if (aIsNumber && bIsNumber) {
        return (parseFloat(a[sortBy].replace(',', ''))) - (parseFloat(b[sortBy].replace(',', '')));
      }

      if (!aIsNumber && !bIsNumber) {
        return (a[sortBy]) > (b[sortBy]) ? 1 : -1;
      }

      if (aIsNumber && !bIsNumber) {
        return -1;
      }

      if (!aIsNumber && bIsNumber) {
        return 1;
      }
    });
  } catch {
    return 1;
  }
  return people;
}

const getAllPagePeople = async () => {
  let people = [];
  let promisedPeople = [];
  console.log("Processing pages...");

  const firstPeoplePage = await getPeopleByPage(1);
  people.concat(firstPeoplePage.results);
  const count = parseInt(firstPeoplePage.count);
  const pages = count % 10 === 0 ? Math.trunc(count / 10) : Math.trunc(count / 10) + 1;

  for (let page = 2; page < pages + 1 ; page++) {
    promisedPeople.push(getPeopleByPage(page));
  }

  promisedPeople = await Promise.all(promisedPeople);

  promisedPeople.forEach(page => {
    people = people.concat(page.results);
  });

  console.log('Pages processed');

  return people;
}

const getPeopleByPage = async (page) => {
  console.log('Getting page', page);
  return fetch('https://swapi.dev/api/people/?page=' + page)
  .then((apiResponseJson) => apiResponseJson.json())
  .catch((err) => {
    console.log(err)
    throw new Error("Error found in getPeopleByPage, page", page)
  }); 
}

const getIdByUrl = (personUrl) => {
  let personId = personUrl.split("/")[5];
  return personId;
}

const getPersonById = async (personId) => {
  console.log('Getting person with id', personId);
  return fetch('https://swapi.dev/api/people/' + personId)
  .then((apiResponseJson) => apiResponseJson.json())
  .catch((err) => {
    console.log(err)
    throw new Error("Error found in getPersonById, id", personId)
  }); 
}

export const getPersonNameByUrl = async (personUrl) => {
  let personId = getIdByUrl(personUrl);
  const person = await getPersonById(personId);
  return person ? person.name : "unknown";
}

export default getPeople;