const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 4000;

app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

class Todo {
    constructor(description, date) {
        this.id = Date.now().toString();
        this.description = description;
        this.date = date;
        this.is_checked = false;
    }
}

let todos = [];

app.get('/todos', (req, res) => {
    res.json(todos);
  });

app.post('/todos', (req, res) => {
    if(req.body.description && req.body.date){
        const todo = new Todo(req.body.description, req.body.date);
        todos.push(todo);
        res.status(201).json(todo);
    } else {
        res.status(400)
    }
    
});

app.put('/todos/:id', (req, res) => {
    const { id } = req.params;
    const data = req.body;
    let targeted_todo;

    for (let i=0; i<todos.length; i++) {
        if (id == todos[i].id) {
            targeted_todo = todos[i];
            targeted_todo.description = data.description;
            targeted_todo.date = data.date;
        }
    }
    res.json(targeted_todo);
});

app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;
    todos = todos.filter(u => u.id !== id);
    res.status(204).end();
});

app.patch('/todos/:id/toggle', (req, res) => {
    const { id } = req.params;
    let targeted_todo;
    for (let i=0; i<todos.length; i++) {
        if (id == todos[i].id) {
            targeted_todo = todos[i];
            targeted_todo.is_checked = true;
        }
    }
    res.json(targeted_todo)
})