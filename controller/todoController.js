var data = [];
const Todo = require('../models/todos-list.js'); 
var bodyParser = require('body-parser');
var urlencoded = bodyParser.urlencoded({ extended:true });

module.exports = function(app) {
    app.get('/todo', async function(req, res) {
        const todos = await Todo.find();  // Fetch from MongoDB
        res.render('todo.ejs', { todos: todos });
    });

    app.post('/todo', urlencoded, async (req, res) => {
    try {
        const newTodo = await Todo.create({
            title: req.body.title,
            description: req.body.description,
            date: req.body.date,
            completed: req.body.completed || false // Default to false if not provided
        });
        data.push(newTodo);
        // Only one response:
        res.status(201).json(data);

    } catch (error) {
        console.error('Error creating todo:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


    
    app.put('/todo/:id', (req, res) => {
        const itemId = req.params.id.replace(/-/g, ' ');  // Undo hyphens to get original text
        const updatedItem = req.body.item;

        let itemFound = false;

        data = data.map(todo => {
            if (todo.title.toLocaleLowerCase() === itemId) {
                itemFound = true;
                return { title: updatedItem };
            }
            return todo;
        });

        if (itemFound) {
            res.json({ message: 'Item updated successfully', data });
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    });

    app.delete('/todo/:id', async function(req, res) {
        const id = req.params.id;

        try {
            const result = await Todo.findByIdAndDelete(id);
            if (!result) {
                return res.status(404).json({ message: 'Item not found' });
            }
            res.json({ message: 'Deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
}