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
      res.status(400).send('Error no notes');
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
      res.status(400).send('Error reading notes data');
      return;
    }
    const parsedNotes = JSON.parse(data);
    parsedNotes.push(newNote);
    fs.writeFile(notesDB, JSON.stringify(parsedNotes, null, 4), (writeErr) => {
      if (writeErr) {
        console.error(writeErr);
        res.status(400).send('Error writing new note');
        return;
      }
      const response = { status: 'success', body: newNote };
      res.status(201).json(response);
    });
  });
});


router.delete('/api/notes/:id', (req, res) => {
  const idToDelete = req.params.id;
  fs.readFile(notesDB, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(400).send('Error reading notes data');
      return;
    }
    const parsedNotes = JSON.parse(data);
    const updatedNotes = parsedNotes.filter(note => note.id !== idToDelete);
    if (parsedNotes.length === updatedNotes.length) {
      res.status(404).send(`Note with id ${idToDelete} not found`);
      return;
    }
    fs.writeFile(notesDB, JSON.stringify(updatedNotes, null, 4), (writeErr) => {
      if (writeErr) {
        console.error(writeErr);
        res.status(400).send('Error writing updated notes');
        return;
      }
      res.status(200).send(`Note with id ${idToDelete} deleted successfully`);
    });
  });
});

module.exports = router;
