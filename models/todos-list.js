const mongoose = require('mongoose');
const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    completed: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    }
});
const Todo = mongoose.model("Todo", todoSchema);
module.exports = Todo;