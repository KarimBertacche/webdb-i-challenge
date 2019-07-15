const express = require('express');
const server = express();

const db = require('./data/dbConfig.js');

function getAllAccounts() {
    return db('accounts');
}

function getAccountById(id) {
    return db('accounts').where({ id });
}

function insertNewAccount({ name, budget }) {
    return db('accounts').insert({ name, budget });
}

function updateAccount(id, { name, budget }) {
    return db('accounts').where({ id }).update({ name, budget });
}

function deleteAccount(id) {
    return db('accounts').where({ id }).del();
}


server.use(express.json());

server.get('/accounts', async (req, res) => {
    try {
        const accounts = await getAllAccounts();

        res.status(200).json(accounts);
    } catch(error) {
        res.status(500).json({
            message: 'Server error while retrieving the accounts'
        });
    }
});

server.get('/accounts/:id', validateId, async (req, res) => {
    res.status(200).json(req.accountId);
});

server.post('/accounts', async (req, res) => {
    try {
        const { name, budget } = req.body;
        
        if(req.body && Object.keys(req.body)) {
            const newAccountId = await insertNewAccount({ name, budget });
            const newAccount = await getAllAccounts(newAccountId);

            res.status(201).json(newAccount);
        } else {
            res.status(404).json({
                message: 'Name & budget are mandatory'
            });
        }

    } catch(error) {
        res.status(500).json({
            message: 'Server error while creating new account'
        });
    }
});

server.put('/accounts/:id', validateId, async (req, res) => {
    try {
        const { id } = req.params;
        
        if(req.body && Object.keys(req.body)) {
            const { name, budget } = req.body;
            const changedAccount = await updateAccount(id, { name, budget });

            res.status(200).json(changedAccount);
        } else {
            res.status(404).json({
                message: 'Name & budget are mandatory'
            });
        }
    } catch(error) {
        res.status(500).json({
            message: 'Server error while updated new account'
        });
    }
});

server.delete('/accounts/:id', validateId, async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await deleteAccount(id);

        if(deleted) {
            res.status(204).end();
        } else {
            res.status(404).json({
                message: 'Could not find the id'
            });
        }
    } catch(error) {
        res.status(500).json({
            message: 'Server error while deleting account'
        });
    }
});


async function validateId(req, res, next) {
    try {
        const { id } = req.params;
        const accountId = await getAccountById(id);

        if(!isNaN(parseInt(id))) {
            if(accountId) {
                req.accountId = accountId;
                next();            
            } else {
                res.status(404).json({
                    message: 'Account id not found'
                }); 
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