const User = require('../models/User');
// const bcrypt = require('bcrypt'); // Would be required if npm install worked
// const jwt = require('jsonwebtoken'); // Would be required if npm install worked
const crypto = require('crypto'); // Using crypto for mock hashing and simple token

// Mocking bcrypt and jwt functionalities due to npm install issues
const bcrypt_mock = {
  async hash(password, saltRounds) {
    return new Promise((resolve) => {
      // Simple mock hash: just append salt and reverse (NOT SECURE FOR REAL USE)
      resolve(`${password}:${saltRounds}`.split('').reverse().join(''));
    });
  },
  async compare(password, hash) {
    return new Promise(async (resolve) => {
      const parts = hash.split('').reverse().join('').split(':');
      const originalPassword = parts.slice(0, -1).join(':');
      resolve(password === originalPassword);
    });
  }
};

const jwt_mock = {
  sign(payload, secret, options) {
    // Simple mock token: base64 encode payload (NOT SECURE FOR REAL USE)
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const pl = Buffer.from(JSON.stringify(payload)).toString('base64url');
    // Mock signature (not actually verifying)
    const sig = crypto.createHmac('sha256', secret).update(`${header}.${pl}`).digest('base64url');
    return `${header}.${pl}.${sig}`;
  }
};
// --- End Mocking ---

const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secure-secret-fallback'; // Fallback, should be in .env

const authController = {
  /**
   * Handles user registration.
   */
  async register(req, res) {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    // Validate email format (basic)
    if (!/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ message: 'Invalid email format.' });
    }

    // Validate password strength (basic example: min 8 chars)
    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    try {
      const existingUser = await User.findUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: 'Email already in use.' });
      }

      // const saltRounds = 10; // For bcrypt
      // const passwordHash = await bcrypt.hash(password, saltRounds); // Actual bcrypt
      const passwordHash = await bcrypt_mock.hash(password, 10); // Mock bcrypt

      const newUser = await User.createUser({
        name,
        email,
        passwordHash,
        phone,
      });

      // Exclude passwordHash from the response
      const { password_hash, ...userResponse } = newUser;
      res.status(201).json({ message: 'User registered successfully.', user: userResponse });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Internal server error during registration.' });
    }
  },

  /**
   * Handles user login.
   */
  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
      const user = await User.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials. User not found.' });
      }

      // const isMatch = await bcrypt.compare(password, user.password_hash); // Actual bcrypt
      const isMatch = await bcrypt_mock.compare(password, user.password_hash); // Mock bcrypt

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials. Password incorrect.' });
      }

      // User matched, create JWT
      const payload = {
        userId: user.id,
        role: user.role,
      };

      // const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Actual JWT
      const token = jwt_mock.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Mock JWT

      const { password_hash, ...userResponse } = user;

      res.status(200).json({
        message: 'Login successful.',
        token,
        user: userResponse
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error during login.' });
    }
  },
};

module.exports = authController;
