const express = require('express');
const path = require('path');

const app = express();

// parse application/json
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static('public'))
app.set('views', path.join(__dirname, 'public'))
app.set('view engine', 'ejs')

function getDayTime(){
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const day = date.getDay();
    const month = date.getMonth();
    const year = date.getFullYear();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayName = dayNames[day];
    const monthName = monthNames[month];
    const time = `${hours}:${minutes}:${seconds}`;
    return `${dayName}, ${monthName} ${day}, ${year} ${time}`;
}

app.get('/home', (req, res) => {
    console.log('request received');
    res.render('index',{
        dayTime: getDayTime(),
        realName: 'Yupeng Wen',
        preferName: 'Chris',
        studentId: 's224212855'
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});