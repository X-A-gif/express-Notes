const express = require('express');
const app = express();
const router = require('./routes');

const PORT = process.env.PORT || 3001;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', router);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
