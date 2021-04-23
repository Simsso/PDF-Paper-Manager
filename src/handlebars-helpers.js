const Handlebars = require('handlebars');


module.exports = {
    len: l => l.length,
    renderAuthors: l => l.join(', '),
    renderEtAl: hasEtAl => hasEtAl ? ' et al.' : '',
};
