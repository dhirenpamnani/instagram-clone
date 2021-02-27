import React, { useState, useEffect } from 'react';
import './Post.css';
import Avatar from "@material-ui/core/Avatar";
import { db } from '../firebase';
import firebase from 'firebase';

function Post({ postId, signedInUser, username, caption, imageUrl}) {

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(()=>{
        let unsubscribe;
        if (postId){
            unsubscribe = db.collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()));
            });

        }

        return () => {
            unsubscribe();
        }
    }, [postId] );

    const postComment = (event) => {
        event.preventDefault();

        db.collection('posts').doc(postId)
        .collection('comments').add({
            text:comment,
            username:signedInUser.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
    }

    return (
        <div className="post">
        {/* header - avatar + name */}
            <div className="post_header">
                <Avatar
                className="post_avatar"
                alt="Dhiren"
                src="test.jpg"    
                />
                <h3>{username}</h3>
                
            </div>

            {/* image */}
            <img className="post_image" alt="loading .."src={imageUrl}></img>

            {/* username + caption */}
            <h4 className="post_text"><strong>{username} </strong>{caption}</h4>

            {/* display comments */}
            <div className="post_comments">
            {comments.map((comment) => (
                <p>
                    <strong>{comment.username}</strong>
                    <span className="comment_text">{comment.text}</span>
                </p>
            ))
            }

            </div>


            {/* comments form only shows when user is logged in*/}

            {signedInUser && (
                <form className="post_commentBox">

                    <input 
                        className="post_input"
                        type="text"
                        placeholder="Enter a comment..."
                        value={comment}
                        onChange={(e)=> setComment(e.target.value)}
                    />

                    <button
                    className="post_button"
                    disabled={!comment}
                    type="submit"
                    onClick={postComment}
                    >
                        Post
                    </button>
                </form>
            
            )}

            
        </div>
    )
}

export default Post
