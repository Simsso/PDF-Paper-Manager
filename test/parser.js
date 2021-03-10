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