let express = require('express');
let router = express.Router();
let { getDB } = require('./dbConnection.js');

let collectionPromise = null;
async function initCollection() {
    const db = getDB();
    collectionPromise = db.collection('9.1P');
    console.log('Collection initialized!');
    return collectionPromise;
}

function getCollection() {
    if (!collectionPromise) {
        collectionPromise = initCollection();
    }
    return collectionPromise;
}

router.post('/add', async (req, res) => {
    console.log('Adding document...');
    let content = {
        name: 'Chris Wen',
        unit: 'SIT737',
        studentID: 's224212855',
    };
    const collection = await getCollection();
    collection.insertOne(content, (err, result) => {
        if (err) {
            console.error('Error inserting document:', err);
            res.status(500).send('Error inserting document');
        } else {
            console.log('Document inserted:', result.insertedId);
            res.status(200).send('Document inserted successfully');
        }
    });
});

router.put('/update', async (req, res) => {
    console.log('Updating document...');
    let filter = { studentID: 's224212855' };
    let update = { $set: { name: 'Chris Wen', unit: 'SIT737', studentID: 's224212855' } };
    const collection = await getCollection();
    collection.updateOne(filter, update, (err, result) => {
        if (err) {
            console.error('Error updating document:', err);
            res.status(500).send('Error updating document');
        } else {
            console.log('Document updated:', result.modifiedCount);
            res.status(200).send('Document updated successfully');
        }
    });
});

router.delete('/delete', async (req, res) => {
    console.log('Deleting document...');
    let filter = { studentID: 's224212855' };
    const collection = await getCollection();
    collection.deleteOne(filter, (err, result) => {
        if (err) {
            console.error('Error deleting document:', err);
            res.status(500).send('Error deleting document');
        } else {
            console.log('Document deleted:', result.deletedCount);
            res.status(200).send('Document deleted successfully');
        }
    });
});

router.get('/get', async (req, res) => {
    console.log('Retrieving document...');
    let filter = { studentID: 's224212855' };
    const collection = await getCollection();
    collection.findOne(filter, (err, result) => {
        if (err) {
            console.error('Error retrieving document:', err);
            res.status(500).send('Error retrieving document');
        } else if (!result) {
            console.log('No document found');
            res.status(404).send('No document found');
        } else {
            console.log('Document retrieved:', result);
            res.status(200).json(result);
        }
    });
});



module.exports = router;