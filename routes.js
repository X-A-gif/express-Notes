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

router.post('/api/notes', (req, res) => {
  const { title, text } = req.body;
  if (!title || !text) {
    res.status(400).send('Title and text are required');
    return;
  }
  const newNote = { title, text, id: uuidv4() };
  fs.readFile(notesDB, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading notes data');
      return;
    }
    const parsedNotes = JSON.parse(data);
    parsedNotes.push(newNote);
    fs.writeFile(notesDB, JSON.stringify(parsedNotes, null, 4), (writeErr) => {
      if (writeErr) {
        console.error(writeErr);
        res.status(500).send('Error writing new note');
        return;
      }
      const response = { status: 'success', body: newNote };
      res.status(201).json(response);
    });
  });
});

module.exports = router;
