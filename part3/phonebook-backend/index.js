const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();

app.use(express.static("build"));
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

app.get("/info", (req, res) => {
  Person.find({}).then((persons) => {
    res.send(`<div>
                <p>Phonebook has info for ${persons.length} people</p>
                <p>${new Date()}</p>
            </div>`);
  });
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => next(err));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.sendStatus(200))
    .catch((err) => next(err));
});

app.post("/api/persons", (req, res, next) => {
  const { name, number } = req.body;

  if (!name) {
    return res.status(400).send({ error: "name required" });
  }

  if (!number) {
    return res.status(400).send({ error: "number required" });
  }

  const person = new Person({
    name,
    number,
  });

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (req, res, next) => {
  const { name, number } = req.body;

  const person = {
    name,
    number,
  };

  Person.findByIdAndUpdate(req.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => res.json(updatedPerson))
    .catch((err) => next(err));
});

const errorHandler = (err, req, res, next) => {
  console.log(err.message);

  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformed id" });
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  next(err);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
