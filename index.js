const express = require('express');
const article = require('./src/controller')

const app = express();
const port = 3000;

//app.use(bodyParser.json());
app.use(express.json())
app.use('/', article)

//Starting Server.
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});