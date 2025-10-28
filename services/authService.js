// Authentication service

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// In production, use a strong secret key and store it in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'communication_assessment_secret_key';
const SALT_ROUNDS = 10;

class AuthService {
  constructor() {
    // In-memory user storage for demo purposes
    // In a real application, this would be a database
    this.users = new Map();
    
    // Create a default admin user for testing
    this.createDefaultUser();
  }
  
  // Create a default user for testing
  async createDefaultUser() {
    const hashedPassword = await bcrypt.hash('password123', SALT_ROUNDS);
    const user = new User('user1', 'testuser', 'test@example.com', hashedPassword);
    this.users.set(user.id, user);
    this.users.set(user.email, user); // Also index by email
  }

  // Register a new user
  async register(username, email, password) {
    // Check if user already exists
    if (this.users.has(email)) {
      throw new Error('User already exists with this email');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    
    // Create user
    const user = new User(`user_${Date.now()}`, username, email, hashedPassword);
    this.users.set(user.id, user);
    this.users.set(user.email, user); // Also index by email
    
    // Generate token
    const token = this.generateToken(user);
    
    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    };
  }

  // Login user
  async login(email, password) {
    // Find user by email
    const user = this.users.get(email);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Validate password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid password');
    }
    
    // Update last login
    user.updateLastLogin();
    
    // Generate token
    const token = this.generateToken(user);
    
    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    };
  }

  // Generate JWT token
  generateToken(user) {
    return jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        email: user.email 
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );
  }

  // Verify token
  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // Get user by ID
  getUserById(id) {
    return this.users.get(id);
  }

  // Get all users (for admin purposes)
  getAllUsers() {
    return Array.from(this.users.values()).filter(item => item instanceof User);
  }
}

module.exports = AuthService;