require('dotenv').config();
const fs = require('fs');
const express = require('express');
const handlebars = require('express-handlebars');

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


const app = express();
app.set('view engine', 'handlebars');

app.engine('handlebars', handlebars({
    layoutsDir: __dirname + '/../views/layouts',
    helpers: require('./handlebars-helpers')
}));

app.use(express.static(__dirname + '/../public'))

app.get('/', async (req, res) => {
    const [parsedPapers, invalidPaperFileNames] = await getPaperList();
    res.render('main', {layout: 'index', papers: parsedPapers, invalidPaperFileNames: invalidPaperFileNames});
});

app.get('/papers', async (req, res) => {
    res.header("Content-Type",'application/json');
    return res.send(JSON.stringify(await getPaperList(), null, 4));
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
