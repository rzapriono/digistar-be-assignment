const mongoose = require('mongoose');
const schema = require('./schema');

const Todos = mongoose.model('Todo', schema.todoSchema);

async function getTodo() {
    return Todos.find();
}

async function createTodo(todo) {
    return Todos.create(todo)
}

async function updateTodo(id, description, date) {
    return Todos.findByIdAndUpdate(id, {description, date}, { new: true, runValidators: true });
}

async function deleteTodo(id) {
    return Todos.findByIdAndDelete(id);
}

async function findByStatus(is_checked) {
    return Todos.find({ is_checked: is_checked });
}

async function findOneByTodoId(todoId) {
    return Todos.findOne({ _id: todoId });
}

const getTodosByUserId = async (userId) => {
    return await Todos.find({ userId });
};

module.exports = {
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo,
    findByStatus,
    findOneByTodoId,
    getTodosByUserId
}