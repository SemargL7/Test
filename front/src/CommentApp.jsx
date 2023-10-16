import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosClient from "./axios-client.js";

function CommentApp() {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [parent, setParent] = useState(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [homePage, setHomePage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        setIsLoading(true);

        axiosClient.get('/comments/main')
            .then((response) => {
                setComments(response.data.comments);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Помилка отримання коментарів: ', error);
                setIsLoading(false);
            });
    }, [isSending]);

    const handleNewCommentChange = (event) => {
        setNewComment(event.target.value);
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleHomePageChange = (event) => {
        setHomePage(event.target.value);
    };

    const handleReplyModeChange = (command) => {
        setParent(command)
    };

    const handleShowReplies = (parent_id) => {

        axiosClient.get(`/comments/parent/${parent_id}`)
            .then((response) => {
                // Update the comments by adding replies to the parent comment
                const updatedComments = comments.map(comment => {
                    if (comment.id === parent_id) {
                        return {
                            ...comment,
                            replies: response.data.comments,
                        };
                    }
                    return comment;
                });

                setComments(updatedComments);
            })
            .catch((error) => {
                console.error('Помилка отримання коментарів: ', error);
            });
    };


    const handleAddComment = () => {
        setIsSending(true);

        axiosClient.post('/comments', {
            parent_id: parent.id,
            user_name: username,
            email: email,
            home_page: homePage,
            text: newComment
        })
            .then((response) => {
                setComments([...comments, response.data]);
                setNewComment('');
                setUsername('');
                setEmail('');
                setIsSending(false);
            })
            .catch((error) => {
                console.error('Помилка додавання коментаря: ', error);
                setIsSending(false);
            });
    };

    return (
        <div>
            <div className="comment-form">
                {
                    !parent ?
                        <div>
                            <h3>Send</h3>
                        </div>
                        :
                        <div>
                            <h3>Reply</h3>
                            <div className="reply">
                                <span>To: {parent.user_name}</span>
                                <a onClick={() => handleReplyModeChange(null)}><svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 64 64" stroke-width="3"><line x1="8.06" y1="8.06" x2="55.41" y2="55.94"/><line x1="55.94" y1="8.06" x2="8.59" y2="55.94"/></svg></a>
                            </div>

                        </div>
                }
                <div className="form-block">
                    <input
                        type="text"
                        placeholder="Ваше ім'я"
                        value={username}
                        onChange={handleUsernameChange}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Ваш email"
                        value={email}
                        onChange={handleEmailChange}
                        required
                    />
                    <input
                        type="url"
                        placeholder="Ваш home page"
                        value={homePage}
                        onChange={handleHomePageChange}
                    />
                    <input
                        type="text"
                        placeholder="Напишіть ваш коментар"
                        value={newComment}
                        onChange={handleNewCommentChange}
                        required
                    />
                    <button onClick={handleAddComment}>Додати коментар</button>
                </div>
            </div>

            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {comments.map((comment) => (
                        <li key={comment.id}>
                            <strong>{comment.user_name}</strong> ({comment.email}):
                            <p>{comment.text}</p>
                            <a onClick={() => handleReplyModeChange(comment.id)}>Reply</a>
                            <a onClick={() => handleShowReplies(comment.id)}>Show replies</a>
                            {comment.replies && (
                                <ul>
                                    {comment.replies.map((reply) => (
                                        <li key={reply.id}>
                                            <strong>{reply.user_name}</strong> ({reply.email}):
                                            <p>{reply.text}</p>
                                            <a onClick={() => handleReplyModeChange(reply.id)}>Reply</a>
                                            <a onClick={() => handleShowReplies(reply.id)}>Show replies</a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default CommentApp;
