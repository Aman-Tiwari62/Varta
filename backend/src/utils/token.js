import jwt from 'jsonwebtoken'
export const generateAccessToken = (user) => {
    return jwt.sign(
      {
        userId: user._id,
        username: user.username,
        type: "access",
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      type: "refresh",
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};
  