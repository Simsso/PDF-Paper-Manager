const envResult = require('dotenv').config();
if (envResult.error) throw envResult.error;

const express = require('express');
const handlebars = require('express-handlebars');

const io = require('./io');
const tags = require('./tags');


const app = express();
app.set('view engine', 'handlebars');

app.engine('handlebars', handlebars({
    layoutsDir: __dirname + '/../views/layouts',
    helpers: require('./handlebars-helpers')
}));

app.use(express.static(__dirname + '/../public'))
app.use('/pdf', express.static(process.env.PAPER_DIR))

app.get('/', async (req, res) => {
    const [parsedPapers, invalidPaperFileNames] = await io.getPaperList();
    const options = {
        layout: 'index',
        papers: parsedPapers,
        tagCounts: tags.getTagCountsSorted(parsedPapers),
        invalidPaperFileNames: invalidPaperFileNames,
    };

    res.render('main', options);
});

app.get('/papers', async (req, res) => {
    res.header("Content-Type",'application/json');
    return res.send(JSON.stringify(await io.getPaperList(), null, 4));
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
