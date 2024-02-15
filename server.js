const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_hr_directory');
const express = require('express');
const app = express();

app.get('/api/employees', async(req, res, next)=>{
    try{
       const SQL = `
            SELECT * 
            FROM employees
       `; 
       const response = await client.query(SQL);
       res.send(response.rows);
    }
    catch(ex){
        next(ex);
    }
});

app.get('/api/departments', async(req, res, next)=>{
    try{
       const SQL = `
            SELECT * 
            FROM departments
       `; 
       const response = await client.query(SQL);
       res.send(response.rows);
    }
    catch(ex){
        next(ex);
    }
});

const init = async ()=>{
    await client.connect();
    console.log('connected to database');
    let SQL = `
        DROP TABLE IF EXISTS employees;
        DROP TABLE IF EXISTS departments;
        CREATE TABLE departments(
            id SERIAL PRIMARY KEY,
            name VARCHAR(20)
        );
        CREATE TABLE employees(
            id SERIAL PRIMARY KEY,
            txt VARCHAR(200),
            ranking INTEGER DEFAULT 5,
            department_id INTEGER REFERENCES departments(id) NOT NULL
        );
    `;
    await client.query(SQL);
    console.log('tables created');
    SQL = `
        INSERT INTO departments(name) VALUES('shopping');
        INSERT INTO departments(name) VALUES('SQL');
        INSERT INTO departments(name) VALUES('express');
        INSERT INTO employees(txt, department_id) VALUES('write some queries', (
            SELECT id FROM departments WHERE name = 'SQL'
        ));
        INSERT INTO employees(txt, department_id) VALUES('create a foreign key', (
            SELECT id FROM departments WHERE name = 'SQL'
        ));
        INSERT INTO employees(txt, department_id) VALUES('understanding primary keys', (
            SELECT id FROM departments WHERE name = 'SQL'
        ));
    `;
    await client.query(SQL);
    console.log('data seeded');
    const port = process.env.PORT || 3000;
    app.listen(port, ()=> console.log(`listening on port ${port}`));
    
    console.log('some curl commands to test');
    console.log('curl localhost:8080/api/employees');
    console.log('curl localhost:8080/api/departments');
};

init();