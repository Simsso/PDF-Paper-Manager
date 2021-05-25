const expect = require("chai").expect;

const tags = require('../src/tags');

describe('Tag merger', () => {
    it('Joins the sets of tags', () => {
        const parsedPapers = [
            {tags: new Set(['t1', 't2'])},
            {tags: new Set(['t1', 't2'])},
            {tags: new Set(['t3'])},
        ]
        const ts = tags.getTags(parsedPapers)
        expect(ts).to.eql(new Set(['t1', 't2', 't3']));
    });
});

describe('Tag counter', () => {
    it('Counts the tag occurrences', () => {
        const parsedPapers = [
            {tags: new Set(['t1', 't2'])},
            {tags: new Set(['t1', 't2'])},
            {tags: new Set(['t3'])},
        ]
        const cs = tags.getTagCounts(parsedPapers)
        expect(cs).to.eql({'t1': 2, 't2': 2, 't3': 1});
    });
    
    it('Treats tags on the paper-level as sets ', () => {
        const parsedPapers = [
            {tags: ['t1', 't1', 't1', 't2', 't2']},
            {tags: new Set(['t1', 't2'])},
            {tags: new Set(['t3'])},
        ]
        const cs = tags.getTagCounts(parsedPapers)
        expect(cs).to.eql({'t1': 2, 't2': 2, 't3': 1});
    }); 
});

describe('Tag sorting', () => {
    it('Sorts by occurrence count first', () => {
        const tagOccurrences = {'t1': 3, 't2': 4, 't3': 1};
        const sorted = tags.sortTagDict(tagOccurrences)
        expect(sorted).to.eql([['t2', 4], ['t1', 3], ['t3', 1]]);
    });

    it('Sorts alphabetically in case of count ties', () => {
        const tagOccurrences = {'t1': 3, 't5': 4, 't3': 1, 't4': 3, 't2': 4};
        const sorted = tags.sortTagDict(tagOccurrences)
        expect(sorted).to.eql([['t2', 4], ['t5', 4], ['t1', 3], ['t4', 3], ['t3', 1]]);
    })
});

describe('Filtering by tags', () => {
    it('Yields papers for which a tag matches', () => {
        const papers = [{tags: new Set(['t1'])}, {tags: new Set(['t2'])}];
        const filteredPapers = tags.filterPapersByTags(papers, ['t1']);
        expect(filteredPapers).to.eql([{tags: new Set(['t1'])}]);
    });
});