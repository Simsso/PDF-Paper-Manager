const fs = require('fs');

const parser = require('./parser');


async function getPaperList() {
    function tryParsing(paperFileName) {
        try {
            return parser.paperFileName(paperFileName);
        }
        catch (e) {
            console.info(`Could not parse the paper ${paperFileName}`);
            return paperFileName;
        }
    }

    return new Promise((resolve, reject) => {
        fs.readdir(process.env.PAPER_DIR, (err, files) => {
            if (err) return reject(err);
            const partiallyParsedFiles = files.filter(f => f.endsWith('.pdf')).map(tryParsing);

            // split into successful and unsuccessful parses
            const notParsed = partiallyParsedFiles.filter(x => typeof x === 'string');
            const parsed = partiallyParsedFiles.filter(x => typeof x === 'object');

            resolve([parsed, notParsed]);
        });
    });
}

module.exports = {getPaperList};