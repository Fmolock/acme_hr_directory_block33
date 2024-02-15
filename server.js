const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_hr_directory');

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
};

init();