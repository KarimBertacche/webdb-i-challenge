const express = require('express');
const server = express();

const db = require('./data/dbConfig.js');

function getAllBudgets() {
    return db('accounts');
}

function getBudgetById(id) {
    return db('accounts').where({ id });
}


server.use(express.json());

server.get('/accounts', async (req, res) => {
    try {
        const accounts = await getAllBudgets();

        res.status(200).json(accounts);
    } catch(error) {
        res.status(500).json({
            message: 'Server error while retrieving the accounts'
        });
    }
});

server.get('/accounts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const account = await getBudgetById(id);

        res.status(200).json(account);

    } catch(error) {
        res.status(500).json({
            message: 'Server error while retrieving the account'
        });
    }
});

// server.post('/budgets', async (req, res) => {
//     try {
//         const { }

//     } catch(error) {
//         res.status(500).json({
//             message: 'Server error while creating new budget'
//         });
//     }
// });


async function validateId(req, res, next) {
    try {
        const { id } = req.params;

        if(!NaN(parseInt(id))) {

            if(id) {
                
            } else {
    
            }

        } else {
            res.status(404).json({
                message: 'The id given is not a valid number'
            });
        }
    } catch(error) {
        res.status(500).json({
            message: 'Server error while validating the id'
        });
    }
} 

module.exports = server;