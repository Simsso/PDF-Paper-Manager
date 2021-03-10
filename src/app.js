require('dotenv').config();
const fs = require('fs');
const express = require('express');

const parser = require('./parser');


async function getPaperList() {
    return new Promise((resolve, reject) => {
        fs.readdir(process.env.PAPER_DIR, (err, files) => {
            if (err) return reject(err);

            files = files.filter(f => f.endsWith('.pdf')).map(parser.paperFileName);
            resolve(files);
        });
    });
}


const app = express();
const port = process.env.PORT;

app.get('/papers', async (req, res) => {
    res.header("Content-Type",'application/json');
    return res.send(JSON.stringify(await getPaperList(), null, 4));
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
