const express = require('express');

const path = require('path');  //経路処理
const getJson=require('./public/getJson');

//const router=express.Router(); 沒有設置主app管理router所以暫時不能用

const app = express();



app.use(express.static(path.join(__dirname, 'public')));


app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
    
});

app.get('/test1', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/test1.html'));
    
});

app.get('/ex', (req, res) => {
    //res.sendFile(`${__dirname}/public/ex.html`);
    res.sendFile(path.join(__dirname, 'public/ex.html'));
});

app.get('/getJson',getJson.ControllergetAll);   //All Tags load
app.post('/insertJson',express.json(),getJson.ControllerSave);  //send=>insertJson(API)=>Json
app.post('/removeJson',express.json(),getJson.ControllerRemoveAll);  //send=>insertJson(API)=>Json //remove不需要了，只存最後的showcase狀態

app.get('/test', (req, res) => {
    res.sendFile(`${__dirname}/public/test.html`);
});

app.get('/crud', (req, res) => {
    //res.sendFile(`${__dirname}/public/crud.html`);
    res.sendFile(path.join(__dirname, 'public/crud.html'));
});
app.get('/crud2', (req, res) => {
    //res.sendFile(`${__dirname}/public/crud.html`);
    res.sendFile(path.join(__dirname, 'public/crud2.html'));
});

app.get('/tt', (req, res) => {
    res.sendFile(`${__dirname}/public/tt.html`);
});
app.get('/inputTag', (req, res) => {
    //res.sendFile(`${__dirname}/public/inputTag.html`);
    res.sendFile(path.join(__dirname, 'public/inputTag.html'));
});

app.get('/pointer', (req, res) => {
    //res.sendFile(`${__dirname}/public/pointer.html`);
    res.sendFile(path.join(__dirname, 'public/pointer.html'));
});

app.get('/hamabesan', (req, res) => {
    res.sendFile(`${__dirname}/public/senser.html`);
});

app.get('/bundle', (req, res) => {
    res.sendFile(`${__dirname}/public/index-bundle.html`);
});
//PositionTag
app.get('/PositionTag', (req, res) => {
    res.sendFile(`${__dirname}/public/PositionTag.html`);
});


app.listen(3000, () => {
    console.log('Application listening on port 3000!');
    console.log(__dirname);
});

