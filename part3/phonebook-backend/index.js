const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(express.json());

morgan.token("body", (req) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  } else {
    return " ";
  }
});

app.use(morgan(":method :url :status :response-time ms :body"));
app.use(cors());

const persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/info", (req, res) => {
  res.send(`<div>
                <p>Phonebook has info for ${persons.length} people</p>
                <p>${new Date()}</p>
            </div>`);
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.sendStatus(404);
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    persons.splice(person, 1);
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;
  const id = Math.floor(Math.random() * 1000000);

  if (!name) {
    return res.status(400).send({ error: "name required" });
  }

  if (!number) {
    return res.status(400).send({ error: "number required" });
  }

  if (persons.find((person) => person.name === name)) {
    return res.status(400).send({ error: "name must be unique" });
  }

  const person = { id, name, number };

  persons.push(person);
  return res.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
