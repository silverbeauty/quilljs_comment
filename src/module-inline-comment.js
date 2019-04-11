let Inline = Quill.import('blots/inline');

class CommentBlot extends Inline {
    static create(commentText) {
        
        const node = super.create();

        if( commentText.comment != '' || commentText.suggestion != '' ){

            node.dataset.create_id = quill.getModule('toolbar').options.comment[0].create_id
            node.dataset.create_name = quill.getModule('toolbar').options.comment[0].create_name
            node.dataset.create_email = quill.getModule('toolbar').options.comment[0].create_email
            node.dataset.comment = commentText.comment;
            node.dataset.suggestion = commentText.suggestion;

            if (commentText.id) {
                node.dataset.id = commentText.id;
            }
            if (commentText.resolved) {
                node.dataset.resolved = commentText.resolved;
            }
        }

        node.addEventListener('click', function(e) {

            var range = quill.getSelection();
            var text;
            if (range.length == 0) {
                if( quill.getLength() != 0 ){
                    var curPos = range.index;
                    text = quill.getText(0, quill.getLength()-1);
                    var words = text.split(" ");
                    var numWords = words.length;
                    var wordLength = 0;
                    var inPos = 0;
                    var outPos = 0;
                    var i;
                    for (i = 0; i < numWords; i++) {              
                        wordLength += words[i].length; 
                        if( wordLength + i > curPos ){
                            inPos = wordLength - words[i].length + i;
                            outPos = words[i].length;
                            break;
                        }
                        
                    }
                }
        
                quill.setSelection( inPos, outPos );
                range = quill.getSelection();
                text = quill.getText(range.index, range.length);
        
            } else {
                text = quill.getText(range.index, range.length);
            }
        
            var dlgStatement;
            var editor_comment = "";
            var editor_suggestion = "";
        
            for( var i = 0; i < quill.editor.getDelta().ops.length; i++ ){
                if( quill.editor.getDelta().ops[i].insert == text ){
                    if( quill.editor.getDelta().ops[i].attributes ){
                        editor_comment = quill.editor.getDelta().ops[i].attributes.comment.comment;
                        editor_suggestion = quill.editor.getDelta().ops[i].attributes.comment.suggestion;
                        break;
                    }
                }
            }
        
            if( editor_comment != '' || editor_suggestion !='' ){
            
                const atSignBounds = quill.getBounds(range.index);
                let containerMask = document.createElement('div');
                containerMask.id="inline-comment-mask";
                containerMask.style.width   = "100%";
                containerMask.style.height   = "100%";
                containerMask.style.top   = "0px";
                containerMask.style.position   = "fixed";
                containerMask.style.display   = "block";
            
                let container  = document.createElement('div');
                container.id =  'inline-comment';
                container.classList.add('inline-comment');
                quill.container.appendChild(container);
                quill.container.appendChild(containerMask);
                container.style.position   = "absolute";
                
                dlgStatement = '<div class id = "popeditcomment" name = "popeditcomment"></div>';
                dlgStatement += '<button id="ql-edit_comment" name = "ql-edit_comment" style="width: 28px;height: 29px;padding-left: 1px;padding-right: 1px;border-left-width: 2px;border-right-width: 2px;border-bottom-width: 2px;border-top-width: 2px;">';
                dlgStatement +=  '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 511.626 511.627" style="enable-background:new 0 0 511.626 511.627; width: 20px;height: 20px;" xml:space="preserve"><g><path d="M477.364,127.481c-22.839-28.072-53.864-50.248-93.072-66.522c-39.208-16.274-82.036-24.41-128.479-24.41   c-46.442,0-89.269,8.136-128.478,24.41c-39.209,16.274-70.233,38.446-93.074,66.522C11.419,155.555,0,186.15,0,219.269   c0,28.549,8.61,55.299,25.837,80.232c17.227,24.934,40.778,45.874,70.664,62.813c-2.096,7.611-4.57,14.842-7.426,21.7   c-2.855,6.851-5.424,12.467-7.708,16.847c-2.286,4.374-5.376,9.23-9.281,14.555c-3.899,5.332-6.849,9.093-8.848,11.283   c-1.997,2.19-5.28,5.801-9.851,10.848c-4.565,5.041-7.517,8.33-8.848,9.853c-0.193,0.097-0.953,0.948-2.285,2.574   c-1.331,1.615-1.999,2.419-1.999,2.419l-1.713,2.57c-0.953,1.42-1.381,2.327-1.287,2.703c0.096,0.384-0.094,1.335-0.57,2.854   c-0.477,1.526-0.428,2.669,0.142,3.429v0.287c0.762,3.234,2.283,5.853,4.567,7.851c2.284,1.992,4.858,2.991,7.71,2.991h1.429   c12.375-1.526,23.223-3.613,32.548-6.279c49.87-12.751,93.649-35.782,131.334-69.094c14.274,1.523,28.074,2.283,41.396,2.283   c46.442,0,89.271-8.135,128.479-24.414c39.208-16.276,70.233-38.444,93.072-66.517c22.843-28.072,34.263-58.67,34.263-91.789   C511.626,186.154,500.207,155.555,477.364,127.481z M445.244,292.075c-19.896,22.456-46.733,40.303-80.517,53.529   c-33.784,13.223-70.093,19.842-108.921,19.842c-11.609,0-23.98-0.76-37.113-2.286l-16.274-1.708l-12.277,10.852   c-23.408,20.558-49.582,36.829-78.513,48.821c8.754-15.414,15.416-31.785,19.986-49.102l7.708-27.412l-24.838-14.27   c-24.744-14.093-43.918-30.793-57.53-50.114c-13.61-19.315-20.412-39.638-20.412-60.954c0-26.077,9.945-50.343,29.834-72.803   c19.895-22.458,46.729-40.303,80.515-53.531c33.786-13.229,70.089-19.849,108.92-19.849c38.828,0,75.13,6.617,108.914,19.845   c33.783,13.229,60.62,31.073,80.517,53.531c19.89,22.46,29.834,46.727,29.834,72.802S465.133,269.615,445.244,292.075z"/></g></svg>';
                dlgStatement += '</button>';
                dlgStatement += '</div>'

                container.innerHTML = dlgStatement;

                // container.style.top = e.clientY + "px";
                // container.style.left = (atSignBounds.left - 250)+ "px";

                // if (atSignBounds.left + 250 < quill.container.clientWidth) {
                //     container.style.left = (atSignBounds.left + 50)+ "px";
                // }

                container.style.left = window.event.clientX + document.body.scrollLeft - document.querySelector('.container').offsetLeft;
                container.style.top = atSignBounds.top + document.body.scrollTop - 30 - document.querySelector('.container').offsetTop + "px";
                container.style.zIndex = 80;

                var btnEditComment = document.getElementById('ql-edit_comment')

                if(btnEditComment){

                    btnEditComment.addEventListener('click', responseClick)

                    function responseClick(){
                        checkDialogExist(quill, 'edit')
                        btnEditComment.style.display = "none"
                        containerMask.style.display = "none"
                        container.style.display = "none"
                        return false;
                    }

                    btnEditComment.addEventListener('mouseleave', responseMouseleave)

                    function responseMouseleave(){
                        btnEditComment.style.display = "none"
                        container.style.display = "none"
                        containerMask.style.display = "none"
                        btnEditComment.remove()
                        container.remove()
                        containerMask.remove()
                        return false;
                    }

                }

            }
        }, false)

        return node;
    }
    
    static formats(node) {
        return node.dataset;
    }
    format(name, value) {
        super.format(name, value);
    }
}

CommentBlot.blotName = "comment";
CommentBlot.tagName = "SPAN";
CommentBlot.className = "annotation";

Quill.register({
    'formats/comment': CommentBlot
});


class GrammlyBlot extends Inline {
    static create(commentText) {

        const node = super.create();

        return node;
    }
    
    static formats(node) {
        return node.dataset;
    }
    format(name, value) {
        super.format(name, value);
    }
}

GrammlyBlot.blotName = "grammer";
GrammlyBlot.tagName = "SPAN";
GrammlyBlot.className = "gr_";

Quill.register({
    'formats/grammer': GrammlyBlot
});

class InlineComment {
    constructor(quill){
        quill = quill;
        this.quill = quill;
        this.toolbar = quill.getModule('toolbar');
        if (typeof this.toolbar != 'undefined'){
            this.toolbar.addHandler('comment', this.commentEventHanlder);
        }

        var commentBtns = document.getElementsByClassName('ql-comment');

        if (commentBtns) {
            [].slice.call( commentBtns ).forEach(function ( commentBtn ) {
                commentBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="16" viewBox="0 0 18 16"><g fill="none" fill-rule="evenodd"><path fill="#444" fill-rule="nonzero" d="M9.92 11H13c1.66 0 3-1.36 3-3V5c0-1.66-1.34-3-3-3H5C3.34 2 2 3.34 2 5v3c0 1.64 1.34 3 3 3h1.44l.63 1.88 2.85-1.9zM5 0h8c2.76 0 5 2.24 5 5v3c0 2.75-2.24 5-5 5h-2.47L7.1 15.26c-.47.3-1.1.2-1.4-.27-.05-.1-.08-.18-.1-.26L5 13c-2.76 0-5-2.25-5-5V5c0-2.76 2.24-5 5-5z"/><path stroke="#444" stroke-width="2" d="M5.37 5H13M5.37 8H10" stroke-linecap="round" stroke-linejoin="round"/></g></svg>';
            });
        };

    }

    commentEventHanlder() {
        let quill = this.quill;
        checkDialogExist(quill, 'add');
    }
}

function checkDialogExist(quill, mode){

    let commentToolTip = document.getElementById("inline-comment");
    let commentMask = document.getElementById("inline-comment-mask");
    if (commentToolTip) {
        commentToolTip.remove();
        if( commentMask ){
            commentMask.remove();
        }
        createCommentDialog(quill, mode);
    }
    else{
        createCommentDialog(quill, mode);
    }
}



function createCommentDialog(quill, mode) {

    var range = quill.getSelection();
    var text;
    if (range.length == 0) {
        if( quill.getLength() != 0 ){
            var curPos = range.index;
            text = quill.getText(0, quill.getLength()-1);
            var words = text.split(" ");
            var numWords = words.length;
            var wordLength = 0;
            var inPos = 0;
            var outPos = 0;
            var i;
            for (i = 0; i < numWords; i++) {              
                wordLength += words[i].length; 
                if( wordLength + i > curPos ){
                    inPos = wordLength - words[i].length + i;
                    outPos = words[i].length;
                    break;
                }
                
            }
        }

        quill.setSelection( inPos, outPos );
        range = quill.getSelection();
        text = quill.getText(range.index, range.length);

    } else {
        text = quill.getText(range.index, range.length);
    }

    var role = quill.getModule('toolbar').options.comment[0].privilege;
    var dlgStatement;
    var editor_comment = "";
    var editor_suggestion = "";

    for( var i = 0; i < quill.editor.getDelta().ops.length; i++ ){
        if( quill.editor.getDelta().ops[i].insert == text ){
            if( quill.editor.getDelta().ops[i].attributes ){
                editor_comment = quill.editor.getDelta().ops[i].attributes.comment.comment;
                editor_suggestion = quill.editor.getDelta().ops[i].attributes.comment.suggestion;
                break;
            }
        }
    }

    if( editor_comment =='' && editor_suggestion == '' && mode == 'edit' ){
        // quill.setSelection(0,0);
        return;
    }

    if( ( editor_comment != '' || editor_suggestion !='' ) && mode == 'add' ){
        return;
    }

    var scomment = editor_comment.replace(/ /g, "&nbsp;");
    var ssugesstion = editor_suggestion.replace(/ /g, "&nbsp;");

    const atSignBounds = quill.getBounds(range.index);
    let containerMask = document.createElement('div');
    containerMask.id="inline-comment-mask";
    containerMask.style.width   = "100%";
    containerMask.style.height   = "100%";
    containerMask.style.top   = "0px";
    containerMask.style.position   = "fixed";
    containerMask.style.display   = "block";

    let container  = document.createElement('div');
    container.id =  'inline-comment';
    container.classList.add('inline-comment');
    quill.container.appendChild(container);
    quill.container.appendChild(containerMask);
    container.style.position   = "absolute";

    if( role == "author" ){
        dlgStatement = '<div class="author" id="author">';
        dlgStatement += '<div class="container">';
        dlgStatement += '<div class="jumbotron">';
        dlgStatement += '<table class="table table-borderless">';
        dlgStatement += '<form class="author-form-group">';
        dlgStatement += '<div class="author-form-group">';
        dlgStatement += '&nbsp;&nbsp;';
        dlgStatement += '<label class="control-label" id="author_id">John Doe commented:</label>';
        dlgStatement += '</div>';
        dlgStatement += '<div>';
        dlgStatement += '&nbsp;&nbsp;';
        dlgStatement += '<input type="textarea" class="form-control" id="author_comment" name="author_comment" value=' + scomment + '>';
        dlgStatement += '</div>';
        dlgStatement += '<div class="author-form-group">';
        dlgStatement += '&nbsp;&nbsp;';
        dlgStatement += '<label class="control-label" id="comment_label">Hey suggested to replace the selected text with:</label>';
        dlgStatement += '</div><div>';
        dlgStatement += '&nbsp;&nbsp;';
        dlgStatement += '<input type="textarea" class="form-control" id="author_suggestion" name="author_suggestion" value=' + ssugesstion + '>';
        dlgStatement += '</div><div class="author-form-group">';
        dlgStatement += '&nbsp;&nbsp;';
        dlgStatement += '<div class="row">';
        dlgStatement += '<div class="col-sm-3">';
        dlgStatement += '<button type="button" class="btn btn-secondary" id="author_cancel">Cancel</button>';
        dlgStatement += '</div><div>';
        dlgStatement += '<button type="button" class="btn btn-secondary" id="author_reject">Reject suggestion</button>';
        dlgStatement += '</div>&nbsp;&nbsp;<div>';
        dlgStatement += '<button type="button" class="btn btn-secondary" id="author_accept">Accept suggestion</button>';
        dlgStatement += '</div></div></div></form></table></div></div></div>';
    }
    else if(role == "editor"){
        
        dlgStatement = '<div class="editor" id="editor"><div class="container"><div class="jumbotron">';
        dlgStatement += '<form class="editor-form-group" id="editor_form"><div>&nbsp;&nbsp;';
        dlgStatement += '<label class="control-label">Add comment:</label>';
        dlgStatement += '&nbsp;&nbsp;';
        dlgStatement += '<input type="text" class="editor_comment" id="editor_comment" name="editor_comment" value=' + scomment + '>';
        dlgStatement += '</div><div>&nbsp;&nbsp;';
        dlgStatement += '<label class="control-label">Suggestion:&nbsp;&nbsp;&nbsp;&nbsp;</label>';
        dlgStatement += '&nbsp;&nbsp;';
        dlgStatement += '<input type="textarea" class="editor_suggestion" id="editor_suggestion" name="editor_suggestion" value=' + ssugesstion + '>';
        dlgStatement += '</div><div class="editor-form-group">&nbsp;&nbsp;';
        dlgStatement += '<div class="row">';
        dlgStatement += '<div class="col-sm-5">';
        dlgStatement += '<button type="button" class="btn btn-secondary" id="editor_cancel">Cancel</button>';
        dlgStatement += '</div><div class="col-sm-3">';
        dlgStatement += '<button type="button" class="btn btn-secondary" id="editor_reset">Delete</button>';
        dlgStatement += '</div>&nbsp;&nbsp;<div class="col-sm-1">';
        dlgStatement += '<button type="button" class="btn btn-secondary" id="editor_save">Save</button>';
        dlgStatement += '</div></div></div></form></div></div></div>';

    }

    container.innerHTML = dlgStatement;


    container.style.left = (atSignBounds.left - 250)+ "px";

    if (atSignBounds.left + 250 < quill.container.clientWidth) {
        container.style.left = (atSignBounds.left)+ "px";
    }

    container.style.top = 10 + atSignBounds.top + atSignBounds.height + "px";
    container.style.zIndex = 80;

    if( role=="author"){
        document.querySelector('.author').focus();
    }
    else{
        document.querySelector('.editor').focus();
    }

    var editor_cancel = document.getElementById("editor_cancel");
    var editor_save = document.getElementById("editor_save");
    var editor_reset = document.getElementById("editor_reset");
    var editor_form = document.getElementById("editor");


    if( editor_cancel ){
        editor_cancel.addEventListener('click', function(){
            editor_form.style.display    = "none";
            container.style.display = "none";
            containerMask.style.display     = "none";
            editor_cancel.remove;
            editor_reset.remove;
            editor_save.remove;
            editor_form.remove;
        }, false);
    }
 
    if( editor_reset ){
        editor_reset.addEventListener('click', function(){
            document.getElementById("editor_comment").value = "";
            document.getElementById("editor_suggestion").value = "";

            editor_form.style.display = "none";
            container.style.display = "none";
            containerMask.style.display = "none"; 

            for( var i = 0;  i < quill.editor.getDelta().ops.length; i++ ){
                var range = quill.getSelection();
                var kind;
                kind = quill.getText(range.index, range.length);
                if( quill.editor.getDelta().ops[i] ){
                    if( quill.editor.getDelta().ops[i].insert == kind ){
                        delete quill.editor.getDelta().ops[i].attributes
                        var mystring = quill.root.innerHTML
                        var element = $(mystring);//convert string to JQuery element
                        // element.find("span").each(function(index) {
                        //     if( $(this).text() == kind ){
                        //         $(this).replaceWith(text);
                        //     }
                        // });
                        // if( element[0] ){
                        //     quill.root.innerHTML = element[0].outerHTML
                        // }
                        delete quill.format('comment')
                        delete quill.selection.getNativeRange().start.node;
                        editor_cancel.remove;
                        editor_reset.remove;
                        editor_save.remove;
                        editor_form.remove;
                    }
                }
            }

        }, false);
    }


    if( editor_save ){

        editor_save.addEventListener('click',function(){

            var editor_comment = {};

            var commentText = document.getElementById("editor_comment").value;
            editor_comment.comment = commentText;
            editor_comment.suggestion = document.getElementById("editor_suggestion").value;

            editor_form.style.display = "none";
            container.style.display = "none";
            containerMask.style.display = "none"; 

            if( editor_comment.comment == '' && editor_comment.suggestion == '' ){
                for( var i = 0;  i < quill.editor.getDelta().ops.length; i++ ){
                    var range = quill.getSelection();
                    var kind;
                    kind = quill.getText(range.index, range.length);
                    if( quill.editor.getDelta().ops[i] ){
                        if( quill.editor.getDelta().ops[i].insert == kind ){
                            delete quill.editor.getDelta().ops[i].attributes
                            var mystring = quill.root.innerHTML
                            var element = $(mystring);//convert string to JQuery element
                            // element.find("span").each(function(index) {
                            //     if( $(this).text() == kind ){
                            //         $(this).replaceWith(text);
                            //     }
                            // });
                            // if( element[0] ){
                            //     quill.root.innerHTML = element[0].outerHTML
                            // }
                            delete quill.format('comment')
                            delete quill.selection.getNativeRange().start.node;
                            editor_cancel.remove;
                            editor_reset.remove;
                            editor_save.remove;
                            editor_form.remove;
                        }
                    }
                }
            }else{
                quill.format('comment', editor_comment);
            }

            editor_cancel.remove;
            editor_reset.remove;
            editor_save.remove;
            editor_form.remove;
            
        }, false);
    
    }

    //author
    var author_cancel = document.getElementById("author_cancel");
    var author_reject = document.getElementById("author_reject");
    var author_accept = document.getElementById("author_accept");
    var author_form = document.getElementById("author");

    if( author_cancel ){
        author_cancel.addEventListener('click', function(){
            author_form.style.display    = "none";
            container.style.display = "none";
            containerMask.style.display     = "none";
            author_cancel.remove;
            author_reject.remove;
            author_accept.remove;
            author_form.remove;
        }, false);
    }

    if( author_reject ){
        author_reject.addEventListener('click', function(){
            document.getElementById("author_comment").value = "";
            document.getElementById("author_suggestion").value = "";

            author_form.style.display = "none";
            container.style.display = "none";
            containerMask.style.display = "none";

            for( var i = 0;  i < quill.editor.getDelta().ops.length; i++ ){
                var range = quill.getSelection();
                var kind;
                kind = quill.getText(range.index, range.length);
                if( quill.editor.getDelta().ops[i] ){
                    if( quill.editor.getDelta().ops[i].insert == kind ){
                        delete quill.editor.getDelta().ops[i].attributes
                        var mystring = quill.root.innerHTML
                        var element = $(mystring);//convert string to JQuery element
                        // element.find("span").each(function(index) {
                        //     if( $(this).text() == kind ){
                        //         $(this).replaceWith(text);
                        //     }
                        // });
                        // if( element[0] ){
                        //     quill.root.innerHTML = element[0].outerHTML
                        // }
                        delete quill.format('comment')
                        delete quill.selection.getNativeRange().start.node;
                        author_cancel.remove;
                        author_reject.remove;
                        author_accept.remove;
                        author_form.remove;
                    }
                }
            }

        }, false);
    }

    if( author_accept ){
        author_accept.addEventListener('click',function(){

            var author_comment = {};

            var commentText = document.getElementById("author_comment").value;
            author_comment.comment = commentText;
            author_comment.suggestion = document.getElementById("author_suggestion").value;

            author_form.style.display = "none";
            container.style.display = "none";
            containerMask.style.display = "none";

            if( author_comment.comment == '' && author_comment.suggestion == '' ){
                for( var i = 0;  i < quill.editor.getDelta().ops.length; i++ ){
                    var range = quill.getSelection();
                    var kind;
                    kind = quill.getText(range.index, range.length);
                    if( quill.editor.getDelta().ops[i] ){
                        if( quill.editor.getDelta().ops[i].insert == kind ){
                            delete quill.editor.getDelta().ops[i].attributes
                            var mystring = quill.root.innerHTML
                            var element = $(mystring);//convert string to JQuery element
                            // element.find("span").each(function(index) {
                            //     if( $(this).text() == kind ){
                            //         $(this).replaceWith(text);
                            //     }
                            // });
                            // if( element[0] ){
                            //     quill.root.innerHTML = element[0].outerHTML
                            // }
                            delete quill.format('comment')
                            delete quill.selection.getNativeRange().start.node;
                            author_cancel.remove;
                            author_reject.remove;
                            author_accept.remove;
                            author_form.remove;
                        }
                    }
                }
            }else{
                quill.format('comment', editor_comment);
            }
            quill.format('comment', author_comment);
            author_cancel.remove;
            author_reject.remove;
            author_accept.remove;
            author_form.remove;
        }, false);
    }

}

Quill.register('modules/inline_comment', InlineComment);
