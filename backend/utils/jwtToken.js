export const sendToken = (user, message, statusCode, res) => {
  const token = user.getJWT();
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000 // Corrected Date.now() function call
    ),
    httpOnly: true,
  };
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
    message,
  });
};
