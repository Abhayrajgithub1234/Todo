import express from 'express'
import db from '../db.js'


const todoRouter = express.Router();

//fetch all the todos
todoRouter.get('/', (req, res)=>{
    const getTodos = db.prepare(`
        SELECT * FROM todo WHERE user_id = ?
    `);
    const todo = getTodos.all(req.userId);
    res.json(todo);
});

//add the new todos
todoRouter.post('/', (req, res)=>{
    const {task} = req.body;
    const insertTodo = db.prepare(`
        INSERT INTO todo(user_id, task) VALUES (?, ?)
    `);
    const result = insertTodo.run(req.userId, task);

    res.json({id: result.lastInsertRowid, task, completed: 0});
});

//Update a todo
todoRouter.put('/:id', (req, res)=>{
    const {completed} = req.body;
    const {id} = req.params;

    try {
        const updateTodo = db.prepare(`
            UPDATE todo SET completed = ? WHERE id = ?
        `);
        
        updateTodo.all(completed, id);
        res.json({
            message: "Todo Completed"
        });

    }catch(err) {
        res.status(404),send({message: "task not found"});
    }
});

//Delete the todo
todoRouter.delete('/:id', (req, res)=>{
    const {id} = req.params;
    const userId = req.userId;

    try {
        const deleteTodo = db.prepare(`
            DELETE FROM todo WHERE id = ? AND user_id = ?
        `);
        deleteTodo.run(id, userId);
        res.send({message: "deleted successfully"});
    }catch(err) {
        console.log(err.message);
        res.status(404).send({message: "task not found"});
    }
});



export default todoRouter;