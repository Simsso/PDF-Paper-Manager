class Paper {
    constructor(fileName, authors, etAl, year, title, tags) {
        this.fileName = fileName;
        this.authors = authors;
        this.etAl = etAl;
        this.year = year;
        this.title = title;
        this.tags = tags;
    }
}

module.exports = {
    Paper,
};