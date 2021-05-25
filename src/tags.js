module.exports = {getTags, getTagCounts, sortTagDict, getTagCountsSorted, filterPapersByTags};

function getTags(parsedPapers) {
    const s = new Set();
    parsedPapers.forEach(p => p.tags.forEach(s.add, s));
    return s;
}

function getTagCounts(parsedPapers) {
    const ctr = {};
    const perPaperTags = parsedPapers.map(p => p.tags).map(i => new Set(i));
    perPaperTags.forEach(ts => ts.forEach(t => ctr[t] = (ctr[t] || 0) + 1));
    return ctr;
}

function sortTagDict(tagDict) {
    const items = Object.keys(tagDict).map(k => [k, tagDict[k]]);
    items.sort((a, b) => {
        const [c1, c2] = [a[1], b[1]];
        if (c1 !== c2) {
            // decision based on occurrence count
            return c2 - c1;
        }
        const [s1, s2] = [a[0], b[0]];
        return s1.localeCompare(s2);
    });
    return items;
}

function getTagCountsSorted(parsedPapers) {
    const sortedTagsWithCounts = sortTagDict(getTagCounts(parsedPapers));
    return sortedTagsWithCounts.map(tuple => {return {tag: tuple[0], count: tuple[1]}});
}

function filterPapersByTags(parsedPapers, tags) {
    function setIntersection(s1, s2) {
        return new Set([...s1].filter(x => s2.has(x)));
    }

    const tagSet = new Set(tags);
    return parsedPapers.filter(p => setIntersection(p.tags, tagSet).size > 0)
}
