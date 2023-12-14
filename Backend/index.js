const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Charchit@1995',
  database: " ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Charchit@1995'",
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to the database');
  }
});

// Create table if not exists
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT
  )
`;

db.query(createTableQuery, (err) => {
  if (err) {
    console.error('Error creating table:', err);
  }
});

app.get('/api/notes', (req, res) => {
  const getAllNotesQuery = 'SELECT * FROM notes';

  db.query(getAllNotesQuery, (err, results) => {
    if (err) {
      console.error('Error fetching notes:', err);
      res.status(500).send('Error fetching notes');
    } else {
      res.json(results);
    }
  });
});

app.post('/api/notes', (req, res) => {
  const { content } = req.body;
  const insertNoteQuery = 'INSERT INTO notes (content) VALUES (?)';

  db.query(insertNoteQuery, [content], (err, result) => {
    if (err) {
      console.error('Error inserting note:', err);
      res.status(500).send('Error inserting note');
    } else {
      res.json({ id: result.insertId, content });
    }
  });
});

app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  const deleteNoteQuery = 'DELETE FROM notes WHERE id = ?';

  db.query(deleteNoteQuery, [id], (err) => {
    if (err) {
      console.error('Error deleting note:', err);
      res.status(500).send('Error deleting note');
    } else {
      res.send('Note deleted successfully');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
