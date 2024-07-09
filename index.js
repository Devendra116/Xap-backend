const express = require('express')
require('dotenv').config()
const port = process.env.PORT || 5000;
const connectDB = require('./config/db')
const cors = require('cors');

const app = express()
app.use(express.json());

app.use(cors());
app.get('/', (req, res) => {
    res.json({
        message: "Welcome to Xap"
    })
})

app.use('/', require('./routes/base'))

app.listen(port, () =>
    connectDB()
        .then(() => console.log(`Server is up and running at http://localhost:${port}`))
        .catch(() =>
            console.log('Server is running , but database connection failed')
        )
);
