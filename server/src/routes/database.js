const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

/**
 * Get all tables in the database
 */
router.get('/tables', async (req, res) => {
  try {
    const tables = query(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
    );
    res.json({ tables: tables.map(t => t.name) });
  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).json({ error: 'Failed to fetch tables' });
  }
});

/**
 * Get all data from a specific table
 */
router.get('/tables/:tableName', async (req, res) => {
  try {
    const { tableName } = req.params;

    // Validate table name to prevent SQL injection
    const validTables = query(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    );

    const tableExists = validTables.some(t => t.name === tableName);

    if (!tableExists) {
      return res.status(404).json({ error: 'Table not found' });
    }

    // Get table schema
    const schema = query(`PRAGMA table_info(${tableName})`);

    // Get table data
    const data = query(`SELECT * FROM ${tableName}`);

    res.json({
      tableName,
      schema,
      data,
      rowCount: data.length
    });
  } catch (error) {
    console.error('Error fetching table data:', error);
    res.status(500).json({ error: 'Failed to fetch table data' });
  }
});

/**
 * Get database statistics
 */
router.get('/stats', async (req, res) => {
  try {
    const userCount = query('SELECT COUNT(*) as count FROM users')[0].count;
    const todoCount = query('SELECT COUNT(*) as count FROM todos')[0].count;
    const completedCount = query('SELECT COUNT(*) as count FROM todos WHERE completed = 1')[0].count;

    res.json({
      users: userCount,
      todos: todoCount,
      completedTodos: completedCount,
      pendingTodos: todoCount - completedCount
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;

