const Handlebars = require('handlebars');


module.exports = {
    len: l => l.length,
    renderAuthors: l => l.join(' and '),
    renderEtAl: hasEtAl => hasEtAl ? ' et al.' : '',
};
