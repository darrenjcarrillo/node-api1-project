// implement your API here

// import express from 'express';
const express = require("express");

const db = require("./data/db");

const server = express();

server.use(express.json());

// request/route handlers

// Get to /user that returns a list of user
server.get("/user", (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      console.log("error", err);
      res.status(500).json({ error: "failed to get users from db" });
    });
});

//When the client makes a `POST` request to `/api/users`:

// If the request body is missing the `name` or `bio` property
// POST
server.post("/api/users", (req, res) => {
  const user = req.body;
  console.log(`user info`, user);

  if (!user.name || !user.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user" });
  } else {
    // If the information about the _user_ is valid:
    db.insert(user)
      .then(user => {
        res.status(201).json({ user });
      })
      .catch(err => {
        console.log(`error`, err);
        res.status(500).json({
          error: `There was an error while saving the user to the database`
        });
      });
  }
});

// GET GET GET
server.get(`/api/users`, (req, res, err) => {
  const users = req.body;
  console.log(`list of user`, users);
  db.find()
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).json({
        error: "The users information could not be retrieved."
      });
    });
});

server.get(`/api/users/:id`, (req, res) => {
  // const { id } = req.params;

  db.findById(req.body.id)
    .then(user => {
      console.log(`this is user`, req);

      if (!!user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({
          message: "The user with the specified ID does not exist."
        });
      }
    })
    .catch(err => {
      console.log(`error`, err);
      res
        .status(500)
        .json({ error: "The user information could not be retrieved." });
    });
});

// DELETE DELETE DELETE
server.delete(`/api/users/:id`, (req, res) => {
  // const id = req.params.id;

  db.remove(req.body.id)
    .then(count => {
      console.log(`delete user`, count);
      if (count === 0) {
        res.status(404).json({
          message: "The user with the specified ID does not exist."
        });
      } else {
        res.status(200).json({ message: `user with id deleted`, count });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The user could not be removed" });
    });
});

// PUT PUT PUT

server.put(`/api/users/:id`, (req, res) => {
  db.update(req.body.id, req.body)
    .then(updates => {
      console.log(`update user`, updates);
      if (updates === 0) {
        res.status(404).json({
          message: "The user with the specified ID does not exist."
        });
      } else if (!!updates.body || !!updates.bio) {
        res.status(400).json({
          errorMessage: "Please provide name and bio for the user."
        });
      } else {
        res.status(200).json({ message: `user with id updated`, updates });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The user could not be updated" });
    });
});

// listen for request in a particular port on localhost
const port = 8000;
server.listen(port, () => console.log("API on port 8000"));
