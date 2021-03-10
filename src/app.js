require('dotenv').config();
const fs = require('fs');

const types = require('./types');
const Paper = types.Paper;


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

function parsePaperFileName(fileName) {
    const fileExtension = '.pdf'
    if (!fileName.endsWith(fileExtension)) {
        throw new Error(`Paper title must end with '${fileExtension}', got ${fileName}`);
    }

    // remove file extension
    const fileNameWithoutExtension = fileName.slice(0, -fileExtension.length);

    // parse year
    const yearRegExp = /\s\(\d{4}\)\s/;
    let yearString = fileNameWithoutExtension.match(yearRegExp)[0].trim();
    const year = parseInt(yearString.slice(1, -1), 10);

    const [authorsString, titleAndTagsString] = fileNameWithoutExtension.split(yearRegExp);

    // parse tags
    const tagsRegExp = /\[.*\]/
    const tagsMatch = titleAndTagsString.match(tagsRegExp);
    let tags = [];
    if (tagsMatch) {
        tags = tagsMatch[0].slice(1, -1).split(',');
        tags = tags.map(s => s.trim());
    }

    // parse title
    const title = titleAndTagsString.replace(tagsRegExp, '').trim();

    // parse authors
    const etAlRegExp = /\set al\.$/;
    const hasEtAl = authorsString.endsWith(' et al.');
    const authorsStringWithoutEtAl = authorsString.replace(etAlRegExp, '');
    const andAuthorSeparatorRegExp = /\sand\s/
    const authors = authorsStringWithoutEtAl.split(andAuthorSeparatorRegExp);

    return new Paper(fileName, authors, hasEtAl, year, title, tags);
}


(async () => {
    try {
        const paperList = await getPaperList();
        console.log(paperList);
        console.log(paperList.map(parsePaperFileName))
    } catch (e) {
        console.error("Failed");
        console.error(e);
        throw(e);
    }
})();