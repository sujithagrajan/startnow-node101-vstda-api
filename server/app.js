const express = require('express');
const morgan = require('morgan');
const app = express();
const bodyParser = require("body-parser");
const data = [
    {
        "todoItemId": 0,
        "name": "an item",
        "priority": 3,
        "completed": false
    },
    {
        "todoItemId": 1,
        "name": "another item",
        "priority": 2,
        "completed": false
    },
    {
        "todoItemId": 2,
        "name": "a done item",
        "priority": 1,
        "completed": true
    }
];

//middleware
app.use(morgan("tiny"));
app.use(bodyParser.json());

//Default
app.get("/", (req, res) => {
    res.status(200).json({
        status: 'ok'
    });
});

//GET all TODO items
app.get("/api/TodoItems/", (req, res) => {
    res.status(200).json(data);
});

//GET a single TODO item
app.get("/api/TodoItems/:number", (req, res) => {
    let resObj = {};
    if(req.params.number < data.length){
        for(let index in data){
            if(data[index].todoItemId == req.params.number){
                resObj = data[index];
            }
        }
    }
    res.status(200).json(resObj);
});

//POST a TODO item
app.post("/api/ToDoItems/", (req, res) => {
    isToDoNew = true;
    for (let objIndex in data) {
        if (data[objIndex].todoItemId == req.body.todoItemId) {
            data[objIndex] = req.body;
            res.status(201).send(data[objIndex]);
            isToDoNew = !isToDoNew;
        }
    }
    if (isToDoNew) {
        data.push(req.body);
        res.status(201).json(req.body);
    }
});

//DELETE a TODO item
app.delete("/api/TodoItems/:number", (req, res) => {
    res.send(data[req.params.number]);
    data.splice(req.params.number, 1);
});

//PUT a TODO item
app.put("/api/TodoItems/:number", (req, res) => {
    res.send(req.body);
    data.splice(req.params.number, 1, req.body);
});

//PATCH a TODO item
app.patch("/api/TodoItems/:id/:prop/:val", (req, res) => {
    if (req.params.id < data.length && data[req.params.id].hasOwnProperty(req.params.prop)) {
        data[req.params.id][req.params.prop] = req.params.val;
        res.send(data[req.params.id]);
    } else {
        //handle invalid patch request
        res.send("Invalid PATCH request...try again!");
    }
})
module.exports = app;