const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./database/mongodb/db');
const Todo = require('./database/mongodb/schema');
const app = express();
const PORT = 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongodb.connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

const createTodo = async (req, res) => {
    try {
        const { description, date } = req.body;

        if (description && date) {
            const newTodo = new Todo({ description, date });
            await newTodo.save();
            res.status(201).json(newTodo);
        } else {
            res.status(400).send('Description and date are required');
        }
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

const updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { description, date } = req.body;

        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            { description, date },
            { new: true, runValidators: true }
        );

        if (updatedTodo) {
            res.json(updatedTodo);
        } else {
            res.status(404).send('Todo not found');
        }
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findByIdAndDelete(id);

        if (todo) {
            res.status(204).end();
        } else {
            res.status(404).send('Todo not found');
        }
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

const toggleTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findById(id);

        if (todo) {
            todo.is_checked = !todo.is_checked;
            await todo.save();
            res.json(todo);
        } else {
            res.status(404).send('Todo not found');
        }
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

app.get('/todos', getTodos);
app.post('/todos', createTodo);
app.put('/todos/:id', updateTodo);
app.delete('/todos/:id', deleteTodo);
app.patch('/todos/:id/toggle', toggleTodo);
