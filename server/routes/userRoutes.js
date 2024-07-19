const express = require("express");
const userController = require("../controller/userController");

const userRouter = express.Router();

userRouter.post( '/register' , userController.handleRegister)  // http://localhost:4000/ecomm/user/register

module.exports = userRouter;