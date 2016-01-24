var con = function (fun) {
    var obj = {};
    obj.render = fun;
    return obj;
};

//var CommentBox = React.createClass({
//    render : function(){
//        return (
//            <div class="commentBox">
//                Hello, I'm a comment box.
//            </div>
//        )
//    }
//});