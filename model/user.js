const createPool = require('../config/database');

const pool = createPool();

// Function to create a new user
const createUser = async ({ firstname, lastname, email, password, status }) => {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO kalakendrauser (firstname, lastname, email, password, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [firstname, lastname, email, password, status];
    const res = await client.query(query, values);
    return res.rows[0];
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

// Function to get user by email
const getUserByEmail = async (email) => {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT * FROM kalakendrauser WHERE email = $1', [email]);
    return res.rows[0];
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

module.exports = {
  createUser,
  getUserByEmail,
};
