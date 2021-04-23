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

describe('Remove file name extension', () => {
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
        expect(parser.removeFileNameExtension.bind('test')).to.throw();
    });
});
