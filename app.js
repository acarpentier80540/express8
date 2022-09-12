require("dotenv").config();

const express = require("express");

const app = express();

app.use(express.json());
const port = process.env.APP_PORT ?? 5000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};
//import fichier
const movieHandlers = require("./movieHandlers");
const usersHandlers = require("./usersHandlers");

app.get("/", welcome);
const { hashPassword, verifyPassword, verifyToken } = require("./auth.js");

//public
app.post(
  "/api/login",
  usersHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);
app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

app.get("/api/users", usersHandlers.getUsers);
app.get("/api/users/:id", usersHandlers.getUsersById);

app.post("/api/users", hashPassword, usersHandlers.postUsers);

//protected
app.use(verifyToken)

app.post("/api/movies", verifyToken, verifyToken, movieHandlers.postMovie);
app.put("/api/movies/:id", verifyToken, movieHandlers.updateMovie);
app.delete("/api/movies/:id", verifyToken, movieHandlers.deleteMovie);
app.put("/api/users/:id", usersHandlers.updateUsers);
app.delete("/api/users/:id", usersHandlers.deleteUsers);

// const isItDwight = (req, res) => {
//   if (req.body.email === "dwight@theoffice.com" && req.body.password === "123456") {
//     res.send("Credentials are valid");
//   } else {
//     res.sendStatus(401);
//   }
// };

// app.post("/api/login", isItDwight);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
