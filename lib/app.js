// lib/app.js
exports.shows = {
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
