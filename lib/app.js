// lib/app.js
exports.shows = {
    article: function(doc,req) {
        var handlebars = require('handlebars');

        var context = {body:doc.body};
        var html = handlebars.templates['article.html'](context);

        return html;
    }
};

exports.views = {
    authors: {
        map: function(doc) {
            if(doc.author && doc.logo && doc.articles) {
                emit(doc.author,doc.logo);
            }
        }
    }
};
