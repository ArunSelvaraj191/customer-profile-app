const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dontenv = require("dotenv");
const connectDB = require("./dbconnection");
const routes = require("./routes/index");

dontenv.config();
const PORT = process.env.PORT || 5001;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/api", routes);

connectDB();

app.listen(PORT, () => {
  console.log(`
  ################################################
  Server listening on port: ${PORT}
  ################################################
`);
});
