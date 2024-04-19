const express = require("express");
const article = require("./src/controller");
const cors = require("cors");

const app = express();
const port = 8000;

app.use(express.json());

// Apply CORS middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

app.use("/", article);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
