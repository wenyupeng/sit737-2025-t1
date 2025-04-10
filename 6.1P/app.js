const express = require('express');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/datetime', (req, res) => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    res.status(200).send({ date: formattedDate });
});



app.listen(port, () => {
    console.log(`Server start at http://localhost:${port}`);
});

