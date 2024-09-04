const express = require('express');
const bodyParser = require('body-parser');
const Todo = require('./Todo')
const app = express();
const PORT = 4000;

app.use(bodyParser.json());

let todos = [];

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const findAndUpdateTodo = (id, data) => {
    let targeted_todo;

    for (let i = 0; i < todos.length; i++) {
        if (id == todos[i].id) {
            targeted_todo = todos[i];
            targeted_todo.description = data.description;
            targeted_todo.date = data.date;
            return targeted_todo;
        }
    }

    return null;
};

const createNewTodo = (description, date) => {
    const todo = new Todo(description, date);
    todos.push(todo);
    return todo;
};

const getTodos = (req, res) => {
    res.json(todos);
};

const createTodo = (req, res) => {
    const { description, date } = req.body;

    if (description && date) {
        const todo = createNewTodo(description, date);
        res.status(201).json(todo);
    } else {
        res.status(400).send('Description and date are required');
    }
};

const updateTodo = (req, res) => {
    const { id } = req.params;
    const { description, date } = req.body;

    const dataToUpdate = {
        ...(description && { description }),
        ...(date && { date })
    };
    
    const updatedTodo = findAndUpdateTodo(id, dataToUpdate);
    
    if (updatedTodo) {
        res.json(updatedTodo);
    } else {
        res.status(404).send('Todo not found');
    }
};

const deleteTodo = (req, res) => {
    const { id } = req.params;
    const initialLength = todos.length;
    todos = todos.filter(u => u.id !== id);

    if (todos.length < initialLength) {
        res.status(204).end();
    } else {
        res.status(404).send('Todo not found');
    }
};

const toggleTodo = (req, res) => {
    const { id } = req.params;
    let targeted_todo;

    for (let i = 0; i < todos.length; i++) {
        if (id == todos[i].id) {
            targeted_todo = todos[i];
            targeted_todo.is_checked = !targeted_todo.is_checked;
            break;
        }
    }

    if (targeted_todo) {
        res.json(targeted_todo);
    } else {
        res.status(404).send('Todo not found');
    }
};

app.get('/todos', getTodos);
app.post('/todos', createTodo);
app.put('/todos/:id', updateTodo);
app.delete('/todos/:id', deleteTodo);
app.patch('/todos/:id/toggle', toggleTodo);
