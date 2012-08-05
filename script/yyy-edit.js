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
            "click .all-new-button": "newOne",
            "click .delete-button": "deleteOne"
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
            console.log('all onReset');

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
            console.log('all viewOne ',ev,ev.target.id);

            var stringArray = ev.target.id.split('-');
            var model = Pages.getByCid(stringArray[2]);
            console.log(model);

            this.selectedModel = model;
            this.selectedId = model.id;

            if (model.get('text'))
                window.open('http://www.yesyesyesmag.com/_show/textArticle/'+this.selectedId);
            else if (model.get('filenames'))
                window.open('http://www.yesyesyesmag.com/_show/imagesArticle/'+this.selectedId);
            else if (model.get('videos'))
                window.open('http://www.yesyesyesmag.com/_show/videosArticle/'+this.selectedId);
            else if (model.get('tracks'))
                window.open('http://www.yesyesyesmag.com/_show/musicArticle/'+this.selectedId);
        },
        editOne: function(ev) {
            console.log('all editOne ',ev,ev.target.id);

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
        deleteOne: function(ev) {
            console.log('images editOne ',ev,ev.target.id);

            var stringArray = ev.target.id.split('-');
            var model = Pages.get(stringArray[2]);
            console.log(model);

            model.destroy({
                success: function() {
                    console.log('article deletion success');
                    Pages.fetch({success: function() { console.log('post deletion all fetch success');}});
                },
                error: function(data) {
                    console.log('article deletion error!');
                }
            });
        },
        addOne: function(model) {
            console.log(model);

            $('#all-articles-grid ul').append(
                '<li>'+model.get('title')+'<br/>'+model.get('author')+'<br/><button type="button" class="edit-button" id="all-edit-'+model.id+'">edit</button><button type="button" class="view-button" id="all-view-'+model.cid+'">view</button><button type="button" class="delete-button" id="all-delete-'+model.id+'">delete</button></li>'
            );
        },
    });
    window.NewAll = new NewAllView({ el: $('#all-section')  });;






    window.NewTextView = Backbone.View.extend({
        selectedId: 0,
        selectedModel: {},
        coverName: [],
        events: {
            "click .text-view-button": "viewOne",
            "click .text-edit-button": "editOne",
            "click #text-new-button": "newOne",
            "change #text-new-cover": "coverFileChange",
            "change #text-edit-cover": "editCoverFileChange"
        },
        initialize: function() {
            this.selectedId = 0;
            this.selectedModel = {};
            this.coverName = [];

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

            window.open('http://www.yesyesyesmag.com/_show/textArticle/'+this.selectedId);
        },
        newOne: function(ev) {
            console.log('text newOne ',ev,ev.target.id);

            $('#text-new-cover').parent().html($('#text-new-cover').parent().html());
            $('#text-new-title').val('');
            $('#text-new-author').val('');
            $('#text-new-main').val('');

            $('#text-new-form').show();
            $('#text-edit-form').hide();
            $('#text-articles-grid').hide();

            this.selectedId = 0;
            this.selectedModel = {};
            self.coverName = [];

            this.refreshCoverAttachment();
        },
        editOne: function(ev) {
            console.log('text editOne ',ev,ev.target.id);

            var stringArray = ev.target.id.split('-');
            var model = Texts.get(stringArray[2]);
            console.log(model);

            this.selectedId = model.id;
            this.selectedModel = model;

            $('#text-new-form').hide();
            $('#text-edit-form').show();
            $('#text-articles-grid').hide();

            $('#text-new-cover').parent().html($('#text-new-cover').parent().html());
            $('#text-edit-title').val(model.get('title'));
            $('#text-edit-author').val(model.get('author'));
            $('#text-edit-main').val(model.get('text'));
            $('#text-edit-form :hidden').val(model.get('_rev'));

            this.refreshCoverAttachment();
        },
        addOne: function(model) {
            console.log(model);
            $('#text-articles-grid ul').append(
                '<li>'+model.get('title')+'<br/>'+model.get('author')+'<br/><button type="button" class="text-edit-button" id="text-edit-'+model.id+'">edit</button><button type="button" class="text-view-button" id="text-view-'+model.cid+'">view</button></li>'
            );
        },
        coverFileChange: function(ev) {
            console.log('text coverFileChange');

            this.refreshCoverAttachment();
        },
        editCoverFileChange: function(ev) {
            console.log('text editCoverFileChange');

            this.refreshCoverAttachment();
        },
        refreshCoverAttachment: function() {
            console.log('text refreshCoverAttachment');

            var self = this;

            $('#text-new-cover-preview').html('');
            var file = $('#text-new-cover')[0].files[0];
            if (file) {
                $('#text-new-cover-preview').append('<li>'+file.name);
                $('#text-new-cover-preview').append('<img class="thumbnail" id="text-new-cover-preview-image" alt="image"/></li>');
                var reader = new FileReader();
                reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; } })($('#text-new-cover-preview-image')[0]);
                reader.readAsDataURL(file);
            }

            $('#text-edit-cover-preview').html('');
            var file = $('#text-edit-cover')[0].files[0];
            if (file) {
                $('#text-edit-cover-preview').append('<li>'+file.name);
                $('#text-edit-cover-preview').append('<img class="thumbnail" id="text-edit-cover-preview-image" alt="image"/></li>');
                var reader = new FileReader();
                reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; } })($('#text-edit-cover-preview-image')[0]);
                reader.readAsDataURL(file);
            } else if (self.selectedModel.id) {
                file = self.selectedModel.get('covername');
                $('#text-edit-cover-preview').append('<li>'+file);
                $('#text-edit-cover-preview').append('<img class="thumbnail" id="text-edit-cover-preview-image" src="/'+_DBNAME+'/'+self.selectedModel.id+'/'+file+'" alt="image"/></li>');
            }
        },
        saveNewToServer: function() {
            console.log('text saveNewToServer');

            var self = this;
            self.coverName= [];
            for (var i=0;i<$('#text-new-cover')[0].files.length;i++) {
                self.coverName.push($('#text-new-cover')[0].files[i].name);
            }

            if ($('#text-new-title').val() === '' || $('#text-new-author').val() === '' || $('#text-new-main').val() === '' || self.coverName.length === 0) {
                alert('somethings empty!! not gonna do it');
                return;
            }

            Texts.add({
                title:$('#text-new-title').val(),
                author:$('#text-new-author').val(),
                text:$('#text-new-main').val(),
                covername:self.coverName
            });

            Texts.at(Texts.length-1).save({},{
                success: function() { 
                    console.log('save success ' + Texts.at(Texts.length-1).id + ' ' + Texts.at(Texts.length-1).cid); 

                    if (self.coverName.length) {
                        $('#text-new-form :hidden').val(Texts.at(Texts.length-1).get('_rev'));
                        $('#text-new-form').ajaxSubmit({
                            url: '/yyy/'+Texts.at(Texts.length-1).id,
                            type: 'post',
                            dataType: 'json',
                            success: function(data) {
                                console.log('text data upload success!');
                                console.log(data);

                                Texts.fetch({
                                    success: function() { 
                                        console.log('text data post save fetch success');

                                        $('#text-new-form').hide();
                                        $('#text-edit-form').hide();
                                        $('#text-articles-grid').show();
                                    }
                                });
                            },
                            error: function(data) {
                                console.log('text data upload error!');
                            }
                        });
                    } else {
                        Texts.fetch({
                            success: function() { 
                                console.log('text data post save fetch success');

                                $('#text-new-form').hide();
                                $('#text-edit-form').hide();
                                $('#text-articles-grid').show();
                            }
                        });
                    }

                }
            });
        },
        saveOldToServer: function() {
            console.log('saveOldToServer text');

            var self = this;
            if ($('#text-edit-cover')[0].files.length) {
                self.coverName[0] = $('#text-edit-cover')[0].files[0].name;

                Texts.get(this.selectedId).set({
                    title:$('#text-edit-title').val(),
                    author:$('#text-edit-author').val(),
                    text:$('#text-edit-main').val(),
                    covername:self.coverName
                });
            } else {
                self.coverName = [];

                Texts.get(this.selectedId).set({
                    title:$('#text-edit-title').val(),
                    author:$('#text-edit-author').val(),
                    text:$('#text-edit-main').val()
                });
            }

            var id = this.selectedId;

            Texts.get(this.selectedId).save({},{
                success: function() { 
                    console.log('text resave success ' + Texts.get(id).id + ' ' + Texts.get(id).cid); 

                    if (self.coverName.length) {
                        $('#text-edit-form :hidden').val(Texts.get(id).get('_rev'));
                        $('#text-edit-form').ajaxSubmit({
                            url: '/yyy/'+id,
                            type: 'post',
                            dataType: 'json',
                            success: function(data) {
                                console.log('text data upload success!');
                                console.log(data);

                                Texts.fetch({
                                    success: function() { 
                                        console.log('text data post save fetch success');

                                        $('#text-new-form').hide();
                                        $('#text-edit-form').hide();
                                        $('#text-articles-grid').show();
                                    }
                                });
                            },
                            error: function(data) {
                                console.log('text data upload error!');
                            }
                        });
                    } else {
                        Texts.fetch({
                            success: function() { 
                                console.log('text data post save fetch success');

                                $('#text-new-form').hide();
                                $('#text-edit-form').hide();
                                $('#text-articles-grid').show();
                            }
                        });
                    }

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
        coverName: [],
        events: {
            "change #images-new-main": "fileChange",
            "change #images-edit-main": "fileChangeEdit",
            "click .images-view-button": "viewOne",
            "click .images-edit-button": "editOne",
            "click #images-new-button": "newOne",
            "click .images-delete-button": "deleteImage",
            "change #images-new-cover": "coverFileChange",
            "change #images-edit-cover": "editCoverFileChange"
        },
        initialize: function() {
            this.selectedId = 0;
            this.selectedModel = {};
            this.fileNames = [];
            this.coverName = [];

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

            window.open('http://www.yesyesyesmag.com/_show/imagesArticle/'+model.id);
        },
        newOne: function(ev) {
            console.log('images newOne ',ev,ev.target.id);

            $('#images-new-cover').parent().html($('#images-new-cover').parent().html());
            $('#images-new-title').val('');
            $('#images-new-author').val('');
            $('#images-new-main').parent().html($('#images-new-main').parent().html());
            $('#images-new-files').html('');

            $('#images-new-form').show();
            $('#images-edit-form').hide();
            $('#images-articles-grid').hide();

            this.selectedId = 0;
            this.selectedModel = {};

            this.refreshImagesAttachments();
            this.refreshCoverAttachment();
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

            $('#images-edit-cover').parent().html($('#images-edit-cover').parent().html());
            $('#images-edit-title').val(model.get('title'));
            $('#images-edit-author').val(model.get('author'));
            $('#images-edit-main').parent().html($('#images-edit-main').parent().html());
            $('#images-edit-form :hidden').val(model.get('_rev'));

            this.refreshImagesAttachments();
            this.refreshCoverAttachment();
        },
        addOne: function(model) {
            console.log(model);
            $('#images-articles-grid ul').append(
                '<li>'+model.get('title')+'<br/>'+model.get('author')+'<br/><button type="button" class="images-edit-button" id="images-edit-'+model.id+'">edit</button><button type="button" class="images-view-button" id="images-view-'+model.cid+'">view</button></li>'
            );
        },
        deleteImage: function(ev) {
            console.log('images deleteImage',ev,ev.target.id);

            var stringArray = ev.target.id.split('-');
            var model = Images.get(stringArray[4]);
            var imageIndex = stringArray[5];
            var stubs = model.get('_attachments');
            var filenames = model.get('filenames');
            var covername = model.get('covername');
            var coverIndex = filenames.indexOf(covername);

            console.log(imageIndex,coverIndex);

/*
            if (coverIndex < imageIndex) {
                imageIndex++;
            }
            */

            var name = filenames.splice(imageIndex,1);
            console.log(name, filenames);
            delete stubs[name];

            model.set({
                _attachments:stubs,
                filenames:filenames
            });

            this.selectedModel = model;

            this.refreshImagesAttachments();
        },
        coverFileChange: function(ev) {
            console.log('images coverFileChange');

            this.refreshCoverAttachment();
        },
        editCoverFileChange: function(ev) {
            console.log('images editCoverFileChange');

            this.refreshCoverAttachment();
        },
        refreshCoverAttachment: function() {
            console.log('images refreshCoverAttachment');

            var self = this;

            $('#images-new-cover-preview').html('');
            var file = $('#images-new-cover')[0].files[0];
            if (file) {
                $('#images-new-cover-preview').append('<li>'+file.name);
                $('#images-new-cover-preview').append('<img class="thumbnail" id="images-new-cover-preview-image" alt="image"/></li>');
                var reader = new FileReader();
                reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; } })($('#images-new-cover-preview-image')[0]);
                reader.readAsDataURL(file);
            }

            $('#images-edit-cover-preview').html('');
            var file = $('#images-edit-cover')[0].files[0];
            if (file) {
                $('#images-edit-cover-preview').append('<li>'+file.name);
                $('#images-edit-cover-preview').append('<img class="thumbnail" id="images-edit-cover-preview-image" alt="image"/></li>');
                var reader = new FileReader();
                reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; } })($('#images-edit-cover-preview-image')[0]);
                reader.readAsDataURL(file);
            } else if (self.selectedModel.id) {
                file = self.selectedModel.get('covername');
                console.log(file);
                $('#images-edit-cover-preview').append('<li>'+file);
                $('#images-edit-cover-preview').append('<img class="thumbnail" id="images-edit-cover-preview-image" src="/'+_DBNAME+'/'+self.selectedModel.id+'/'+file+'" alt="image"/></li>');
            }
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
                console.log(files);
                for (var i=0;i<files.length;i++) {
                    $('#images-edit-files').append('<li>'+files[i]);
                    $('#images-edit-files').append('<img class="thumbnail" id="images-files-'+i+'" src="/'+_DBNAME+'/'+self.selectedModel.id+'/'+files[i]+'" alt="image"/>');
                    $('#images-edit-files').append('<button type="button" class="images-delete-button" id="images-edit-old-delete-'+self.selectedModel.id+'-'+i+'">delete</button></li>');
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
            self.coverName= [];
            for (var i=0;i<$('#images-new-cover')[0].files.length;i++) {
                self.coverName.push($('#images-new-cover')[0].files[i].name);
            }

            if ($('#images-new-title').val() === '' || $('#images-new-author').val() === '' || self.fileNames.length === 0 || self.coverName.length === 0) {
                alert('somethings empty!! not gonna do it');
                return;
            }
            
            Images.add({
                title:$('#images-new-title').val(),
                author:$('#images-new-author').val(),
                filenames:self.fileNames,
                covername:self.coverName
            });

            Images.at(Images.length-1).save({},{
                success: function() { 
                    console.log('save success ' + Images.at(Images.length-1).id + ' ' + Images.at(Images.length-1).cid); 
                    if (self.fileNames.length) {
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
                    } else {
                        Images.fetch({
                            success: function() { 
                                console.log('images data post save fetch success');

                                $('#images-new-form').hide();
                                $('#images-edit-form').hide();
                                $('#images-articles-grid').show();
                            }
                        });
                    }
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

            if ($('#images-edit-cover')[0].files.length) {
                self.coverName[0] = $('#images-edit-cover')[0].files[0].name;

                Images.get(this.selectedId).set({
                    title:$('#images-edit-title').val(),
                    author:$('#images-edit-author').val(),
                    filenames:filenames,
                    covername:self.coverName
                });
            } else {
                self.coverName = [];

                Images.get(this.selectedId).set({
                    title:$('#images-edit-title').val(),
                    author:$('#images-edit-author').val(),
                    filenames:filenames
                });
            }


/*
            Images.get(id).set({
                filenames:filenames
            });
            */

            Images.get(id).save({},{
                success: function() { 
                    console.log('save success ' + Images.get(id).id + ' ' + Images.get(id).cid); 
                    if (self.fileNames.length || self.coverName.length) {
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
                        Images.fetch({
                            success: function() { 
                                console.log('post save fetch success');

                                $('#images-new-form').hide();
                                $('#images-edit-form').hide();
                                $('#images-articles-grid').show();
                            }
                        });
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
        coverName: [],
        events: {
            "click .videos-view-button": "viewOne",
            "click .videos-edit-button": "editOne",
            "click #videos-new-button": "newOne",
            "click .videos-add-button": "addVideo",
            "click .videos-delete-button": "deleteVideo",
            "change #videos-new-cover": "coverFileChange",
            "change #videos-edit-cover": "editCoverFileChange"
        },
        initialize: function() {
            this.selectedId = 0;
            this.selectedModel = {};
            this.videoCodes = [];
            this.coverName = [];

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

            window.open('http://www.yesyesyesmag.com/_show/videosArticle/'+model.id);
        },
        newOne: function(ev) {
            console.log('videos newOne ',ev,ev.target.id);

            $('#videos-new-cover').parent().html($('#videos-new-cover').parent().html());
            $('#videos-new-title').val('');
            $('#videos-new-author').val('');
            $('#videos-new-code').val('');

            $('#videos-new-form').show();
            $('#videos-edit-form').hide();
            $('#videos-articles-grid').hide();

            this.videoCodes = []; 
            this.selectedId = 0;
            this.selectedModel = {};

            this.refreshVideosAttachments();
            this.refreshCoverAttachment();
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

            $('#videos-edit-cover').parent().html($('#videos-edit-cover').parent().html());
            $('#videos-edit-title').val(model.get('title'));
            $('#videos-edit-author').val(model.get('author'));
            $('#videos-edit-code').val('');
            this.videoCodes = model.get('videos');
            $('#videos-edit-form :hidden').val(model.get('_rev'));

            this.refreshVideosAttachments();
            this.refreshCoverAttachment();
        },
        addOne: function(model) {
            console.log(model);
            $('#videos-articles-grid ul').append(
                '<li>'+model.get('title')+'<br/>'+model.get('author')+'<br/><button type="button" class="videos-edit-button" id="videos-edit-'+model.id+'">edit</button><button type="button" class="videos-view-button" id="videos-view-'+model.cid+'">view</button></li>'
            );
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
        coverFileChange: function(ev) {
            console.log('videos coverFileChange');

            this.refreshCoverAttachment();
        },
        editCoverFileChange: function(ev) {
            console.log('videos editCoverFileChange');

            this.refreshCoverAttachment();
        },
        refreshCoverAttachment: function() {
            console.log('videos refreshCoverAttachment');

            var self = this;

            $('#videos-new-cover-preview').html('');
            var file = $('#videos-new-cover')[0].files[0];
            if (file) {
                $('#videos-new-cover-preview').append('<li>'+file.name);
                $('#videos-new-cover-preview').append('<img class="thumbnail" id="videos-new-cover-preview-image" alt="image"/></li>');
                var reader = new FileReader();
                reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; } })($('#videos-new-cover-preview-image')[0]);
                reader.readAsDataURL(file);
            }

            $('#videos-edit-cover-preview').html('');
            var file = $('#videos-edit-cover')[0].files[0];
            if (file) {
                $('#videos-edit-cover-preview').append('<li>'+file.name);
                $('#videos-edit-cover-preview').append('<img class="thumbnail" id="videos-edit-cover-preview-image" alt="image"/></li>');
                var reader = new FileReader();
                reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; } })($('#videos-edit-cover-preview-image')[0]);
                reader.readAsDataURL(file);
            } else if (self.selectedModel.id) {
                file = self.selectedModel.get('covername');
                console.log(file);
                $('#videos-edit-cover-preview').append('<li>'+file);
                $('#videos-edit-cover-preview').append('<img class="thumbnail" id="videos-edit-cover-preview-image" src="/'+_DBNAME+'/'+self.selectedModel.id+'/'+file+'" alt="image"/></li>');
            }
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
            self.coverName= [];
            for (var i=0;i<$('#videos-new-cover')[0].files.length;i++) {
                self.coverName.push($('#videos-new-cover')[0].files[i].name);
            }

            if ($('#videos-new-title').val() === '' || $('#videos-new-author').val() === '' || self.videoCodes.length === 0 || self.coverName.length === 0) {
                alert('somethings empty!! not gonna do it');
                return;
            }

            Videos.add({
                title:$('#videos-new-title').val(),
                author:$('#videos-new-author').val(),
                videos:self.videoCodes,
                covername:self.coverName
            });

            Videos.at(Videos.length-1).save({},{
                success: function() { 
                    console.log('save success ' + Videos.at(Videos.length-1).id + ' ' + Videos.at(Videos.length-1).cid); 

                    if (self.coverName.length) {
                        $('#videos-new-form :hidden').val(Videos.at(Videos.length-1).get('_rev'));
                        $('#videos-new-form').ajaxSubmit({
                            url: '/yyy/'+Videos.at(Videos.length-1).id,
                            type: 'post',
                            dataType: 'json',
                            success: function(data) {
                                console.log('videos data upload success!');
                                console.log(data);

                                Videos.fetch({
                                    success: function() { 
                                        console.log('videos data post save fetch success');

                                        $('#videos-new-form').hide();
                                        $('#videos-edit-form').hide();
                                        $('#videos-articles-grid').show();
                                    }
                                });
                            },
                            error: function(data) {
                                console.log('videos data upload error!');
                            }
                        });
                    } else {
                        Videos.fetch({
                            success: function() { 
                                console.log('videos data post save fetch success');

                                $('#videos-new-form').hide();
                                $('#videos-edit-form').hide();
                                $('#videos-articles-grid').show();
                            }
                        });
                    }

                }
            });
        },
        saveOldToServer: function() {
            console.log('videos saveOldToServer');

            var self = this;
            if ($('#videos-edit-cover')[0].files.length) {
                self.coverName[0] = $('#videos-edit-cover')[0].files[0].name;

                Videos.get(this.selectedId).set({
                    title:$('#videos-edit-title').val(),
                    author:$('#videos-edit-author').val(),
                    videos:self.videoCodes,
                    covername:self.coverName
                });
            } else {
                self.coverName = [];

                Videos.get(this.selectedId).set({
                    title:$('#videos-edit-title').val(),
                    author:$('#videos-edit-author').val(),
                    videos:self.videoCodes
                });
            }

            var id = this.selectedId;

            Videos.get(this.selectedId).save({},{
                success: function() { 
                    console.log('videos resave success ' + Videos.get(id).id + ' ' + Videos.get(id).cid); 

                    if (self.coverName.length) {
                        $('#videos-edit-form :hidden').val(Videos.get(id).get('_rev'));
                        $('#videos-edit-form').ajaxSubmit({
                            url: '/yyy/'+id,
                            type: 'post',
                            dataType: 'json',
                            success: function(data) {
                                console.log('videos data upload success!');
                                console.log(data);

                                Videos.fetch({
                                    success: function() { 
                                        console.log('videos data post save fetch success');

                                        $('#videos-new-form').hide();
                                        $('#videos-edit-form').hide();
                                        $('#videos-articles-grid').show();
                                    }
                                });
                            },
                            error: function(data) {
                                console.log('videos data upload error!');
                            }
                        });
                    } else {
                        Videos.fetch({
                            success: function() { 
                                console.log('videos data post save fetch success');

                                $('#videos-new-form').hide();
                                $('#videos-edit-form').hide();
                                $('#videos-articles-grid').show();
                            }
                        });
                    }

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
        selectedModel: {},
        trackCodes: [],
        coverName: [],
        events: {
            "click .music-view-button": "viewOne",
            "click .music-edit-button": "editOne",
            "click #music-new-button": "newOne",
            "change #music-new-cover": "coverFileChange",
            "change #music-edit-cover": "editCoverFileChange"
        },
        initialize: function() {
            this.selectedId = 0;
            this.selectedModel = {};
            this.trackCodes = [];
            this.coverName = [];

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

            window.open('http://www.yesyesyesmag.com/_show/musicArticle/'+this.selectedId);
        },
        newOne: function(ev) {
            console.log('music newOne ',ev,ev.target.id);

            $('#music-new-cover').parent().html($('#music-new-cover').parent().html());
            $('#music-new-title').val('');
            $('#music-new-author').val('');
            $('#music-new-code').val('');

            $('#music-new-form').show();
            $('#music-edit-form').hide();
            $('#music-articles-grid').hide();

            this.trackCodes = []; 
            this.selectedId = 0;
            this.selectedModel = {};

            this.refreshCoverAttachment();
        },
        editOne: function(ev) {
            console.log('music editOne ',ev,ev.target.id);

            var stringArray = ev.target.id.split('-');
            var model = Music.get(stringArray[2]);
            console.log(model);

            this.selectedId = model.id;
            this.selectedModel = model;

            $('#music-new-form').hide();
            $('#music-edit-form').show();
            $('#music-articles-grid').hide();

            $('#music-edit-cover').parent().html($('#music-edit-cover').parent().html());
            $('#music-edit-title').val(model.get('title'));
            $('#music-edit-author').val(model.get('author'));
            $('#music-edit-code').val(model.get('tracks')[0]);
            this.trackCodes = model.get('tracks');
            $('#music-edit-form :hidden').val(model.get('_rev'));

            this.refreshCoverAttachment();
        },
        addOne: function(model) {
            console.log(model);
            $('#music-articles-grid ul').append(
                '<li>'+model.get('title')+'<br/>'+model.get('author')+'<br/><button type="button" class="music-edit-button" id="music-edit-'+model.id+'">edit</button><button type="button" class="music-view-button" id="music-view-'+model.cid+'">view</button></li>'
            );
        },
        coverFileChange: function(ev) {
            console.log('music coverFileChange');

            this.refreshCoverAttachment();
        },
        editCoverFileChange: function(ev) {
            console.log('music editCoverFileChange');

            this.refreshCoverAttachment();
        },
        refreshCoverAttachment: function() {
            console.log('music refreshCoverAttachment');

            var self = this;

            $('#music-new-cover-preview').html('');
            var file = $('#music-new-cover')[0].files[0];
            if (file) {
                $('#music-new-cover-preview').append('<li>'+file.name);
                $('#music-new-cover-preview').append('<img class="thumbnail" id="music-new-cover-preview-image" alt="image"/></li>');
                var reader = new FileReader();
                reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; } })($('#music-new-cover-preview-image')[0]);
                reader.readAsDataURL(file);
            }

            $('#music-edit-cover-preview').html('');
            var file = $('#music-edit-cover')[0].files[0];
            console.log('music-edit',file,self.selectedModel);
            if (file) {
                $('#music-edit-cover-preview').append('<li>'+file.name);
                $('#music-edit-cover-preview').append('<img class="thumbnail" id="music-edit-cover-preview-image" alt="image"/></li>');
                var reader = new FileReader();
                reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; } })($('#music-edit-cover-preview-image')[0]);
                reader.readAsDataURL(file);
            } else if (self.selectedModel.id) {
                file = self.selectedModel.get('covername');
                console.log(file);
                $('#music-edit-cover-preview').append('<li>'+file);
                $('#music-edit-cover-preview').append('<img class="thumbnail" id="music-edit-cover-preview-image" src="/'+_DBNAME+'/'+self.selectedModel.id+'/'+file+'" alt="image"/></li>');
            }
        },
        saveNewToServer: function() {
            console.log('music saveNewToServer');

            var self = this;
            self.coverName= [];
            for (var i=0;i<$('#music-new-cover')[0].files.length;i++) {
                self.coverName.push($('#music-new-cover')[0].files[i].name);
            }

            if ($('#music-new-title').val() === '' || $('#music-new-author').val() === '' || $('#music-new-code').val() === '' || self.coverName.length === 0) {
                alert('somethings empty!! not gonna do it');
                return;
            }

            Music.add({
                title:$('#music-new-title').val(),
                author:$('#music-new-author').val(),
                tracks:[$('#music-new-code').val()],
                covername:self.coverName
            });

            Music.at(Music.length-1).save({},{
                success: function() { 
                    console.log('save success ' + Music.at(Music.length-1).id + ' ' + Music.at(Music.length-1).cid); 

                    if (self.coverName.length) {
                        $('#music-new-form :hidden').val(Music.at(Music.length-1).get('_rev'));
                        $('#music-new-form').ajaxSubmit({
                            url: '/yyy/'+Music.at(Music.length-1).id,
                            type: 'post',
                            dataType: 'json',
                            success: function(data) {
                                console.log('music data upload success!');
                                console.log(data);

                                Music.fetch({
                                    success: function() { 
                                        console.log('music data post save fetch success');

                                        $('#music-new-form').hide();
                                        $('#music-edit-form').hide();
                                        $('#music-articles-grid').show();
                                    }
                                });
                            },
                            error: function(data) {
                                console.log('music data upload error!');
                            }
                        });
                    } else {
                        Music.fetch({
                            success: function() { 
                                console.log('music data post save fetch success');

                                $('#music-new-form').hide();
                                $('#music-edit-form').hide();
                                $('#music-articles-grid').show();
                            }
                        });
                    }

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

            var self = this;
            if ($('#music-edit-cover')[0].files.length) {
                self.coverName[0] = $('#music-edit-cover')[0].files[0].name;

                Music.get(this.selectedId).set({
                    title:$('#music-edit-title').val(),
                    author:$('#music-edit-author').val(),
                    tracks:[$('#music-edit-code').val()],
                    covername:self.coverName
                });
            } else {
                self.coverName = [];

                Music.get(this.selectedId).set({
                    title:$('#music-edit-title').val(),
                    author:$('#music-edit-author').val(),
                    tracks:[$('#music-edit-code').val()]
                });
            }

            var id = this.selectedId;

            Music.get(this.selectedId).save({},{
                success: function() { 
                    console.log('music resave success ' + Music.get(id).id + ' ' + Music.get(id).cid); 

                    if (self.coverName.length) {
                        $('#music-edit-form :hidden').val(Music.get(id).get('_rev'));
                        $('#music-edit-form').ajaxSubmit({
                            url: '/yyy/'+id,
                            type: 'post',
                            dataType: 'json',
                            success: function(data) {
                                console.log('music data upload success!');
                                console.log(data);

                                Music.fetch({
                                    success: function() { 
                                        console.log('music data post save fetch success');

                                        $('#music-new-form').hide();
                                        $('#music-edit-form').hide();
                                        $('#music-articles-grid').show();
                                    }
                                });
                            },
                            error: function(data) {
                                console.log('music data upload error!');
                            }
                        });
                    } else {
                        Music.fetch({
                            success: function() { 
                                console.log('music data post save fetch success');

                                $('#music-new-form').hide();
                                $('#music-edit-form').hide();
                                $('#music-articles-grid').show();
                            }
                        });
                    }

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
