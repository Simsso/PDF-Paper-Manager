require('dotenv').config();
const fs = require('fs');

const parser = require('./parser');


const paperPath = process.env.PAPER_DIR;

async function getPaperList() {
    return new Promise((resolve, reject) => {
        fs.readdir(process.env.PAPER_DIR, (err, files) => {
            if (err) return reject(err);

            files = files.filter(f => f.endsWith('.pdf'))
            resolve(files);
        });
    });
}


(async () => {
    try {
        const paperList = await getPaperList();
        console.log(paperList);
        console.log(paperList.map(parser.paperFileName))
    } catch (e) {
        console.error("Failed");
        console.error(e);
        throw(e);
    }
})();