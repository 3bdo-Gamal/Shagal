const jwt = require('jsonwebtoken');

function auth(requiredRoles = []) {
  return (req, res, next) => {
    console.log("🔍 Authorization Header:", req.headers.authorization);
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Not authorized, no token' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("🔑 Decoded JWT:", decoded);
      req.user = decoded;

      
      if (decoded.role === 'high') {
        return next();
      }

      
      if (requiredRoles.length > 0 && !requiredRoles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Forbidden: insufficient role' });
      }

      next();
    } catch (err) {
      console.error("❌ JWT error:", err.message);
      return res.status(401).json({ error: 'Token invalid or expired' });
    }
  };
}

module.exports = auth;


