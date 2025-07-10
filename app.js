const express = require('express');
const mongoose = require('mongoose');
//const Todo = require('./models/todos-list.js'); 
var todo = require('./controller/todoController');
var app = express();

app.set('view-engine', 'ejs');
app.use(express.static('./public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect("mongodb+srv://zst0rm:%40viral_6612@backenddb.fzeeabl.mongodb.net/To-do-API?retryWrites=true&w=majority&appName=BackendDB")
.then(() => {
    console.log('Connected to MongoDB');
    todo(app);
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
});


