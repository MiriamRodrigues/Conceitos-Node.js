const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

//Rota GET: Lista todos os repositorios por titulo.
app.get("/repositories", (request, response) => {
  const { title } = request.query;

  const results = title
  ? repositories.filter(repositorie => repositorie.title.includes(title))
  : repositories;

  return response.json(results);
});

//Rota POST: Cria um novo repositorio com likes = 0.
app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repositorie = { id: uuid(), title, url, techs, likes: 0};

  repositories.push(repositorie);

  return response.json(repositorie);
});

//Rota PUT: Altera os dados (titulo, url, techs) do repositorio.
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const {title, url, techs} = request.body;
  
  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if (repositorieIndex < 0) {
    return response.status(400).json({ error: 'repositorie not found.'})
  }

  const repositorie = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositorieIndex].likes
  };

  repositories[repositorieIndex] = repositorie;

  return response.json(repositorie);
});

//Rota DELETE: Deleta os dados do repositorio de acordo com o id. 
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  
  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if (repositorieIndex < 0) {
    return response.status(400).json({ error: 'Repositorie not found.'})
  }

  repositories.splice(repositorieIndex, 1);

  return response.status(204).send();
});

//Rota POST: Ao acessar essa rota é adicionado 1 like ao repositorio de determinado id.
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  
  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if (repositorieIndex < 0) {
    return response.status(400).json({ error: 'repositorie not found.'})
  }

  repositories[repositorieIndex].likes =  repositories[repositorieIndex].likes + 1;
  const repositorie = { 
    likes: repositories[repositorieIndex].likes
  };
  return response.json(repositorie);
});

module.exports = app;
