import jwt from "jsonwebtoken"

export const generateToken = (userID, res) => {

  const token = jwt.sign({userID}, process.env.JWT_SECRET, {expiresIn:"7d"})

  // send back to client in cookies
  res.cookie("tokenJWT", token, {
    // maxAge in milliseconds
    maxAge: 7*24*3600*100,
    // prevent XSS attacks & cross-site scripting attacks
    httpOnly: true,
    // CSRF attacks, cross-site request forgery attacks
    sameSite: "strict",
    // run dev -> secure: false -> using http mode,
    // run build -> secure: true -> https mode
    secure: process.env.NODE_ENV !== "development"
  })

  return token; // token to be returned in cookies
}