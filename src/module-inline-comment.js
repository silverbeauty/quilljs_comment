let Inline = Quill.import('blots/inline');

class CommentBlot extends Inline {
    static create(commentText) {
        
        const node = super.create();
        node.dataset.create_id = quill.getModule('toolbar').options.container[13][0].comment.creator_id
        node.dataset.create_name = quill.getModule('toolbar').options.container[13][0].comment.creator_name
        node.dataset.create_email = quill.getModule('toolbar').options.container[13][0].comment.creator_email
        node.dataset.comment = commentText.comment;
        node.dataset.suggestion = commentText.suggestion;

        if (commentText.id) {
            node.dataset.id = commentText.id;
        }
        if (commentText.resolved) {
            node.dataset.resolved = commentText.resolved;
        }
           
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
        console.log( this.toolbar.options.container[13][0].comment.creator_id );
        if (typeof this.toolbar != 'undefined')
            this.toolbar.addHandler('comment', this.commentEventHanlder);

        var commentBtns = document.getElementsByClassName('ql-comment');
        if (commentBtns) {
            [].slice.call( commentBtns ).forEach(function ( commentBtn ) {
                commentBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="16" viewBox="0 0 18 16"><g fill="none" fill-rule="evenodd"><path fill="#444" fill-rule="nonzero" d="M9.92 11H13c1.66 0 3-1.36 3-3V5c0-1.66-1.34-3-3-3H5C3.34 2 2 3.34 2 5v3c0 1.64 1.34 3 3 3h1.44l.63 1.88 2.85-1.9zM5 0h8c2.76 0 5 2.24 5 5v3c0 2.75-2.24 5-5 5h-2.47L7.1 15.26c-.47.3-1.1.2-1.4-.27-.05-.1-.08-.18-.1-.26L5 13c-2.76 0-5-2.25-5-5V5c0-2.76 2.24-5 5-5z"/><path stroke="#444" stroke-width="2" d="M5.37 5H13M5.37 8H10" stroke-linecap="round" stroke-linejoin="round"/></g></svg>';
            });
        };
    }

    commentEventHanlder() {
        let quill = this.quill;
        checkDialogExist(quill);
    }
}

function checkDialogExist(quill){

    let commentToolTip = document.getElementById("inline-comment");
    let commentMask = document.getElementById("inline-comment-mask");
    if (commentToolTip) {
        commentToolTip.remove();
        if( commentMask ){
            commentMask.remove();
        }
        createCommentDialog(quill);
    }
    else{
        createCommentDialog(quill);
    }
}

function createCommentDialog(quill) {

    var range = quill.getSelection();
    var text;
    if (range) {
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
    } else {
      console.log('User cursor is not in editor');
      return;
    }
    
    if( text == "" ){
        return;
    }

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
    
    let role = "editor";
    let dlgStatement;
    let editor_comment = "";
    let editor_suggestion = "";

    var jsonstring = JSON.stringify(quill.editor.getDelta());
    var jsonobject = JSON.parse(jsonstring);

    for( var i = 0; i < jsonobject.ops.length; i++ ){
        if( jsonobject.ops[i].insert == text ){
            editor_comment = jsonobject.ops[i].attributes.comment.comment;
            editor_suggestion = jsonobject.ops[i].attributes.comment.suggestion;
            break;
        }
    }

    var scomment = editor_comment.replace(/ /g, "&nbsp;");
    var ssugesstion = editor_suggestion.replace(/ /g, "&nbsp;");

    if( role == "author" ){
        dlgStatement = '<div class="author" id="author">';
        dlgStatement += '<div class="container">';
        dlgStatement += '<div class="jumbotron">';
        dlgStatement += '<table class="table table-borderless">';
        dlgStatement += '<form class="author-form-group">';
        dlgStatement += '<div class="author-form-group">';
        dlgStatement += '&nbsp;&nbsp;';
        dlgStatement += '<label class="control-label" id="author_id">John Doe commented:</label>';
        dlgStatement += '</div><br><br><br>';
        dlgStatement += '<div>';
        dlgStatement += '&nbsp;&nbsp;';
        dlgStatement += '<input type="textarea" class="form-control" id="author_comment" name="author_comment" value=' + scomment + '>';
        dlgStatement += '</div><br>';
        dlgStatement += '<div class="author-form-group">';
        dlgStatement += '&nbsp;&nbsp;';
        dlgStatement += '<label class="control-label" id="comment_label">Hey suggested to replace the selected text with:</label>';
        dlgStatement += '</div><br><div>';
        dlgStatement += '&nbsp;&nbsp;';
        dlgStatement += '<input type="textarea" class="form-control" id="author_suggestion" name="author_suggestion" value=' + ssugesstion + '>';
        dlgStatement += '</div><br><div class="author-form-group">';
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
        dlgStatement += '</div><br><br><div>&nbsp;&nbsp;';
        dlgStatement += '<label class="control-label">Suggestion:&nbsp;&nbsp;&nbsp;&nbsp;</label>';
        dlgStatement += '&nbsp;&nbsp;';
        dlgStatement += '<input type="textarea" class="editor_suggestion" id="editor_suggestion" name="editor_suggestion" value=' + ssugesstion + '>';
        dlgStatement += '</div><br><br><div class="editor-form-group">&nbsp;&nbsp;';
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

    let editor_cancel = document.getElementById("editor_cancel");
    let editor_save = document.getElementById("editor_save");
    let editor_reset = document.getElementById("editor_reset");
    let editor_form = document.getElementById("editor");


    if( editor_cancel ){
        editor_cancel.addEventListener('click',function(){
            editor_form.style.display    = "none";
            container.style.display = "none";
            containerMask.style.display     = "none";
        }, false);
    }
 
    if( editor_reset ){
        editor_reset.addEventListener('click', function(){
            document.getElementById("editor_comment").value = "";
            document.getElementById("editor_suggestion").value = "";
        }, false);
    }


    if( editor_save ){
        editor_save.addEventListener('click',function(){

            let editor_comment = {};

            let commentText = document.getElementById("editor_comment").value;
            editor_comment.comment = commentText;
            editor_comment.suggestion = document.getElementById("editor_suggestion").value;

            editor_form.style.display = "none";
            container.style.display = "none";
            containerMask.style.display = "none";

            quill.format('comment', editor_comment);      
            
        }, false);
    
    }

    //author
    let author_cancel = document.getElementById("author_cancel");
    let author_reject = document.getElementById("author_reject");
    let author_accept = document.getElementById("author_accept");
    let author_form = document.getElementById("author");

    if( author_cancel ){
        author_cancel.addEventListener('click', function(){
            author_form.style.display    = "none";
            container.style.display = "none";
            containerMask.style.display     = "none";
        }, false);
    }

    if( author_reject ){
        author_reject.addEventListener('click', function(){
            document.getElementById("author_comment").value = "";
            document.getElementById("author_suggestion").value = "";
        }, false);
    }

    if( author_accept ){
        author_accept.addEventListener('click',function(){

            let author_comment = {};

            let commentText = document.getElementById("author_comment").value;
            author_comment.comment = commentText;
            author_comment.suggestion = document.getElementById("author_suggestion").value;

            author_form.style.display = "none";
            container.style.display = "none";
            containerMask.style.display = "none";

            quill.format('comment', author_comment);
        }, false);
    }

}

Quill.register('modules/inline_comment', InlineComment);
