import express from "express";
const app = express();
import getPlanets from './src/entities/planets.js';
import getPeople from './src/entities/people.js';

app.get('/people', async function (req, res) {
  let sortBy = req.query.sortBy;
  console.log('[GET] People sorted by', sortBy);
  console.log("sortBy: ", sortBy);
  try {
    const people = await getPeople(sortBy);
    res.status(200).send(people);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/planets', async function (_req, res) {
  console.log('[GET] Planets with residents');
  try {
    const planets = await getPlanets();
    res.status(200).send(planets);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.listen(3000, () => {
  console.log("Available endpoints:");
  console.log("http://localhost:3000/planets");
  console.log("http://localhost:3000/people");
});
