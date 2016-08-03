var CommentBox = React.createClass({
    render : function(){
        return (
            <div class="commentBox">
                <h1>Comments</h1>
                <CommentList data={this.props.data} />
                <CommentForm />
            </div>
        )
    }
});

var CommentList = React.createClass({
    render : function(){
        var commentsNode = this.props.data.map(function(comment){
            return (
                <Comment author={comment.author} key={comment.id}>
                    {comment.text}
                </Comment>
            );
        });
        return(
            <div class="commentList">
                {commentsNode}
            </div>
        )
    }
});

var CommentForm = React.createClass({
    render : function(){
        return(
            <div class="commentForm">
                Hello, I'm a comment form.
            </div>
        )
    }
});

var Comment = React.createClass({
    render : function(){
        return(
            <div class="comment">
                <h2 class="commentAuthor">
                    {this.props.author}
                </h2>
                {this.props.children}
            </div>
        )
    }
});

var data = [
    {id: 1, author: "Fuck", text: "Fuck you!"},
    {id: 2, author: "Test", text: "Test!"}
];

ReactDOM.render(
    <CommentBox data={data} />,
    document.getElementById("content")
);