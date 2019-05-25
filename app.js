import express from 'express';
import cors from 'cors';
import { nodeInternals } from 'stack-utils';

const app = express();

app.use(cors());
app.use(express.json());

app.locals.notes = [
  { id: 1, title: 'test', task: [{name: 'task', id: 1, complete: false}]},
  { id: 2, title: 'test', task: [{name: 'task', id: 2, complete: false}]}
];

app.get('/api/v1/notes', (req, res) => {
  res.status(200).json(app.locals.notes)
});

app.get('/api/v1/notes/:id', (req, res) => {
  const { id } = req.params
  const note = app.locals.notes.find(note => note.id == id);
  if (!note) return res.status(404).json('Note not found');
  return res.status(200).json(note);
});

app.post('/api/v1/notes', (req, res) => {
  const { title, task } = req.body;
  if (!title || !task) return res.status(422).json('Please provide a title and task');
  const newNote = {
    id: Date.now(),
    ...req.body
  };
  app.locals.notes.push(newNote);
  res.status(201).json(newNote);
})

app.put('/api/v1/notes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, task } = req.body;
  if(!title || !task) return res.status(422).json('Please provide a title and task');
  const noteIndex = app.locals.notes.findIndex(note => note.id === id);
  if (noteIndex === -1) return res.status(404).json('Note not found');
  const updatedCard = { id, title, task}
  app.locals.notes.splice(noteIndex, 1, updatedCard);
  return res.sendStatus(204);
});


app.delete('/api/v1/notes/:id', (req, res) => {
  const { id } = req.params;
  const note = app.locals.findIndex(note => note.id == id);
  if(!note) res.status(404).json('Note does not exist');
  app.locals.notes.splice(note, 1);
  res.status(204);
})

export default app;
