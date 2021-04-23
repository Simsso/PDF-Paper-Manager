const fileExtension = '.pdf'
const yearRegExp = /\s\(\d{4}\)\s/;
const tagsRegExp = /\[.*\]/
const etAlRegExp = /\set al\.$/;
const andAuthorSeparatorRegExp = /\sand\s/


module.exports = {
    paperFileName,
    removeFileNameExtension,
    parseYear,
    parseAuthors,
    parseTitle,
    parseTags,
}

function paperFileName(fileName) {
    const fileNameWithoutExtension = removeFileNameExtension(fileName);
    const year = parseYear(fileNameWithoutExtension);
    const [authorsString, titleAndTagsString] = fileNameWithoutExtension.split(yearRegExp);
    const tags = parseTags(titleAndTagsString);
    const title = parseTitle(titleAndTagsString);
    const { authors, hasEtAl } = parseAuthors(authorsString);

    return {'fileName': fileName, 'authors': authors, 'hasEtAl': hasEtAl, 'year': year, 'title': title, 'tags': tags};
}

function removeFileNameExtension(fileName) {
    if (!fileName.endsWith(fileExtension)) {
        throw new Error(`Paper title must end with '${fileExtension}', got ${fileName}`);
    }

    const fileNameWithoutExtension = fileName.slice(0, -fileExtension.length);
    return fileNameWithoutExtension;
}

function parseYear(fileNameWithoutExtension) {
    let yearString = fileNameWithoutExtension.match(yearRegExp)[0].trim();
    const year = parseInt(yearString.slice(1, -1), 10);
    return year;
}

function parseAuthors(authorsString) {
    const hasEtAl = authorsString.endsWith(' et al.');
    const authorsStringWithoutEtAl = authorsString.replace(etAlRegExp, '');
    const authors = authorsStringWithoutEtAl.split(andAuthorSeparatorRegExp);
    return { authors, hasEtAl };
}

function parseTitle(titleAndTagsString) {
    return titleAndTagsString.replace(tagsRegExp, '').trim();
}

function parseTags(titleAndTagsString) {
    const tagsMatch = titleAndTagsString.match(tagsRegExp);
    let tags = [];
    if (tagsMatch) {
        tags = tagsMatch[0].slice(1, -1).split(',');
        tags = tags.map(s => s.trim());
    }
    return tags;
}
