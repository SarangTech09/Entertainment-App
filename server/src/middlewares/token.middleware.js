import jsonwebtoken from "jsonwebtoken";
import responseHandler from "../handlers/response.handler.js";
import userModel from "../models/user.model.js";

// Token Decode Function
const tokenDecode = (req) => {
  try {
    const bearerHeader = req.headers["authorization"];

    if (!bearerHeader) {
      console.error("Authorization header missing");
      return false;
    }

    const token = bearerHeader.split(" ")[1];
    if (!token) {
      console.error("Token missing from Authorization header");
      return false;
    }

    console.log("Extracted Token:", token); // Log the token

    // Verify Token
    const decoded = jsonwebtoken.verify(
      token,
      process.env.TOKEN_SECRET
    );
    console.log("Decoded Token:", decoded); // Log the decoded token
    return decoded;
  } catch (error) {
    console.error("Token decoding error:", error); // Log the token decoding error
    return false;
  }
};

// Authorization Middleware
const auth = async (req, res, next) => {
  const tokenDecoded = tokenDecode(req);

  if (!tokenDecoded) {
    console.error("Authorization failed: Invalid token or token missing");
    return responseHandler.unauthorize(res);
  }

  try {
    // Ensure token contains user data
    const user = await userModel.findById(tokenDecoded.data).select("_id");

    if (!user) {
      console.error("Authorization failed: User not found");
      return responseHandler.unauthorize(res);
    }

    req.user = user; // Attach user to request
    next();
  } catch (error) {
    console.error("Authorization error:", error);
    return responseHandler.serverError(res);
  }
};

export default { auth, tokenDecode };
