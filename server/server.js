const express = require("express");
const dotenv = require("dotenv");
const connectedDB = require("./db/dbConnection");
const cors = require("cors");
const userRouter = require("./routes/userRoutes")

const app = express();

app.use(express.json());
app.use(cors());
connectedDB();
dotenv.config();

//stitching routes
app.use('/ecomm/user',userRouter);

//setting up server
const port = process.env.SERVER_PORT;
app.listen( port , () => {
    console.log(`server started on port ${port}`);
});