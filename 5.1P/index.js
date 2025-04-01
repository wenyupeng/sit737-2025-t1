const express = require('express');

const app = express();

const port =3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.get('/', (req, res) => {
    res.status(200).send("hello world");
});

let flag = true;

app.get('/change-flag',(req,res)=>{
    flag =!flag;
    res.status(200).send(`flag ${flag} changed to ${!flag}`);
});

app.get('/health', (req, res) => {
    if(flag){
        res.status(200).send("Server is up and running");
    }else{
        res.status(500).send("Server is down");
    }
});

console.log("Server is starting");

app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
});