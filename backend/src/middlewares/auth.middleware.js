import jwt from "jsonwebtoken";

export const authenticateAccessToken = (req, res, next) => {
  try {
    // 1. Get Authorization header
    const authHeader = req.headers.authorization;

    // 2. Check if header exists
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Access token missing",
      });
    }

    // 3. Extract token from "Bearer <token>"
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format",
      });
    }

    // 4. Verify token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // 5. Attach user info to request object
    req.user = {
      userId: decoded.userId,
      username: decoded.username,
    };

    // 6. Proceed to next middleware / controller
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired access token",
    });
  }
};
