// Authentication middleware

const AuthService = require('../services/authService');

const authService = new AuthService();

const authenticate = (req, res, next) => {
  try {
    // Extract token from Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }
    
    // Verify token
    const decoded = authService.verifyToken(token);
    
    // Attach user info to request
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

module.exports = authenticate;