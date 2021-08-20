const express = require('express');
const connectDB = require('./config/mongoConnect');
const app = express();

connectDB();
//Parse incoming json to object
//If not parsed, then request.body would be undefined
app.use(express.json());

app.use('/api/user', require('./routes/api/user'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is Listening on Port ${PORT}`));
