// lib/app.js
exports.shows = {
    article: function(doc,req) {
        var handlebars = require('handlebars');

        var context = {body:doc.body};
        var html = handlebars.templates['article.html'](context);

        return html;
    },
    banner: function(doc,req) {
        var handlebars = require('handlebars');

        var context = {logo:doc.logo};
        var html = handlebars.templates['onebanner.html'](context);

        return html;
    }
};

exports.views = {
    banners: {
        map: function(doc) {
            if(doc.creationtime && doc.logo) {
                emit(doc.creationtime,doc.logo);
            }
        }
    },
    authors: {
        map: function(doc) {
            if(doc.author && doc.logo && doc.articles) {
                emit(doc.author,doc.logo);
            }
        }
    }
};
