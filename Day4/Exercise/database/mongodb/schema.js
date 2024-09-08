const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    is_checked: {
        type: Boolean,
        default: false,
    }
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;