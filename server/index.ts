import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const dbPromise = open({
  filename: './database.sqlite',
  driver: sqlite3.Database
});

export async function initDb() {
  const db = await dbPromise;
  await db.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      phone TEXT,
      lead TEXT
    );
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      client TEXT,
      status TEXT,
      deadline TEXT,
      fee REAL
    );
  `);
  console.log('Database tables created successfully');
}

export function setupRoutes(app: express.Application) {
  // Existing clients route
  app.get('/api/clients', async (req, res) => {
    console.log('GET /api/clients request received')
    try {
      const db = await dbPromise;
      const clients = await db.all('SELECT * FROM clients');
      console.log('Clients fetched:', clients)
      res.json(clients);
    } catch (error) {
      console.error('Error fetching clients:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Add this new route for projects
  app.get('/api/projects', async (req, res) => {
    console.log('GET /api/projects request received')
    try {
      const db = await dbPromise;
      const projects = await db.all('SELECT * FROM projects');
      console.log('Projects fetched:', projects)
      res.json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Add POST route for clients
  app.post('/api/clients', async (req, res) => {
    try {
      const db = await dbPromise;
      const { name, email, phone, lead } = req.body;
      const result = await db.run(
        'INSERT INTO clients (name, email, phone, lead) VALUES (?, ?, ?, ?)',
        [name, email, phone, lead]
      );
      res.json({ id: result.lastID });
    } catch (error) {
      console.error('Error adding client:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Add POST route for projects
  app.post('/api/projects', async (req, res) => {
    try {
      const db = await dbPromise;
      const { name, client, status, deadline, fee } = req.body;
      const result = await db.run(
        'INSERT INTO projects (name, client, status, deadline, fee) VALUES (?, ?, ?, ?, ?)',
        [name, client, status, deadline, fee]
      );
      res.json({ id: result.lastID });
    } catch (error) {
      console.error('Error adding project:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Update DELETE route for clients
  app.delete('/api/clients/:id', async (req, res) => {
    console.log('DELETE /api/clients/:id request received', req.params);
    try {
      const db = await dbPromise;
      const { id } = req.params;
      const result = await db.run('DELETE FROM clients WHERE id = ?', id);
      console.log('Delete client result:', result);
      if (result && result.changes && result.changes > 0) {
        res.json({ message: 'Client deleted successfully' });
      } else {
        res.status(404).json({ error: 'Client not found' });
      }
    } catch (error) {
      console.error('Error deleting client:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Update DELETE route for projects
  app.delete('/api/projects/:id', async (req, res) => {
    console.log('DELETE /api/projects/:id request received', req.params);
    try {
      const db = await dbPromise;
      const { id } = req.params;
      const result = await db.run('DELETE FROM projects WHERE id = ?', id);
      console.log('Delete project result:', result);
      if (result && result.changes && result.changes > 0) {
        res.json({ message: 'Project deleted successfully' });
      } else {
        res.status(404).json({ error: 'Project not found' });
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Add other routes here (PUT, DELETE for clients and projects)
  app.put('/api/projects/:id', async (req, res) => {
    console.log('PUT /api/projects/:id request received', req.params, req.body);
    try {
      const db = await dbPromise;
      const { id } = req.params;
      const { name, client, status, deadline, fee } = req.body;
      const result = await db.run(
        'UPDATE projects SET name = ?, client = ?, status = ?, deadline = ?, fee = ? WHERE id = ?',
        [name, client, status, deadline, fee, id]
      );
      console.log('Update project result:', result);
      if (result && result.changes && result.changes > 0) {
        res.json({ message: 'Project updated successfully' });
      } else {
        res.status(404).json({ error: 'Project not found' });
      }
    } catch (error) {
      console.error('Error updating project:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}