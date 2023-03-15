const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const notesDB = path.join(__dirname, 'db', 'db.json');

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

router.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

router.get('/api/notes', (req, res) => {
  fs.readFile(notesDB, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(404).send('Error no notes');
      return;
    }
    const parsedNotes = JSON.parse(data);
    res.json(parsedNotes);
    console.log(parsedNotes)
  });
});

module.exports = router;

