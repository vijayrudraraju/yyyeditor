;$(function(){
    function HtmlEncode(s) {
        var el = document.createElement('div');
        el.innerText = el.textContent = s;
        s = el.innerHTML;
        return s;
    }

    var _DBNAME = 'yyy';
    var _EDITDOCNAME = 'edit';
    var _MAINDOCNAME = 'one';
    var _ID = '';
    var _SNEAKY = new ScrollSneak(window.location.hostname);
    var _SECTIONS = [];

    Backbone.couch_connector.config.db_name = _DBNAME;
    Backbone.couch_connector.config.ddoc_name = _EDITDOCNAME;

    window.PageModel= Backbone.Model.extend({
        url: '/pages'
    }); 
    window.YYYCollectionClass = Backbone.Collection.extend({
        model: window.PageModel,
        db: {
            view: "all" 
        }
    });
    window.YYYCollection = new YYYCollectionClass;
    window.YYYCollection.comparator = function(a,b) {
        return b.get('unix_creation_time') - a.get('unix_creation_time');
    };


    var interfaceArray = ['#nav-interface', '#preview-interface', '#settings-interface', '#loading-interface'],
        interfaceToggle = generateToggler(interfaceArray);
    function generateToggler(array) {
        return function(showIndex) {
            for (var i=0;i<array.length;i++) {
                if (i === showIndex) {
                    $(array[i]).show();
                } else {
                    $(array[i]).hide();
                }
            }
        }
    }
    function loading() {
        _SNEAKY.sneak();
        interfaceToggle(3);
    }
    function loaded(str) {
        if (str === undefined) {
            str = 'nav';
        }
        switch (str) {
            case 'nav':
                interfaceToggle(0);
                break;
            case 'preview':
                interfaceToggle(1);
                break;
            case 'settings':
                interfaceToggle(2);
        }
        _SNEAKY.scroll();
    }
    function loadPage() {
        $.get('/'+_DBNAME+'/_design/'+_EDITDOCNAME+'/_show/'+'article/'+_ID, function(data) {
            $('#preview-interface').html(data);

            _SECTIONS.push($('#preview-interface').find('#edit-title-input').val());
            _SECTIONS.push($('#preview-interface').find('#edit-author-input').val());
            var textareas = $('#preview-interface').find('.page-section > textarea');
            textareas.each(function() {
                _SECTIONS[parseInt($(this).attr('id').split('-')[3])+2] = $(this).val();
            });
            var links = $('#preview-interface').find('.link-section');
            links.each(function() {
                _SECTIONS[parseInt($(this).find('.edit-link').attr('id').split('-')[3])+2] = [
                    $(this).find('.edit-link').val(),
                    $(this).find('.edit-display').val()
                ];
            });
            console.log('_SECTIONS',_SECTIONS);

            loaded('preview');
        });
    }
    function loadSettings() {
        $.get('/'+_DBNAME+'/_design/'+_EDITDOCNAME+'/_show/'+'settings/', function(data) {
            $('#settings-interface').html(data);
            loaded('settings');
        });
    }

    $('body').hashchange(function (e, newHash) {
        console.log('hashchange',e,newHash);
        if (newHash === '') {
            $.hash.go('/home');
        } else if (newHash === '/home') {
            loading();
            window.AllView.refresh();
        } else if (newHash === '/settings') {
            console.log('settings');
            loadSettings();
        } else if (newHash.indexOf('/modify') !== -1) {
            var id = newHash.indexOf('/',1);
            _ID = newHash.slice(id+1);
            console.log('modify',_ID);

            loadPage();
        }
    });

    // setup grid item handlers in nav-interface
    $('li').live('mouseover',function() {
        $('.cell').each(function() {
            $('.label',this).css('visibility','hidden');
        });
        $('.label',this).css('visibility','visible');
    });
    $('li').live('mouseout', function() {
        $('.cell').each(function() {
            $('.label',this).css('visibility','hidden');
        });
    });
    $('.file-form').find('input[type=file]')
        .live('mouseover', function() {
            $(this).parent().parent().find('.change-file-button')
                .css('background-color','green');
        })
        .live('mouseout', function() {
            $(this).parent().parent().find('.change-file-button')
                .css('background-color','lightBlue');
        })
        .live('mousedown', function() {
            $(this).parent().parent().find('.change-file-button')
                .css('background-color','blue');
        });
        $('input[type=text]').live('keyup change', function() {
            if ($(this).parent().find('.title').is('*')) {
                if ($(this).val() !== _SECTIONS[0]) {
                    $(this).parent().find('button').addClass('blinking').removeClass('invisible');
                    $(this).parent().addClass('blinking-section-border');
                } else {
                    $(this).parent().find('button').removeClass('blinking').addClass('invisible');
                    $(this).parent().removeClass('blinking-section-border');
                }
            } else if ($(this).parent().find('.author').is('*')) {
                if ($(this).val() !== _SECTIONS[1]) {
                    $(this).parent().find('button').addClass('blinking').removeClass('invisible');
                    $(this).parent().addClass('blinking-section-border');
                } else {
                    $(this).parent().find('button').removeClass('blinking').addClass('invisible');
                    $(this).parent().removeClass('blinking-section-border');
                }
            } else if ($(this).hasClass('edit-link')) {
                var sectionId = parseInt($(this).attr('id').split('-')[3]);
                console.log(sectionId,$(this).val(),_SECTIONS[sectionId][0]);
                if ($(this).val() !== _SECTIONS[sectionId+2][0]) {
                    $(this).parent().find('.save-link-button').addClass('blinking').removeClass('invisible');
                    $(this).parent().addClass('blinking-section-border');
                } else {
                    $(this).parent().find('.save-link-button').removeClass('blinking').addClass('invisible');
                    $(this).parent().removeClass('blinking-section-border');
                }
            } else if ($(this).hasClass('edit-display')) {
                var sectionId = parseInt($(this).attr('id').split('-')[3]);
                if ($(this).val() !== _SECTIONS[sectionId+2][1]) {
                    $(this).parent().find('.save-link-button').addClass('blinking').removeClass('invisible');
                    $(this).parent().addClass('blinking-section-border');
                } else {
                    $(this).parent().find('.save-link-button').removeClass('blinking').addClass('invisible');
                    $(this).parent().removeClass('blinking-section-border');
                }
            }
        });
        $('textarea').live('keyup change', function() {
            var sectionId = parseInt($(this).attr('id').split('-')[3]);
            if ($(this).val() !== _SECTIONS[sectionId+2]) {
                $(this).parent().find('.save-text-button, .save-video-button, .save-sound-button').addClass('blinking').removeClass('invisible');
                $(this).parent().addClass('blinking-section-border');
            } else {
                $(this).parent().find('.save-text-button, .save-video-button, .save-sound-button').removeClass('blinking').addClass('invisible');
                $(this).parent().removeClass('blinking-section-border');
            }
        });

    window.YYYViewClass = Backbone.View.extend({
        events: {
            "click .view-button" : "viewOne",
            "click #home-btn" : "goHome",

            "click #new-btn" : "addArticle",
            'click #edit-font-btn' : 'editFonts',

            "click .edit-button" : "editArticle",
            "change .change-file-input": "refreshCover",
            "click .save-cover-button" : "saveCover",

            "click .remove-button": "removeArticle",

            "click #add-text-section-button": "addTextSection",
            "click #add-image-section-button": "addImageSection",
            "click #add-link-section-button": "addLinkSection",
            "click #add-video-section-button": "addVideoSection",
            "click #add-sound-section-button": "addSoundSection",

            "click .remove-section-button": "removeSection",

            "click #new-checkbox": "saveNewCheck",
            "click #save-title-button": "saveTitle",
            "click #save-author-button": "saveAuthor",
            "click .save-text-button" : "saveTextSection",
            "click .save-image-button" : "saveImageSection",
            "click .save-link-button" : "saveLinkSection",
            "click .save-video-button" : "saveVideoSection",
            "click .save-sound-button" : "saveSoundSection"
        },
        initialize: function() {
            // helpful state and identity variables
            this.selectedModel = {};
            this.coverName = []; 

            console.log('YYYViewClass initialize');

            // fetch data
            window.YYYCollection.on('reset', this.onReset, this);
            loading();
            window.YYYCollection.fetch({success: function(coll, resp) { 
                //console.log(coll,resp,'initial fetch success');
                $.hash.init();
            }});
        },
        refresh: function() {
            window.YYYCollection.fetch({
                success: function() { 
                    loaded('nav');
                    console.log('refresh fetch success');
                }
            });
        },
        onReset: function(coll,resp) {
            console.log('onReset');

            $('#nav-grid').html('');
            window.YYYCollection.each(this.addOne, this);
            _SNEAKY.scroll();
        },
        goHome: function(ev) {
            console.log('goHome', ev);
            $.hash.go('/home');
        },
        addOne: function(model,index) {
            console.log('addOne',model.id,index);
            if (window.location.hostname === 'localhost') {
                var linkText = 'http://localhost:5984/'+_DBNAME+'/_design/one/_show/article/'+model.id;
            } else {
                var linkText = 'http://www.yesyesyesmag.com/_show/article/'+model.id;
            }
            var str = ''; 
            if (model.get('is_new')) {
                str +=
                    '<div style="float:left;background:yellow;">' +
                    '<p style="position:relative;top:0px;margin:0;height:0px;text-align:center;font-family:\'Pontano Sans\';">NEW!!!</p>';
            }
            str += 
                '<li class="cell">' +
                '<a class="link" href="'+linkText+'" target="_blank">' + 
                '<img class="thumbnail" src="/'+_DBNAME+'/'+model.id+'/'+model.get('cover_name')+'"/>' +
                '<div class="label">' +
                '<h3>'+model.get('author')+'</h3>' +
                '<h3>'+model.get('title')+'</h3>' +
                '</div></a>' + 
                '<div class="file-input-interface" id="cover-interface-'+model.id+'">' +
                '<button type="button" class="change-file-button" id="change-cover-'+model.id+'">change cover</button>' +
                '<form class="file-form" id="cover-form-'+model.id+'"><input type="file" class="change-file-input" id="update-cover-input-'+model.id+'" name="_attachments"/></form>' + 
                '</div>' +
                '<button type="button" class="save-cover-button invisible" id="save-cover-'+model.id+'">save change</button>' +
                '<br/>' +
                '<button type="button" class="edit-button red" id="edit-'+model.id+'">edit article</button>' +
                '<button type="button" class="remove-button serious" id="remove-'+model.id+'">(-)remove</button>' +
                '</li>';
            if (model.get('is_new')) {
                str += '</div>';
            }
            $('#nav-grid').append(str).find('.label').css('visibility','hidden');
        },
        viewOne: function(ev) {
            console.log(this.type+' viewOne ',ev,ev.target.id);

            var stringArray = ev.target.id.split('-');
            var model = window.YYYCollection.getByCid(stringArray[2]);
            console.log(model);

            this.selectedId = model.id;
            this.selectedTemplate = model.get('template');

            window.open('/'+_DBNAME+'/_design/one/_show/'+this.selectedTemplate+'Article/'+this.selectedId);
        },
        editArticle: function(ev) {
            loading();
            console.log('trigger editArticle',ev,ev.target.id);

            var that = this;
            var id = ev.target.id.split('-')[1];

            $.hash.go('/modify/'+id);
        },
        refreshCover: function(ev) {
            var id = ev.target.id.split('-')[3];
            var type = ev.target.id.split('-')[1];
            console.log('refreshCover',ev.target.id,id,type);

            var filePicker = $('#'+ev.target.id);

            var file = filePicker[0].files[0];
            if (file) {
                var reader = new FileReader();
                reader.onload = (function(aImg) { 
                    return function(e) { 
                        aImg.src = e.target.result; 
                        if (type === 'cover') {
                            filePicker.parent().parent().parent().find('.save-cover-button').addClass('blinking').removeClass('invisible');
                            filePicker.parent().parent().parent().find('.link').addClass('blinking-border');
                            filePicker.parent().parent().parent().find('.thumbnail').addClass('bordered');
                            filePicker.parent().parent().parent().find('.label').addClass('bordered');
                        } else if (type === 'image') {
                            $(aImg).removeClass('small'); 
                            $(aImg).addClass('fullscreen').addClass('bordered-section'); 
                            filePicker.parent().parent().find('.save-image-button').addClass('blinking').removeClass('invisible');
                            filePicker.parent().parent().parent().addClass('blinking-section-border');
                        }
                    } 
                })(filePicker.parent().parent().parent().find('img')[0]);
                reader.readAsDataURL(file);
            }
        },
        editFonts: function() {
            loading();
            console.log('trigger editFonts');

            $.hash.go('/settings');
        },
        addArticle: function() {
            loading();
            console.log('addArticle');

            var that = this;

            //console.log('before',window.YYYCollection.at(0).id,window.YYYCollection.at(0).unix_creation_time,window.YYYCollection.length);
            var date = new Date();
            window.YYYCollection.add({
                title:'((empty))',
                author:'((empty))',
                sections: [{id:0,text:'((empty))'}],
                cover_name: '((empty))',
                unix_creation_time: date.getTime(),
                unix_modified_time: date.getTime()
            });
            // comparator will automatically insert at the beginning
            //console.log('after',window.YYYCollection.at(0).id.unix_creation_time,window.YYYCollection.length);

            window.YYYCollection.at(0).save({},{
                success: function() { 
                    console.log('model save success ' + window.YYYCollection.at(0).id + ' ' + window.YYYCollection.at(0).cid); 
                    that.refresh();
                }
            });
        },
        removeArticle: function(ev) {
            loading();
            console.log('removeArticle');

            var that = this;
            var id = ev.target.id.split('-')[1];

            var date = new Date();
            window.YYYCollection.get(id).set({
                removed: true,
                unix_modified_time: date.getTime()
            });

            window.YYYCollection.get(id).save({},{
                success: function() { 
                    console.log('article remove success ' + window.YYYCollection.get(id).id + ' ' + window.YYYCollection.get(id).cid); 
                    that.refresh();
                } 
            });
        },
        addTextSection: function(ev) {
            loading();

            console.log('addTextSection', YYYCollection.get(_ID).get('sections'));
            var sections = YYYCollection.get(_ID).get('sections');
            if (sections.length) {
                sections.push({
                    id: sections[sections.length-1].id+1,
                    text: '((empty))'
                });
            } else {
                sections.push({
                    id: 0,
                    text: '((empty))'
                });
            }

            var date = new Date();
            YYYCollection.get(_ID).set({
                sections: sections,
                unix_modified_time: date.getTime()
            });

            this.saveArticle();
        },
        addImageSection: function(ev) {
            loading();

            console.log('addImageSection', YYYCollection.get(_ID).get('sections'));
            var sections = YYYCollection.get(_ID).get('sections');
            if (sections.length) {
                sections.push({
                    id: sections[sections.length-1].id+1,
                    image: ''
                });
            } else {
                sections.push({
                    id: 0,
                    image: ''
                });
            }

            var date = new Date();
            YYYCollection.get(_ID).set({
                sections: sections,
                unix_modified_time: date.getTime()
            });

            this.saveArticle();
        },
        addLinkSection: function(ev) {
            loading();

            console.log('addLinkSection', YYYCollection.get(_ID).get('sections'));
            var sections = YYYCollection.get(_ID).get('sections');
            if (sections.length) {
                sections.push({
                    id: sections[sections.length-1].id+1,
                    link: '((empty))',
                    display: '((empty))'
                });
            } else {
                sections.push({
                    id: 0,
                    link: '((empty))',
                    display: '((empty))'
                });
            }

            var date = new Date();
            YYYCollection.get(_ID).set({
                sections: sections,
                unix_modified_time: date.getTime()
            });

            this.saveArticle();
        },
        addVideoSection: function(ev) {
            loading();

            console.log('addVideoSection', YYYCollection.get(_ID).get('sections'));
            var sections = YYYCollection.get(_ID).get('sections');
            if (sections.length) {
                sections.push({
                    id: sections[sections.length-1].id+1,
                    video: '((empty))'
                });
            } else {
                sections.push({
                    id: 0,
                    video: '((empty))'
                });
            }

            var date = new Date();
            YYYCollection.get(_ID).set({
                sections: sections,
                unix_modified_time: date.getTime()
            });

            this.saveArticle();
        },
        addSoundSection: function(ev) {
            loading();

            console.log('addSoundSection', YYYCollection.get(_ID).get('sections'));
            var sections = YYYCollection.get(_ID).get('sections');
            if (sections.length) {
                sections.push({
                    id: sections[sections.length-1].id+1,
                    sound: '((empty))'
                });
            } else {
                sections.push({
                    id: 0,
                    sound: '((empty))'
                });
            }

            var date = new Date();
            YYYCollection.get(_ID).set({
                sections: sections,
                unix_modified_time: date.getTime()
            });

            this.saveArticle();
        },
        removeSection: function(ev) {
            loading();

            var sectionId = parseInt(ev.target.id.split('-')[3]);
            var sections = YYYCollection.get(_ID).get('sections');

            console.log('removeSection', YYYCollection.get(_ID).get('sections'), sectionId);

            for (var i=0;i<sections.length;i++) {
                console.log(sections[i].id,sectionId,sections[i].id === sectionId);
                if (parseInt(sections[i].id) === parseInt(sectionId)) {
                    console.log('splicing',i,'from sections');
                    sections.splice(i,1);
                }
            }

            var date = new Date();
            YYYCollection.get(_ID).set({
                sections: sections,
                unix_modified_time: date.getTime()
            });

            this.saveArticle();
        },
        saveCover: function(ev) {
            loading();

            console.log('saveCover',ev.target.id,id);

            var that = this;
            var id = ev.target.id.split('-')[2];
            var filePicker = $('#update-cover-input-'+id);
            var file = filePicker[0].files[0];
            var name = file.name;
            var type = file.type;

            var date = new Date();
            YYYCollection.get(id).set({
                cover_name:name,
                unix_modified_time: date.getTime()
            });

            YYYCollection.get(id).save({},{
                success: function() { 
                    console.log('cover save success ' + YYYCollection.get(id).id + ' ' + YYYCollection.get(id).cid); 

                    var rev = YYYCollection.get(id).get('_rev');
                    console.log(name,rev,file);

                    $.ajax({
                        url: '/'+_DBNAME+'/'+id+'/'+name+'?rev='+rev,
                        type: 'PUT',
                        data: file,
                        cache: false,
                        contentType: type,
                        processData: false,
                        success: function(data) {
                            console.log('cover image upload success!', filePicker);
                            filePicker.parent().parent().parent().find('.save-cover-button').removeClass('blinking').addClass('invisible');
                            filePicker.parent().parent().parent().find('.link').removeClass('blinking-border');
                            filePicker.parent().parent().parent().find('.thumbnail').removeClass('bordered');
                            filePicker.parent().parent().parent().find('.label').removeClass('bordered');
                            that.refresh(); 
                        },
                        error: function(data) {
                            console.log('cover image upload error!', data);
                        }
                    });
                } 
            });
        },
        saveNewCheck: function(ev) {
            loading();

            console.log('saveNewCheck',window.location.hash);

            var date = new Date();
            YYYCollection.get(_ID).set({
                is_new: $('#new-checkbox').is(':checked'),
                unix_modified_time: date.getTime()
            });

            this.saveArticle();
        },
        saveTitle: function(ev) {
            loading();

            console.log('saveTitle',window.location.hash);

            var date = new Date();
            YYYCollection.get(_ID).set({
                title:$('#edit-title-input').val(),
                unix_modified_time: date.getTime()
            });

            this.saveArticle();
        },
        saveAuthor: function() {
            loading();

            console.log('saveAuthor',window.location.hash);

            var date = new Date();
            YYYCollection.get(_ID).set({
                author:$('#edit-author-input').val(),
                unix_modified_time: date.getTime()
            });

            this.saveArticle();
        },
        saveTextSection: function(ev) {
            loading();

            var sectionId = parseInt(ev.target.id.split('-')[3]);
            var sections = YYYCollection.get(_ID).get('sections');
            console.log('saveTextSection', sectionId);
            console.log(YYYCollection.get(_ID).get('sections')[sectionId]);

            for (var i=0;i<sections.length;i++) {
                if (parseInt(sections[i].id) === parseInt(sectionId)) {
                    sections[i] = {
                        id: sectionId,
                        text: $('#edit-text-input-'+sectionId).val() 
                    };
                }
            }
            console.log(sections);

            var date = new Date();
            YYYCollection.get(_ID).set({
                sections: sections,
                unix_modified_time: date.getTime()
            });

            this.saveArticle();
        },
        saveImageSection: function(ev) {
            loading();

            var sectionId = parseInt(ev.target.id.split('-')[2]);
            var sections = YYYCollection.get(_ID).get('sections');
            var filePicker = $('#change-image-input-'+sectionId);
            var file = filePicker[0].files[0];
            var name = file.name;
            var type = file.type;

            console.log('saveImageSection', sectionId, name);

            for (var i=0;i<sections.length;i++) {
                if (parseInt(sections[i].id) === parseInt(sectionId)) {
                    sections[i] = {
                        id: sectionId,
                        image: name
                    };
                }
            }
            console.log(sections);

            var date = new Date();
            YYYCollection.get(_ID).set({
                sections: sections,
                unix_modified_time: date.getTime()
            });

            var that = this;
            YYYCollection.get(_ID).save({},{
                success: function() { 
                    console.log('image section save success ' + YYYCollection.get(_ID).id + ' ' + YYYCollection.get(_ID).cid); 

                    var rev = YYYCollection.get(_ID).get('_rev');

                    $.ajax({
                        url: '/'+_DBNAME+'/'+_ID+'/'+name+'?rev='+rev,
                        type: 'PUT',
                        data: file,
                        cache: false,
                        contentType: type,
                        processData: false,
                        success: function(data) {
                            console.log('image section upload success!');
                            console.log(data);
                            filePicker.parent().parent().parent().removeClass('bordered-section'); 
                            filePicker.parent().parent().find('.save-image-button').removeClass('blinking').addClass('invisible');
                            filePicker.parent().parent().parent().removeClass('blinking-section-border');
                            that.refresh(); 
                            loadPage();
                        }
                    });
                } 
            });
        },
        saveLinkSection: function(ev) {
            var sectionId = parseInt(ev.target.id.split('-')[3]);
            console.log('saveLinkSection', sectionId);
            console.log(YYYCollection.get(_ID).get('sections')[sectionId]);

            var sections = YYYCollection.get(_ID).get('sections');
            for (var i=0;i<sections.length;i++) {
                if (parseInt(sections[i].id) === parseInt(sectionId)) {
                    sections[i] = {
                        id: sectionId,
                        link: $('#edit-link-input-'+sectionId).val(),
                        display: $('#edit-display-input-'+sectionId).val()
                    };
                }
            }
            console.log(sections);

            var date = new Date();
            YYYCollection.get(_ID).set({
                sections: sections,
                unix_modified_time: date.getTime()
            });

            this.saveArticle();
        },
        saveVideoSection: function(ev) {
            loading();

            var sectionId = parseInt(ev.target.id.split('-')[3]);
            var sections = YYYCollection.get(_ID).get('sections');
            console.log('saveVideoSection', sectionId);
            console.log(YYYCollection.get(_ID).get('sections')[sectionId]);

            for (var i=0;i<sections.length;i++) {
                if (parseInt(sections[i].id) === parseInt(sectionId)) {
                    sections[i] = {
                        id: sectionId,
                        video: $('#edit-video-input-'+sectionId).val() 
                    };
                }
            }
            console.log(sections);

            var date = new Date();
            YYYCollection.get(_ID).set({
                sections: sections,
                unix_modified_time: date.getTime()
            });

            this.saveArticle();
        },
        saveSoundSection: function(ev) {
            loading();

            var sectionId = parseInt(ev.target.id.split('-')[3]);
            var sections = YYYCollection.get(_ID).get('sections');
            console.log('saveSoundSection', sectionId);
            console.log(YYYCollection.get(_ID).get('sections')[sectionId]);

            for (var i=0;i<sections.length;i++) {
                if (parseInt(sections[i].id) === parseInt(sectionId)) {
                    sections[i] = {
                        id: sectionId,
                        sound: $('#edit-sound-input-'+sectionId).val() 
                    };
                }
            }
            console.log(sections);

            var date = new Date();
            YYYCollection.get(_ID).set({
                sections: sections,
                unix_modified_time: date.getTime()
            });

            this.saveArticle();
        },
        saveArticle: function() {
            YYYCollection.get(_ID).save({},{
                success: function() { 
                    console.log('article update success ' + YYYCollection.get(_ID).id + ' ' + YYYCollection.get(_ID).cid); 
                    loadPage();
                } 
            });
        }
    });
    window.AllView = new YYYViewClass({ el: $('#app-content') });
});

