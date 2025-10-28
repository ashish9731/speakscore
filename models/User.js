// User model for authentication

class User {
  constructor(id, username, email, passwordHash) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.passwordHash = passwordHash;
    this.createdAt = new Date();
    this.lastLogin = null;
  }

  // Update last login time
  updateLastLogin() {
    this.lastLogin = new Date();
  }

  // Validate password (in a real app, this would use a proper hashing library)
  validatePassword(password, hash) {
    // This is a simplified implementation
    // In a real application, use bcrypt or similar
    return password === hash;
  }
}

module.exports = User;