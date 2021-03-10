function paperFileName(fileName) {
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

    return {'fileName': fileName, 'authors': authors, 'hasEtAl': hasEtAl, 'year': year, 'title': title, 'tags': tags};
}

module.exports = {
    paperFileName
}