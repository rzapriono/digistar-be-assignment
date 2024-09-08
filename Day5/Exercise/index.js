const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./database/mongodb/db');
const userQuery = require('./database/mongodb/userQuery')
const todoQuery = require('./database/mongodb/todoQuery')
const jwt = require('jsonwebtoken');
const verifyToken = require('./middlewares/jwt');
const bcrypt = require('bcrypt')
const app = express();
const PORT = 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongodb.connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Route to GET all users - returns the users array as JSON
const getUsers = async (req,res) => {
    userQuery.getUsers().then((users) => {
      res.json(users);
    });
}
  
// Route to PUT (update) a user by id
const updateUser = async (req, res) => {
    const { id } = req.params; // Extract the id from the request parameters
    const user = req.body; // Extract the updated user from the request body
    userQuery.updateUser(id, user).then((user) => {
        res.status(200).json(user); // Respond with the updated user
    })
}

// Route to DELETE a user by id
const deleteUser = async (req, res) => {
    const { id } = req.params; // Extract the id from the request parameters
    userQuery.deleteUser(id).then(() => {
        res.status(204).send(); // Respond with no content and status code 204
    });
}

// Route to search users by name
const searchUserByName = async (req, res) => {
    const { name } = req.query; // Extract the name query parameter

    // Check if the name query parameter is provided
    if (!name) {
    return res.status(400).send({ message: "Name query parameter is required" });
    }
    userQuery.findByName(name).then((users) => {
    res.status(200).json(users); // Respond with the filtered users
    });    
}

// Route to login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const payload = { email, password };
        const token = await login(payload);
        res.status(200).json({ message: "Success login!", token });
    } catch (err) {
        res.status(400).json({ error: 'Internal Server Error', message: err.message });
    }
}

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    const newUser = {
        name,
        email,
        password
    };
    //check email first
    const checkUser = await userQuery.findOneByEmail(email);
        if (checkUser) {
            return res.status(400).json({ error: 'Failed to register', message: 'Email already exists' });
        }
            userQuery.createUser(newUser).then((user) => {
            // console.log(user)
            res.status(201).send(`Succesfully register ${newUser.email}!`);
            }).catch((error) => {
            res.status(400).json({ error: 'Internal Server Error', message: error.message });
            });
}

async function login(payload) {
    try {
        const checkUser = await userQuery.findOneByEmail(payload.email);
        if (!checkUser) {
        throw new Error('Invalid email or password');
        }
        const user = {
        userId: checkUser.id,
        email: checkUser.email,
        password: checkUser.password
        };
        const isValidPassword = bcrypt.compareSync(payload.password, user.password);
        if (!isValidPassword) {
        throw new Error('Invalid email or password');
        }

        const claims = {
        userId : user.userId,
        email: user.email
        }

        const key = process.env.JWT_SECRET || 'default_secret_key';
        const token = jwt.sign(claims, key, { expiresIn: '30m' });
        return token;
    } catch (error) {
        console.error('Error login: ', error);
        throw error;
    }
}

const getTodos = async (req, res) => {
    try {
        const userId = req.user.userId;
        const todos = await todoQuery.getTodosByUserId(userId);
        res.json(todos);
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

const createTodo = async (req, res) => {
    try {
        const { description, date } = req.body;
        const userId = req.user.userId;

        if (description && date) {
            const newTodo = { description, date, userId };
            todoQuery.createTodo(newTodo).then((newTodo) => {
                res.status(201).json(newTodo);
            })
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

        const updatedTodo = await todoQuery.updateTodo(
            id,
            description,
            date,
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
        const todo = await todoQuery.deleteTodo(id);

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
        const todo = await todoQuery.findOneByTodoId(id);

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

app.get('/todos', verifyToken, getTodos);
app.post('/todos', verifyToken, createTodo);
app.put('/todos/:id', verifyToken, updateTodo);
app.delete('/todos/:id', verifyToken, deleteTodo);
app.patch('/todos/:id/toggle', verifyToken, toggleTodo);

app.get('/users', getUsers)
app.get('/users/search', searchUserByName)
app.post('/user/register', registerUser)
app.post('/user/login', loginUser)
app.put('/users/:id', updateUser)
app.delete('/users/:id', deleteUser)