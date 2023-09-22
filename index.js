const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')
const mysql = require('mysql')
const { v4: uuidv4 } = require('uuid');


const add = express()
add.use(cors())
add.use(bodyparser.json())
add.use(express.json())
add.use(bodyparser.urlencoded({ extended: true }))
add.use(express.static('public'))


let conn = mysql.createConnection({
    host: "localhost",
    port: "3000",
    user: "root",
    password: "Santhosh@12",
    database: "crud"

})

conn.connect(function (error) {
    if (error) {
        console.log(error)
    } else {
        console.log('db connected successfully')
    }
}) 
add.get('/select', (request, response) => {
    let getQuery = 'select * from users where isActive=1;'
    conn.query(getQuery, (error, result) => {
        if (error) {
            response.send(error);
        } else {
            response.send(result);
        }
    })
})

add.get('/selectone/:id', (request, response) => {
    let id = request.params.id;
    let getQuery = 'select * from users where id = ? and isActive;'
    conn.query(getQuery, [id], (error, result) => {
        if (error) {
            response.send(error);
        } else {
            response.send(result);
        }
    })
})

function generateUUID() {
    return uuidv4();
}

//create user data in db
    add.post('/create', (request, response) => {
        const user = {
            id: generateUUID(),
            created_by: generateUUID(),
            updated_by: generateUUID(),
            created_date: new Date(),
            updated_date: new Date(),
            isActive: 1,
            first_name: request.body.first_name,
            last_name: request.body.last_name,
            age: request.body.age,
            dob: request.body.dob,
            ph_no: request.body.ph_no,
            email: request.body.email,
            password: request.body.password
        };

        const insertQuery = 'INSERT INTO users SET ?';
        conn.query(insertQuery, user, (error, result) => {
            if (error) {
                response.send(error);
            } else {
                response.send('User added successfully');
            }
        });
    });

add.post('/update', (request, response) => {
    let { email, i_d } = request.body;
    let updateQuery = 'update users set email = ? where id = ?;'

    conn.query(updateQuery, [email, id], (error, result) => {
        if (error) {
            let val = { "status": "error" }
            response.send(error);

        } else {
            let val = { "status": "update success" }
            response.send(val);
        }
    })
})

add.delete('/delete/:id', (request, response) => {
    let { id } = request.params;
    let deleteQuery = 'delete from users where id = ?;'
    conn.query(deleteQuery, [id], (error, result) => {
        if (error) {
            let val = { "status": "error" }
            response.send(error);
        } else {
            let val = { "status": "users delete success" }
            response.send(result);
        }
    })
})


add.put('/update', (request, response) => {
    let { email, id } = request.body;
    let updateQuery = 'update users set is Active = 0 where id = ?;'

    conn.query(updateQuery, [id], (error, result) => {
        if (error) {
            let val = { "status": "error" }
            response.send(error);

        } else {
            let val = { "status": "deleted successfully" }
            response.send(val);
        }
    })
})
const port = process.env.PORT || 3000; // Use the port provided by the environment or default to 3000
add.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});