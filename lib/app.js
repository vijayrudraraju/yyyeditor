// lib/app.js
exports.shows = {
    textArticle: function (doc,req) {
        var handlebars = require('handlebars');

        var context = {title:doc.author,author:doc.author,text:doc.text};
        var html = handlebars.templates['textArticle.html'](context);

        return html;
    },
    imagesArticle: function (doc,req) {
        var handlebars = require('handlebars');

        var context = {title:doc.author,author:doc.author,text:doc.text};
        var html = handlebars.templates['imagesArticle.html'](context);

        return html;
    },
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
        //var context = {};
        var html = handlebars.templates['onebanner.html'](context);
        //var html = "yo";

        return html;
    }
};

exports.views = {
    makes: {
        map: function(doc) {
            emit(doc.make,null);
        }
    },
    all: {
        map: function(doc) {
            if (doc.collection) {
                emit(doc.collection, doc);
            }
        }
    },
    texts: {
        map: function(doc) {
            if (doc.collection == 'pages' && doc.text) {
                emit(doc.collection, doc);
            }
        }
    },
    images: {
        map: function(doc) {
            if (doc.collection == 'pages' && doc.images) {
                emit(doc.collection, doc);
            }
        }
    },
    files: {
        map: function(doc) {
            if(doc.creationtime && doc.logo) {
                emit(doc.creationtime,doc.logo);
            }
        }
    },
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

exports.rewrites = [
    {from:'/yyy/_design/edit/*',to:'*'},
    {from:'/yyy/*',to:'../../*'},
    {from:'',to:'index.html'},
    {from:'*',to:'*'}
];
