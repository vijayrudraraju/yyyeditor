// lib/app.js
exports.shows = {
    author: function(doc,req) {
        var handlebars = require('handlebars');

        var context = {doc:JSON.stringify(doc),author:doc.author,articles:JSON.stringify(doc.articles),logo:doc.logo,id:JSON.stringify(doc._id)};
        var html = handlebars.templates['oneauthor.html'](context);

        return html;
    },
    article: function(doc,req) {
        var handlebars = require('handlebars');

        var context = {doc:JSON.stringify(doc),title:doc.title,author:doc.author,body:doc.body};
        var html = handlebars.templates['onearticle.html'](context);

        return html;
    },
    banner: function(doc,req) {
        var handlebars = require('handlebars');

        var context = {doc:JSON.stringify(doc),logo:doc.logo,id:JSON.stringify(doc._id)};
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
