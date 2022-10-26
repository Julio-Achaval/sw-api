
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
  let page = 1;
  let pagedpeople;
  console.log("Processing pages...");
  do {
    pagedpeople = await getPeopleByPage(page);
    people = people.concat(pagedpeople.results);
    page++;
  } while (pagedpeople.next !== null);
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