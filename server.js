// get the client
const mysql = require('mysql2');
const inquirer = require('inquirer');
const db = require('./db/database.js');
require("dotenv").config();

//create connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.PASSWORD,
    database: 'employeedb'
});

//user prompts - INQUIRER
const loadPrompts = () => {
    inquirer.prompt(
        {
            type: "list",
            name: "choice",
            message: "What would you like to do today?",
            choices: [
                "view all departments",
                "view all roles",
                "view all employees",
                "add a department",
                "add a role",
                "add an employee",
                "update an employee role"
            ]
        }
    )
        .then(res => {
            switch (res.choice) {
                case "view all departments":
                    viewAllDepartments()
                    break;
                case "view all roles":
                    viewAllRoles()
                    break;
                case "view all employees":
                    viewAllEmployees()
                    break;
                case "add a department":
                    //function call (similar to employee)
                    break;
                case "add a role":
                    //function call
                    break;
                case "add an employee":
                    addAnEmployee()
                    break;
                case "update an employee role":
                    //function call
                    break;
                default:
                //quit function
                //maybe include console.log(error) and message to the user THEN QUIT
            }
        })
}

const viewAllDepartments = () => {
    connection.promise().query(`SELECT * FROM employees`)
        .then(([rows]) => {
            console.table(rows)
            loadPrompts();
        })
}

const viewAllRoles = () => {
    connection.promise().query(`SELECT * FROM employees`)
        .then(([rows]) => {
            console.table(rows)
            loadPrompts();
        })
}

const viewAllEmployees = () => {
    connection.promise().query(`SELECT * FROM employees`)
        .then(([rows]) => {
            console.table(rows)
            loadPrompts();
        })
}

const addAnEmployee = () => {
    connection.promise().query(`SELECT * FROM roles`)
    .then(([rows]) => {
        const rolesArr = rows.map(row => ({ name: row.title, value: row.id }))
        connection.promise().query(`SELECT * FROM employees`)
        .then(([rows]) => {
            const managerArr = rows.map(row => ({ name: row.firstName + ' ' + row.lastName, value: row.id }))
            inquirer.prompt([
                {
                    type: "input",
                    name: "firstName",
                    message: "What is your new employee's first name?"
                },
                {
                    type: "input",
                    name: "lastName",
                    message: "What is your new employee's last name?"
                },
                {
                    type: "list", 
                    name: "roleId",
                    message: "Please choose a role for  your new employee",
                    choices: rolesArr
                },
                {
                    type: "list", 
                    name: "managerId",
                    message: "Who is your new employee's manager?",
                    choices: [...managerArr, {name: "none", value: null}]
                }
            ])
            .then( res => {
                connection.promise().query(`INSERT INTO employees SET ?`, res)
            })
        });
    });
    
}

loadPrompts();