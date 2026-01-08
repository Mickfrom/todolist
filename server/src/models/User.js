const db = require('../config/database');

class User {
  static async findByUsername(username) {
    try {
      const query = `SELECT * FROM users WHERE username = ? LIMIT 1`;
      const result = await db.query(query, [username]);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      throw new Error(`Error finding user by username: ${error.message}`);
    }
  }

  static async findByEmail(email) {
    try {
      const query = `SELECT * FROM users WHERE email = ? LIMIT 1`;
      const result = await db.query(query, [email]);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }

  static async findById(id) {
    try {
      const query = `SELECT * FROM users WHERE id = ? LIMIT 1`;
      const result = await db.query(query, [id]);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      throw new Error(`Error finding user by ID: ${error.message}`);
    }
  }

  static async create({ username, email, passwordHash }) {
    try {
      const query = `
        INSERT INTO users (username, email, password_hash, created_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      `;
      const result = await db.run(query, [username, email || null, passwordHash]);
      
      return {
        id: result.lastID,
        username,
        email
      };
    } catch (error) {
      // Catch SQLite constraint errors
      const errorMessage = error.message || error.toString();
      if (errorMessage && errorMessage.includes('UNIQUE constraint')) {
        if (errorMessage.includes('username')) {
          throw new Error('Username already exists');
        }
        if (errorMessage.includes('email')) {
          throw new Error('Email already exists');
        }
      }
      throw error;
    }
  }
}

module.exports = User;