import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from  '../db.js';

const authRouter = express.Router();

authRouter.post('/register', (req, res)=>{
    const {username, password} = req.body;
    let hashedPassword = bcrypt.hashSync(password, 8);
    console.log(hashedPassword);

    try {

        const insertUser = db.prepare(`
            INSERT INTO user(username, password)
            VALUES(?, ?)
        `);

        const result = insertUser.run(username, hashedPassword);

        const defaultTodo = `Hello :) Add your first todo`;
        const insertTodo = db.prepare(`
            INSERT INTO todo(user_id, task)
            VALUES(?, ?)
        `);
        
        insertTodo.run(result.lastInsertRowid, defaultTodo);

        //create a token
        const token = jwt.sign({id: result.lastInsertRowid}, process.env.JWT_SECRET, {expiresIn: '24h'});
        res.json({token})

    }catch(err) {
        console.log(err.message);
        res.sendStatus(503);
    }
});

authRouter.post('/login', (req, res)=>{
    const {username, password} = req.body;
    //let hashedPassword = bcrypt.hashSync(password, 8);
    
    try {
        const getUser = db.prepare(`SELECT * FROM user WHERE username = ?`);
        const user = getUser.get(username);

        if(!user) {return res.status(404).send({message: 'couldnot find the user'});}

        const validPassword = bcrypt.compareSync(password, user.password);

        //when password is incorrect
        if(!validPassword) {
            return res.status(401).send({message: 'Invalid password'});
        }

        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '24h'});
        res.json({token});



    }catch(err) {
        console.log(err.message);
    }
});


export default authRouter;