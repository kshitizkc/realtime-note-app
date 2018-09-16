const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');
const socketIo = require('socket.io');

// Mock data
const notes = [
  {
    content: 'Note content 1'
  },
  {
    content: 'Note content 2'
  },
  {
    content: 'Note content 3'
  },
  {
    content: 'Note content 4'
  }
];

const port = process.env.port || 3000;

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.get('/note', (req, res) => {
  res.send(notes);
});

router.post('/note', (req, res) => {
  const io = req.app.get('io');
  const note = req.body;
  notes.push(note);
  io.emit('newNote', notes);
});

app.use('/api', router);

const server = http.createServer(app);
const io = socketIo(server);
app.set('io', io);

app.use(express.static(path.join(__dirname, 'dist')));

server.listen(port);
