// const { Pool } = require('pg'); // Would be used if DB connection was live
// const bcrypt = require('bcrypt'); // For password hashing if done at model level

// Placeholder for database connection pool
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL, // Example: postgresql://user:password@host:port/database
// });

// --- In-memory store for demonstration purposes as DB is not connected ---
const users_db_mock = [];
let idCounter = 1;
// --- End of In-memory store ---

const User = {
  /**
   * Creates a new user.
   * In a real application, this would insert into the PostgreSQL 'users' table.
   * @param {object} userData - Contains name, email, passwordHash, phone
   * @returns {Promise<object>} The created user object (without passwordHash)
   */
  async createUser({ name, email, passwordHash, phone }) {
    // TODO: Replace with actual DB call
    // Example with pg:
    // const query = `
    //   INSERT INTO users (name, email, password_hash, phone)
    //   VALUES ($1, $2, $3, $4)
    //   RETURNING id, name, email, phone, role, is_verified, email_verified_at, created_at, updated_at;
    // `;
    // const values = [name, email, passwordHash, phone];
    // try {
    //   const result = await pool.query(query, values);
    //   return result.rows[0];
    // } catch (error) {
    //   console.error('Error creating user in DB:', error);
    //   throw error;
    // }

    // --- Mock Implementation ---
    return new Promise((resolve) => {
      const newUser = {
        id: `mock-${idCounter++}`, // In real DB, this would be a UUID
        name,
        email,
        password_hash: passwordHash, // Storing for mock login check
        phone: phone || null,
        role: 'customer',
        is_verified: false,
        email_verified_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      users_db_mock.push(newUser);
      // Return user data without the password hash for security
      const { password_hash, ...userWithoutPassword } = newUser;
      resolve(userWithoutPassword);
    });
    // --- End Mock Implementation ---
  },

  /**
   * Finds a user by their email address.
   * In a real application, this would query the PostgreSQL 'users' table.
   * @param {string} email - The email of the user to find.
   * @returns {Promise<object|null>} The user object if found, otherwise null.
   */
  async findUserByEmail(email) {
    // TODO: Replace with actual DB call
    // Example with pg:
    // const query = `
    //   SELECT id, name, email, password_hash, phone, role, is_verified, email_verified_at, created_at, updated_at
    //   FROM users
    //   WHERE email = $1;
    // `;
    // try {
    //   const result = await pool.query(query, [email]);
    //   return result.rows[0] || null;
    // } catch (error) {
    //   console.error('Error finding user by email in DB:', error);
    //   throw error;
    // }

    // --- Mock Implementation ---
    return new Promise((resolve) => {
      const user = users_db_mock.find(u => u.email === email);
      resolve(user || null);
    });
    // --- End Mock Implementation ---
  },

  /**
   * Finds a user by their ID.
   * @param {string} id - The ID of the user.
   * @returns {Promise<object|null>}
   */
  async findUserById(id) {
    // TODO: Replace with actual DB call
    // --- Mock Implementation ---
     return new Promise((resolve) => {
      const user = users_db_mock.find(u => u.id === id);
      if (!user) return resolve(null);
      const { password_hash, ...userWithoutPassword } = user;
      resolve(userWithoutPassword);
    });
    // --- End Mock Implementation ---
  }
};

module.exports = User;
