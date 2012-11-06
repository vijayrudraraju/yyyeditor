// lib/app.js
exports.shows = {
    article: function (doc,req) {
        var templates = require('duality/templates');
        var formattedSections = [];
        for (var i=0;i<doc.sections.length;i++) {
            formattedSections[i] = doc.sections[i];
            if (doc.sections[i].text) {
                formattedSections[i].normText = formattedSections[i].text.replace(/\n/g, '<br/>');
            }
        }
        //var formatted = doc.text.replace(/\n/g, '<br/>');
        //var context = {title:doc.title,author:doc.author,text:formatted};
        //var content = templates.render('article.html',req,context);
        var context = {title:doc.title,author:doc.author,sections:formattedSections,page_id:doc._id};
        //var html = templates.render('base.html',req,{content:content,title:doc.title,author:doc.author});
        var html = templates.render('base.html',req,context);

        return html;
    },
};

exports.views = {
    all: {
        map: function(doc) {
            if (doc.collection) {
                emit(doc.collection, doc);
            }
        }
    },
    text: {
        map: function(doc) {
            if (doc.collection == 'pages' && doc.text) {
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
};

exports.rewrites = [
    {from:'/yyy/_design/edit/*',to:'*'},
    {from:'/yyy/*',to:'../../*'},
    {from:'',to:'index.html'},
    {from:'*',to:'*'}
];
