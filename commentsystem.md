# Overall idea of the comment system app

The app implements a simple comment system for my blog. This blog is just web pages hosted on neocities.org. Features from a user perspective:

1. a user reading a blog entry sees a section below the blog entry that contains either "no comments so far" or a list of comments by other users, separated by horizontal rulers. Above these he sees a button "add comment". If he presses it, two text boxes appear: a single one to enter a name, a multi-line one to enter text. Additionally an okay button. After clicking on the okay button, the text fields incl. "add comment" button will be replaced by a label that says "your comment will be visible after moderation; this can take up to 7 days."

2. a moderator gets a special URL where he needs to sign in with a password. Then he sees a list of all recent comments waiting for moderation. He sees the user names and the texts. Next to each entry he sees a "trashcan" symbol. If he presses it, the comment is deleted after confirming an alert "do you really...". Below this list there is a simple button saying "release all comments". If you press it, the comments are released so that afterwards users will see it in the list.

# Architecture

The app consists of a front-end and a back-end.

## Front-end

The new comment system must be easy to integrate into existing blog entries; ideally with a single <script> call. It shall be implemented in pure JavaScript with as few as possible dependencies. I am unsure how to deal with the styling - ideally it should fit to the styling of the blog but still have its own CSS entries. 

## Back-end

The backend shall be a simple node.js app with these endpoints

### Endpoints

1. addComment: add a comment for review - parameters: user, blogEntryId, comment. Will add the comment to the database for review.
2. showComments: shows all comments - parameters: role=moderator/viewer , blogEntryId. Will return a list of ( commentId, user, comment }. If the role is viewer, then only released comments will be returned. If the role is moderator, then only unreleased comments will be returned.
3. deleteComment: deletes a comment - parameters: commentId
4. releaseComments: releases all comments - parameters: blogEntryId. Will release all non-released comments for this blog entry.

### Database design

The backend shall use a simple sql database using SQLite or similar. We need a single table with these columns:

* commentId - a global counter for ids. A comment can be identified by this id. Index. Comments are returned sorted by this id.
* blogEntryId - the blog entry it belongs to
* name - the user name for the comment
* text - the text of the comment
* released - Boolean whether the comment has been reviewed yet and is released for display.

### Authentication

I am the sole moderator of my blog; this is not intended to be software for anyone else. Therefore there is no need for a user. Create a simple authentication mechanism with an endpoint to pass a password that is then checked against a simple hash or encrypted password stored in an .env file. The endpoints deleteComment and releaseComment require authentification. 

I am unsure whether it is advantageous if only users of the web UI can use the endpoints.

### Security

This app requires strong protection against malicious attacks:
- all input in the user and comment text fields must be checked for malicious JS code injection with the standard technique.
- protection against calling the endpoints too frequently, adding too many comments per time unit must be taken.

### Other considerations

As neocities only hosts pure HTML files, the node.js shall run on a separate server,  srv706843.hstgr.cloud on port 3003.
