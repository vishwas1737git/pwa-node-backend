const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

exports.authorization = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: false,
        message: "Access denied. No token provided.",
      });
    }
  
    // Correctly extract token after "Bearer " prefix
    const token = authorizationHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(400).json({
        status: false,
        message: "Invalid token.",
      });
    }
  };
  
