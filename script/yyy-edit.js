$(function(){
    function HtmlEncode(s) {
        var el = document.createElement('div');
        el.innerText = el.textContent = s;
        s = el.innerHTML;
        return s;
    }

    var _DBNAME = 'yyy';
    Backbone.couch_connector.config.db_name = _DBNAME;
    Backbone.couch_connector.config.ddoc_name = "edit";

    window.PageModel= Backbone.Model.extend({
        url: '/pages'
    }); 

    window.PageCollection = Backbone.Collection.extend({ 
        model: PageModel,
        db: {
            view: "all" 
        }
    });
    window.TextCollection = Backbone.Collection.extend({ 
        model: PageModel,
        db: {
            view: "texts" 
        }
    });
    window.ImagesCollection = Backbone.Collection.extend({ 
        model: PageModel,
        db: {
            view: "images" 
        }
    });
    window.VideosCollection = Backbone.Collection.extend({ 
        model: PageModel,
        db: {
            view: "videos" 
        }
    });
    window.MusicCollection = Backbone.Collection.extend({ 
        model: PageModel,
        db: {
            view: "music" 
        }
    });

    window.Pages = new PageCollection;
    window.Texts = new TextCollection;
    window.Images = new ImagesCollection;
    window.Videos = new VideosCollection;
    window.Music = new MusicCollection;








    window.NewAllView = Backbone.View.extend({
        selectedId: 0,
        selectedModel: {},
        events: {
            "click .view-button": "viewOne",
            "click .edit-button": "editOne",
            "click .all-new-button": "newOne"
        },
        initialize: function() {
            this.selectedId = 0;
            this.selectedModel = {};
            Pages.on('reset', this.onReset, this);
            Pages.fetch({success: function() { console.log('all fetch success');}});
        },
        refresh: function() {
            Pages.fetch({success: function() { console.log('all refresh fetch success');}});
        },
        onReset: function(coll,resp) {
            console.log('onReset all');

            $('#all-articles-grid ul').html('');
            Pages.each(this.addOne);
        },
        newOne: function(ev) {
            console.log('all newOne ',ev,ev.target.id);

            var stringArray = ev.target.id.split('-');
            var type = stringArray[0];
            console.log(type);

            if (type === 'text') {
                trigText();
                window.NewText.newOne(ev);
            } else if (type === 'images') {
                trigImages();
                window.NewImages.newOne(ev);
            } else if (type === 'videos') {
                trigVideos();
                window.NewVideos.newOne(ev);
            } else if (type === 'music') {
                trigMusic();
                window.NewMusic.newOne(ev);
            }
        },
        viewOne: function(ev) {
            console.log('viewOne ',ev,ev.target.id);

            var stringArray = ev.target.id.split('-');
            var model = Pages.getByCid(stringArray[2]);
            console.log(model);

            this.selectedModel = model;
            this.selectedId = model.id;

            if (model.get('text'))
                window.open('_show/textArticle/'+this.selectedId);
            else if (model.get('filenames'))
                window.open('_show/imagesArticle/'+this.selectedId);
            else if (model.get('videos'))
                window.open('_show/videosArticle/'+this.selectedId);
            else if (model.get('tracks'))
                window.open('_show/musicArticle/'+this.selectedId);
        },
        editOne: function(ev) {
            console.log('images editOne ',ev,ev.target.id);

            var stringArray = ev.target.id.split('-');
            var model = Pages.get(stringArray[2]);
            console.log(model);

            if (model.get('text')) {
                trigText();
                window.NewText.editOne(ev);
            } else if (model.get('filenames')) {
                trigImages();
                window.NewImages.editOne(ev);
            } else if (model.get('videos')) {
                trigVideos();
                window.NewVideos.editOne(ev);
            } else if (model.get('tracks')) {
                trigMusic();
                window.NewMusic.editOne(ev);
            }
        },
        addOne: function(model) {
            console.log(model);

            $('#all-articles-grid ul').append(
                '<li>'+model.get('title')+'<br/>'+model.get('author')+'<br/><button type="button" class="edit-button" id="all-edit-'+model.id+'">edit</button><button type="button" class="view-button" id="all-view-'+model.cid+'">view</button></li>'
            );
        },
    });
    window.NewAll = new NewAllView({ el: $('#all-section')  });;








    window.NewTextView = Backbone.View.extend({
        selectedId: 0,
        events: {
            "click .text-view-button": "viewOne",
            "click .text-edit-button": "editOne",
            "click #text-new-button": "newOne"
        },
        initialize: function() {
            this.selectedId = 0;
            Texts.on('reset', this.onReset, this);
            Texts.fetch({success: function() { console.log('text fetch success');}});
        },
        refresh: function() {
            Texts.fetch({success: function() { console.log('text refresh fetch success');}});
        },
        onReset: function(coll,resp) {
            console.log('text onReset');

            $('#text-articles-grid ul').html('');
            Texts.each(this.addOne);
        },
        viewOne: function(ev) {
            console.log('text viewOne ',ev,ev.target.id);

            var stringArray = ev.target.id.split('-');
            var model = Texts.getByCid(stringArray[2]);
            console.log(model);

            this.selectedId = model.id;

            window.open('_show/textArticle/'+this.selectedId);
        },
        newOne: function(ev) {
            console.log('text newOne ',ev,ev.target.id);

            $('#text-new-form').show();
            $('#text-edit-form').hide();
            $('#text-articles-grid').hide();
        },
        editOne: function(ev) {
            console.log('text editOne ',ev,ev.target.id);

            var stringArray = ev.target.id.split('-');
            var model = Texts.get(stringArray[2]);
            console.log(model);

            this.selectedId = model.id;

            $('#text-new-form').hide();
            $('#text-edit-form').show();
            $('#text-articles-grid').hide();

            $('#text-edit-title').val(model.get('title'));
            $('#text-edit-author').val(model.get('author'));
            $('#text-edit-main').val(model.get('text'));
            $('#text-edit-form :hidden').val(model.get('_rev'));
        },
        addOne: function(model) {
            console.log(model);
            $('#text-articles-grid ul').append(
                '<li>'+model.get('title')+'<br/>'+model.get('author')+'<br/><button type="button" class="text-edit-button" id="text-edit-'+model.cid+'">edit</button><button type="button" class="text-view-button" id="text-view-'+model.cid+'">view</button></li>'
            );
        },
        saveNewToServer: function() {
            console.log('saveNewToServer text');

            Texts.add({
                title:$('#text-new-title').val(),
                author:$('#text-new-author').val(),
                text:$('#text-new-main').val()
            });

            Texts.at(Texts.length-1).save({},{
                success: function() { 
                    console.log('save success ' + Texts.at(Texts.length-1).id + ' ' + Texts.at(Texts.length-1).cid); 
                    Texts.fetch({success: function() { console.log('post save fetch success');}});

                    $('#text-new-form').hide();
                    $('#text-edit-form').hide();
                    $('#text-articles-grid').show();
                }
            });
        },
        saveOldToServer: function() {
            console.log('saveOldToServer text');

            Texts.get(this.selectedId).set({
                title:$('#text-edit-title').val(),
                author:$('#text-edit-author').val(),
                text:$('#text-edit-main').val()
            });

            Texts.get(this.selectedId).save({},{
                success: function(model) { 
                    console.log('text re-save success ' + model.id + ' ' + model.cid); 
                    Texts.fetch({success: function() { console.log('text post re-save fetch success');}});

                    $('#text-new-form').hide();
                    $('#text-edit-form').hide();
                    $('#text-articles-grid').show();
                }
            });
        }
    });
    window.NewText = new NewTextView({ el: $('#text-section') });
    $('#text-new-form').submit(function(e) {
        e.preventDefault(); 
        window.NewText.saveNewToServer(); 
    });
    $('#text-edit-form').submit(function(e) {
        e.preventDefault(); 
        window.NewText.saveOldToServer(); 
    });








    window.NewImagesView = Backbone.View.extend({
        selectedId: 0,
        fileNames: [],
        selectedModel: {},
        events: {
            "change #images-new-main": "fileChange",
            "change #images-edit-main": "fileChangeEdit",
            "click .images-view-button": "viewOne",
            "click .images-edit-button": "editOne",
            "click #images-new-button": "newOne",
            "click .images-delete-button": "deleteImage"
        },
        initialize: function() {
            console.log(this);
            var self = this;
            self.selectedId = -1;
            self.fileNames = [];
            self.selectedModel = {};
            //$('#images-new-main').change(this.fileChange);
            Images.on('reset', this.onReset, this);
            Images.fetch({success: function() { console.log('images fetch success');}});
        },
        refresh: function() {
            Images.fetch({success: function() { console.log('images refresh fetch success');}});
        },
        onReset: function(coll,resp) {
            console.log('images onReset');

            $('#images-articles-grid ul').html('');
            Images.each(this.addOne);
        },
        viewOne: function(ev) {
            console.log('images viewOne ',ev,ev.target.id);

            var stringArray = ev.target.id.split('-');
            var model = Images.getByCid(stringArray[2]);
            console.log(model);

            window.open('_show/imagesArticle/'+model.id);
        },
        newOne: function(ev) {
            console.log('images newOne ',ev,ev.target.id);

            $('#images-new-title').val('');
            $('#images-new-author').val('');
            $('#images-new-main').parent().html($('#images-new-main').parent().html());
            $('#images-new-files').html('');

            $('#images-new-form').show();
            $('#images-edit-form').hide();
            $('#images-articles-grid').hide();
        },
        editOne: function(ev) {
            console.log('images editOne ',ev,ev.target.id);

            var stringArray = ev.target.id.split('-');
            var model = Images.get(stringArray[2]);
            console.log(model);

            this.selectedModel = model;
            this.selectedId = model.id;

            $('#images-new-form').hide();
            $('#images-edit-form').show();
            $('#images-articles-grid').hide();

            $('#images-edit-title').val(model.get('title'));
            $('#images-edit-author').val(model.get('author'));
            $('#images-edit-main').parent().html($('#images-edit-main').parent().html());
            $('#images-edit-form :hidden').val(model.get('_rev'));

            this.refreshImagesAttachments();
        },
        addOne: function(model) {
            console.log(model);
            $('#images-articles-grid ul').append(
                '<li>'+model.get('title')+'<br/>'+model.get('author')+'<br/><button type="button" class="images-edit-button" id="images-edit-'+model.cid+'">edit</button><button type="button" class="images-view-button" id="images-view-'+model.cid+'">view</button></li>'
            );
        },
        deleteImage: function(ev) {
            console.log('images deleteImage',ev,ev.target.id);

            var stringArray = ev.target.id.split('-');
            var model = Images.getByCid(stringArray[4]);
            var imageIndex = stringArray[5];
            var stubs = model.get('_attachments');
            var filenames = model.get('filenames');

            if (stringArray[2] == 'old') {
                var name = filenames.splice(imageIndex,1);
                delete stubs[name];
            }

            model.set({
                _attachments:stubs,
                filenames:filenames
            });

            this.refreshImagesAttachments();
        },
        refreshImagesAttachments: function() {
            console.log('images refreshImagesAttachments');

            var self = this;

            $('#images-new-files').html('');
            var files = $('#images-new-main')[0].files;
            console.log(files);
            for (var i=0;i<files.length;i++) {
                $('#images-new-files').append('<li>'+files[i].name);
                $('#images-new-files').append('<img class="thumbnail" id="images-new-preview-'+i+'" alt="image"/></li>');
                //$('#images-new-files').append('<button type="button" class="images-delete-button" id="images-new-new-delete-'+self.selectedModel.cid+'-'+i+'">delete</button></li>');
                $('#images-new-preview-'+i)[0].file = files[i];
                var reader = new FileReader();
                reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; } })($('#images-new-preview-'+i)[0]);
                reader.readAsDataURL(files[i]);
            }

            $('#images-edit-files').html('');
            if (self.selectedModel.id) {
                files = self.selectedModel.get('filenames');
                for (var i=0;i<files.length;i++) {
                    $('#images-edit-files').append('<li>'+files[i]+'</li>');
                    $('#images-edit-files').append('<img class="thumbnail" id="images-files-'+i+'" src="/'+_DBNAME+'/'+self.selectedModel.id+'/'+files[i]+'" alt="image"/>');
                    $('#images-edit-files').append('<button type="button" class="images-delete-button" id="images-edit-old-delete-'+self.selectedModel.cid+'-'+i+'">delete</button></li>');
                }
            }
            files = $('#images-edit-main')[0].files;
            for (var i=0;i<files.length;i++) {
                $('#images-edit-files').append('<li>'+files[i].name);
                $('#images-edit-files').append('<img class="thumbnail" id="images-edit-preview-'+i+'" alt="image"/></li>');
                //$('#images-edit-files').append('<button type="button" class="images-delete-button" id="images-edit-new-delete-'+self.selectedModel.cid+'-'+i+'">delete</button></li>');
                $('#images-edit-preview-'+i)[0].file = files[i];
                var reader = new FileReader();
                reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; } })($('#images-edit-preview-'+i)[0]);
                reader.readAsDataURL(files[i]);
            }
        },
        fileChange: function(ev) {
            console.log('images fileChange');

            this.refreshImagesAttachments();
        },
        fileChangeEdit: function(ev) {
            console.log('images fileChangeEdit');

            this.refreshImagesAttachments();
        },
        saveNewToServer: function() {
            console.log('images saveNewToServer');
            var self = this;
            self.fileNames = [];
            for (var i=0;i<$('#images-new-main')[0].files.length;i++) {
                self.fileNames.push($('#images-new-main')[0].files[i].name);
            }
            
            Images.add({
                title:$('#images-new-title').val(),
                author:$('#images-new-author').val(),
                filenames:self.fileNames
            });

            Images.at(Images.length-1).save({},{
                success: function() { 
                    console.log('save success ' + Images.at(Images.length-1).id + ' ' + Images.at(Images.length-1).cid); 
                    $('#images-new-form :hidden').val(Images.at(Images.length-1).get('_rev'));
                    $('#images-new-form').ajaxSubmit({
                        url: '/yyy/'+Images.at(Images.length-1).id,
                        type: 'post',
                        dataType: 'json',
                        success: function(data) {
                            console.log('images data upload success!');
                            console.log(data);

                            Images.fetch({
                                success: function() { 
                                    console.log('images data post save fetch success');

                                    $('#images-new-form').hide();
                                    $('#images-edit-form').hide();
                                    $('#images-articles-grid').show();
                                }
                            });
                        },
                        error: function(data) {
                            console.log('images data upload error!');
                        }
                    });
                }
            });
        },
        saveOldToServer: function() {
            var self = this;
            self.fileNames = [];
            for (var i=0;i<$('#images-edit-main')[0].files.length;i++) {
                self.fileNames.push($('#images-edit-main')[0].files[i].name);
            }

            var id = this.selectedId;
            var filenames = Images.get(id).get('filenames');
            console.log('old filenames',filenames);
            console.log('new filenames',self.fileNames);
            filenames = filenames.concat(self.fileNames);
            console.log('combined filenames',filenames);

            Images.get(id).set({
                filenames:filenames
            });

            Images.get(id).save({},{
                success: function() { 
                    console.log('save success ' + Images.get(id).id + ' ' + Images.get(id).cid); 
                    if (self.fileNames.length) {
                        $('#images-edit-form :hidden').val(Images.get(id).get('_rev'));
                        $('#images-edit-form').ajaxSubmit({
                            url: '/yyy/'+id,
                            type: 'post',
                            dataType: 'json',
                            success: function(data) {
                                console.log('banner logo upload success!');
                                console.log(data);

                                Images.fetch({
                                    success: function() { 
                                        console.log('post save fetch success');

                                        $('#images-new-form').hide();
                                        $('#images-edit-form').hide();
                                        $('#images-articles-grid').show();
                                    }
                                });
                            },
                            error: function(data) {
                                console.log('banner logo upload error!');
                            }
                        });
                    } else {
                        $('#images-new-form').hide();
                        $('#images-edit-form').hide();
                        $('#images-articles-grid').show();
                    }
                }
            });

        }
    });
    window.NewImages = new NewImagesView({ el: $('#images-section') });
    $('#images-new-form').submit(function(e) {
        e.preventDefault(); 
        window.NewImages.saveNewToServer(); 
    });
    $('#images-edit-form').submit(function(e) {
        console.log('resaving...');
        e.preventDefault(); 
        window.NewImages.saveOldToServer(); 
    });








    window.NewVideosView = Backbone.View.extend({
        selectedId: 0,
        selectedModel: {},
        videoCodes: [],
        events: {
            "click .videos-view-button": "viewOne",
            "click .videos-edit-button": "editOne",
            "click #videos-new-button": "newOne",
            "click .videos-add-button": "addVideo",
            "click .videos-delete-button": "deleteVideo"
        },
        initialize: function() {
            this.selectedId = 0;
            this.selectedModel = {};
            this.videoCodes = [];
            Videos.on('reset', this.onReset, this);
            Videos.fetch({success: function() { console.log('videos fetch success');}});
        },
        refresh: function() {
            Videos.fetch({success: function() { console.log('vidoes refresh fetch success');}});
        },
        onReset: function(coll,resp) {
            console.log('videos onReset');

            $('#videos-articles-grid ul').html('');
            Videos.each(this.addOne);
        },
        viewOne: function(ev) {
            console.log('videos viewOne ',ev,ev.target.id);

            var stringArray = ev.target.id.split('-');
            var model = Videos.getByCid(stringArray[2]);
            console.log(model);

            window.open('_show/videosArticle/'+model.id);
        },
        newOne: function(ev) {
            console.log('videos newOne ',ev,ev.target.id);

            $('#videos-new-form').show();
            $('#videos-edit-form').hide();
            $('#videos-articles-grid').hide();

            this.videoCodes = []; 
            this.selectedId = 0;
            this.selectedModel = {};
            this.refreshVideosAttachments();
        },
        addOne: function(model) {
            console.log(model);
            $('#videos-articles-grid ul').append(
                '<li>'+model.get('title')+'<br/>'+model.get('author')+'<br/><button type="button" class="videos-edit-button" id="videos-edit-'+model.cid+'">edit</button><button type="button" class="videos-view-button" id="videos-view-'+model.cid+'">view</button></li>'
            );
        },
        editOne: function(ev) {
            console.log('videos editOne ',ev,ev.target.id);

            var stringArray = ev.target.id.split('-');
            var model = Videos.get(stringArray[2]);
            console.log(model);

            this.selectedId = model.id;
            this.selectedModel = model;

            $('#videos-new-form').hide();
            $('#videos-edit-form').show();
            $('#videos-articles-grid').hide();

            $('#videos-edit-title').val(model.get('title'));
            $('#videos-edit-author').val(model.get('author'));
            this.videoCodes = model.get('videos');
            $('#videos-edit-form :hidden').val(model.get('_rev'));

            var codes = model.get('videos');

            this.refreshVideosAttachments();
        },
        addVideo: function(ev) {
            console.log('videos addVideo');
            var self = this;

            if (ev.target.id == "videos-new-add") {
                if ($('#videos-new-code').val() == '') {
                    alert('Can\'t add a video because text input box is empty.');
                    return;
                }
                self.videoCodes.push($('#videos-new-code').val());
                $('#videos-new-code').val('');
            } else {
                if ($('#videos-edit-code').val() == '') {
                    alert('Can\'t add a video because text input box is empty.');
                    return;
                }
                self.videoCodes.push($('#videos-edit-code').val());
                $('#videos-edit-code').val('');
            }

            self.refreshVideosAttachments();
        },
        deleteVideo: function(ev) {
            var self = this;
            console.log('videos deleteVideo',ev,ev.target.id,self.videoCodes.length);

            var stringArray = ev.target.id.split('-');
            var imageIndex = stringArray[3];
            var name = self.videoCodes.splice(imageIndex,1);
            
            self.refreshVideosAttachments();
        },
        refreshVideosAttachments: function() {
            var self = this;
            $('#videos-new-codes').html('');
            for (var i=0;i<self.videoCodes.length;i++) {
                $('#videos-new-codes').append('<li><p>'+HtmlEncode(self.videoCodes[i])+'</p>');
                $('#videos-new-codes').append(''+self.videoCodes[i]+'');
                $('#videos-new-codes').append('<button type="button" class="videos-delete-button" id="videos-new-delete-'+self.selectedModel.cid+'-'+i+'">delete</button></li>');
            }

            $('#videos-edit-codes').html('');
            for (var i=0;i<self.videoCodes.length;i++) {
                $('#videos-edit-codes').append('<li><p>'+HtmlEncode(self.videoCodes[i])+'</p>');
                $('#videos-edit-codes').append(''+self.videoCodes[i]+'');
                $('#videos-edit-codes').append('<button type="button" class="videos-delete-button" id="videos-edit-delete-'+self.selectedModel.cid+'-'+i+'">delete</button></li>');
            }
        },
        saveNewToServer: function() {
            console.log('videos saveNewToServer');

            var self = this;
            Videos.add({
                title:$('#videos-new-title').val(),
                author:$('#videos-new-author').val(),
                videos:self.videoCodes
            });

            Videos.at(Videos.length-1).save({},{
                success: function() { 
                    console.log('save success ' + Videos.at(Videos.length-1).id + ' ' + Videos.at(Videos.length-1).cid); 
                    Videos.fetch({success: function() { console.log('post save fetch success');}});

                    $('#videos-new-form').hide();
                    $('#videos-edit-form').hide();
                    $('#videos-articles-grid').show();
                }
            });
        },
        saveOldToServer: function() {
            console.log('videos saveOldToServer');

            var self = this;
            Videos.get(this.selectedId).set({
                title:$('#videos-edit-title').val(),
                author:$('#videos-edit-author').val(),
                videos:self.videoCodes
            });

            Videos.get(this.selectedId).save({},{
                success: function(model) { 
                    console.log('videos re-save success ' + model.id + ' ' + model.cid); 
                    Videos.fetch({success: function() { console.log('videos post re-save fetch success');}});

                    $('#videos-new-form').hide();
                    $('#videos-edit-form').hide();
                    $('#videos-articles-grid').show();
                }
            });
        }
    });
    window.NewVideos = new NewVideosView({ el: $('#videos-section') });
    $('#videos-new-form').submit(function(e) {
        e.preventDefault(); 
        window.NewVideos.saveNewToServer(); 
    });
    $('#videos-edit-form').submit(function(e) {
        e.preventDefault(); 
        window.NewVideos.saveOldToServer(); 
    });










    window.NewMusicView = Backbone.View.extend({
        selectedId: 0,
        events: {
            "click .music-view-button": "viewOne",
            "click .music-edit-button": "editOne",
            "click #music-new-button": "newOne"
        },
        initialize: function() {
            this.selectedId = 0;
            Music.on('reset', this.onReset, this);
            Music.fetch({success: function() { console.log('music fetch success');}});
        },
        refresh: function() {
            Music.fetch({success: function() { console.log('music refresh fetch success');}});
        },
        onReset: function(coll,resp) {
            console.log('music onReset');

            $('#music-articles-grid ul').html('');
            Music.each(this.addOne);
        },
        viewOne: function(ev) {
            console.log('music viewOne ',ev,ev.target.id);

            var stringArray = ev.target.id.split('-');
            var model = Music.getByCid(stringArray[2]);
            console.log(model);

            this.selectedId = model.id;

            window.open('_show/musicArticle/'+this.selectedId);
        },
        newOne: function(ev) {
            console.log('music newOne ',ev,ev.target.id);

            $('#music-new-form').show();
            $('#music-edit-form').hide();
            $('#music-articles-grid').hide();
        },
        editOne: function(ev) {
            console.log('music editOne ',ev,ev.target.id);

            var stringArray = ev.target.id.split('-');
            var model = Music.get(stringArray[2]);
            console.log(model);

            this.selectedId = model.id;

            $('#music-new-form').hide();
            $('#music-edit-form').show();
            $('#music-articles-grid').hide();

            $('#music-edit-title').val(model.get('title'));
            $('#music-edit-author').val(model.get('author'));
            $('#music-edit-main').val(model.get('text'));
            $('#music-edit-form :hidden').val(model.get('_rev'));
        },
        addOne: function(model) {
            console.log(model);
            $('#music-articles-grid ul').append(
                '<li>'+model.get('title')+'<br/>'+model.get('author')+'<br/><button type="button" class="music-edit-button" id="music-edit-'+model.cid+'">edit</button><button type="button" class="music-view-button" id="music-view-'+model.cid+'">view</button></li>'
            );
        },
        saveNewToServer: function() {
            console.log('music saveNewToServer');

            Music.add({
                title:$('#music-new-title').val(),
                author:$('#music-new-author').val(),
                tracks:[$('#music-new-code').val()]
            });

            Music.at(Music.length-1).save({},{
                success: function() { 
                    console.log('music save success ' + Music.at(Music.length-1).id + ' ' + Music.at(Music.length-1).cid); 
                    Music.fetch({success: function() { console.log('music post save fetch success');}});

                    $('#music-new-form').hide();
                    $('#music-edit-form').hide();
                    $('#music-articles-grid').show();
                }
            });
        },
        saveOldToServer: function() {
            console.log('music saveOldToServer');

            Music.get(this.selectedId).set({
                title:$('#music-edit-title').val(),
                author:$('#music-edit-author').val(),
                tracks:[$('#music-edit-code').val()]
            });

            Music.get(this.selectedId).save({},{
                success: function(model) { 
                    console.log('music re-save success ' + model.id + ' ' + model.cid); 
                    Music.fetch({success: function() { console.log('music post re-save fetch success');}});

                    $('#music-new-form').hide();
                    $('#music-edit-form').hide();
                    $('#music-articles-grid').show();
                }
            });
        }
    });
    window.NewMusic = new NewMusicView({ el: $('#music-section') });
    $('#music-new-form').submit(function(e) {
        e.preventDefault(); 
        window.NewMusic.saveNewToServer(); 
    });
    $('#music-edit-form').submit(function(e) {
        e.preventDefault(); 
        window.NewMusic.saveOldToServer(); 
    });












    trigAll();
});










function trigAll() {
    window.NewAll.refresh();

    $('.section-header h2').html('all articles');
    $('#all-link').addClass('bold');

    $('#all-section').show();
    $('#text-section').hide();
    $('#images-section').hide();
    $('#videos-section').hide();
    $('#music-section').hide();

    $('#text-link').removeClass('bold');
    $('#images-link').removeClass('bold');
    $('#videos-link').removeClass('bold');
    $('#music-link').removeClass('bold');
}
function trigText() {
    window.NewText.refresh();

    $('.section-header h2').html('text articles');
    $('#text-link').addClass('bold');

    $('#all-section').hide();
    $('#text-section').show();
    $('#images-section').hide();
    $('#videos-section').hide();
    $('#music-section').hide();

    $('#text-new-form').hide();
    $('#text-edit-form').hide();
    $('#text-articles-grid').show();

    $('#all-link').removeClass('bold');
    $('#images-link').removeClass('bold');
    $('#videos-link').removeClass('bold');
    $('#music-link').removeClass('bold');

}
function trigImages() {
    window.NewImages.refresh();

    $('.section-header h2').html('images articles');
    $('#images-link').addClass('bold');

    $('#all-section').hide();
    $('#text-section').hide();
    $('#images-section').show();
    $('#videos-section').hide();
    $('#music-section').hide();

    $('#images-new-form').hide();
    $('#images-edit-form').hide();
    $('#images-articles-grid').show();

    $('#all-link').removeClass('bold');
    $('#text-link').removeClass('bold');
    $('#videos-link').removeClass('bold');
    $('#music-link').removeClass('bold');
}
function trigVideos() {
    $('.section-header h2').html('videos articles');
    $('#videos-link').addClass('bold');

    $('#all-section').hide();
    $('#text-section').hide();
    $('#images-section').hide();
    $('#videos-section').show();
    $('#music-section').hide();

    $('#videos-new-form').hide();
    $('#videos-edit-form').hide();
    $('#videos-articles-grid').show();

    $('#all-link').removeClass('bold');
    $('#text-link').removeClass('bold');
    $('#images-link').removeClass('bold');
    $('#music-link').removeClass('bold');
}
function trigMusic() {
    $('.section-header h2').html('music articles');
    $('#music-link').addClass('bold');

    $('#all-section').hide();
    $('#text-section').hide();
    $('#images-section').hide();
    $('#videos-section').hide();
    $('#music-section').show();

    $('#music-new-form').hide();
    $('#music-edit-form').hide();
    $('#music-articles-grid').show();

    $('#all-link').removeClass('bold');
    $('#text-link').removeClass('bold');
    $('#images-link').removeClass('bold');
    $('#videos-link').removeClass('bold');
}
