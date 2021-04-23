const expect = require("chai").expect;

const parser = require('../src/parser');

describe('Paper title parser', () => {
    it('Parses paper titles', () => {
        const sampleFileName = 'Battaglia et al. (2018) Relational inductive biases, deep learning, and graph networks [Google].pdf';
        const paper = parser.paperFileName(sampleFileName);
        const expectedPaper = {'fileName': sampleFileName, 'authors': ['Battaglia'], 'hasEtAl': true, 'year': 2018, 'title': 'Relational inductive biases, deep learning, and graph networks', 'tags': ['Google']};
        expect(paper).to.eql(expectedPaper);
    });
});

describe('File name extension removal', () => {
    const inputTargetExamples = [
        ['test.pdf', 'test'],
        ['test.abc.pdf', 'test.abc'],
        ['test.pdf.pdf', 'test.pdf'],
    ]

    function testFn(inputAndTarget, index) {
        const [input, target] = inputAndTarget;
        it(`Removes ".pdf" from the end of files (case ${index})`, () => {
            const out = parser.removeFileNameExtension(input);
            expect(out).to.eql(target);
        });
    }
    inputTargetExamples.forEach(testFn);

    it('Rejects file names without ".pdf" ending', () => {
        expect(() => parser.removeFileNameExtension('test')).to.throw();
    });
});

describe('Tag parser', () => {
    const inputTargetExamples = [
        ['[abc,def]', ['abc', 'def']],
        ['title [abc,def]', ['abc', 'def']],
        ['title [ abc , def]', ['abc', 'def']],
    ]

    function testFn(inputAndTarget, index) {
        const [input, target] = inputAndTarget;
        it(`Parses a list of tags (case ${index})`, () => {
            const out = parser.parseTags(input);
            expect(out).to.eql(target);
        });
    }
    inputTargetExamples.forEach(testFn);

    it('Removes duplicate tages', () => {
        const out = parser.parseTags('Test [abc,abc,def]');
        expect(out).to.eql(['abc','def']);
    });

    it('Rejects titles with an opening square bracket but no tags (case 1)', () => {
        expect(() => parser.parseTags('Test [abc,abc,def]')).to.throw();
    });

    it('Rejects titles with an opening square bracket but no tags (case 2)', () => {
        expect(() => parser.parseTags('Test[')).to.throw();
    });
});