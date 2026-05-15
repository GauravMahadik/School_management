const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

dotenv.config();

const schoolRoutes = require("./routes/schoolRoutes");

const app = express();

app.use(bodyParser.json());

app.use("/", schoolRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});