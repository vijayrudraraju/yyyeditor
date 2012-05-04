// lib/app.js
exports.shows = {
    textArticle: function (doc,req) {
        var templates = require('duality/templates');

        var context = {title:doc.title,author:doc.author,text:doc.text};
        var content = templates.render('textArticle.html',req,context);
        var html = templates.render('base.html',req,{content:content,title:doc.title,author:doc.author});

        return html;
    },
    imagesArticle: function (doc,req) {
        var templates = require('duality/templates');

        var context = {id:doc._id,title:doc.title,author:doc.author,filenames:doc.filenames,dbname:req.info.db_name};
        var content = templates.render('imagesArticle.html',req,context);
        var html = templates.render('base.html',req,{content:content,title:doc.title,author:doc.author});

        return html;
    },
    videosArticle: function (doc,req) {
        var templates = require('duality/templates');

        var context = {id:doc._id,title:doc.title,author:doc.author,videos:doc.videos,dbname:req.info.db_name};
        var content = templates.render('videosArticle.html',req,context);
        var html = templates.render('base.html',req,{content:content,title:doc.title,author:doc.author});

        return html;
    },
    musicArticle: function (doc,req) {
        var templates = require('duality/templates');

        var context = {id:doc._id,title:doc.title,author:doc.author,tracks:doc.tracks,dbname:req.info.db_name};
        var content = templates.render('musicArticle.html',req,context);
        var html = templates.render('base.html',req,{content:content,title:doc.title,author:doc.author});

        return html;
    }
    /*
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
    */
};

exports.views = {
/*
    makes: {
        map: function(doc) {
            emit(doc.make,null);
        }
    },
    */
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
            if (doc.collection == 'pages' && doc.filenames) {
                emit(doc.collection, doc);
            }
        }
    },
    videos: {
        map: function(doc) {
            if (doc.collection == 'pages' && doc.videos) {
                emit(doc.collection, doc);
            }
        }
    },
    music: {
        map: function(doc) {
            if (doc.collection == 'pages' && doc.tracks) {
                emit(doc.collection, doc);
            }
        }
    }
    /*
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
    */
};

exports.rewrites = [
    {from:'/yyy/_design/edit/*',to:'*'},
    {from:'/yyy/*',to:'../../*'},
    {from:'',to:'index.html'},
    {from:'*',to:'*'}
];
