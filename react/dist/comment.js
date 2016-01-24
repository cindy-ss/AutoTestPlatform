var CommentBox = React.createClass({
    displayName: "CommentBox",

    render: function () {
        return React.createElement(
            "div",
            { "class": "commentBox" },
            React.createElement(
                "h1",
                null,
                "Comments"
            ),
            React.createElement(CommentList, { data: this.props.data }),
            React.createElement(CommentForm, null)
        );
    }
});

var CommentList = React.createClass({
    displayName: "CommentList",

    render: function () {
        var commentsNode = this.props.data.map(function (comment) {
            return React.createElement(
                Comment,
                { author: comment.author, key: comment.id },
                comment.text
            );
        });
        return React.createElement(
            "div",
            { "class": "commentList" },
            commentsNode
        );
    }
});

var CommentForm = React.createClass({
    displayName: "CommentForm",

    render: function () {
        return React.createElement(
            "div",
            { "class": "commentForm" },
            "Hello, I'm a comment form."
        );
    }
});

var Comment = React.createClass({
    displayName: "Comment",

    render: function () {
        return React.createElement(
            "div",
            { "class": "comment" },
            React.createElement(
                "h2",
                { "class": "commentAuthor" },
                this.props.author
            ),
            this.props.children
        );
    }
});

var data = [{ id: 1, author: "Fuck", text: "Fuck you!" }, { id: 2, author: "Test", text: "Test!" }];

ReactDOM.render(React.createElement(CommentBox, { data: data }), document.getElementById("content"));