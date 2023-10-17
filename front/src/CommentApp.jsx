import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosClient from "./axios-client.js";
import Preview from "./componets/Preview.jsx";
import CommentSearch from "./componets/CommentSearch.jsx";

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function Comment({ comment, handleReplyModeChange }) {
    const [replies, setReplies] = useState([]);
    const [isShowReply, setIsShowReply] = useState(false);
    const [isPreview, setIsPreview] = useState(false);

    useEffect(() => {
        if (isShowReply) {
            axiosClient.get(`/comments/parent/${comment.id}`)
                .then((response) => {
                    setReplies(response.data.comments);
                })
                .catch((error) => {
                    console.error('Помилка отримання коментарів: ', error);
                });
        } else {
            setReplies([]);
        }
    }, [isShowReply, comment.id]);

    const toggleShowReplies = () => {
        setIsShowReply(!isShowReply);
    }

    return (
        <li key={comment.id}>
            <div className="message">
                <div className="message-header">
                    <div>
                        <strong>{comment.user_name}</strong>
                    </div>
                    <div className="message-date">
                        {formatDate(comment.created_at)}
                    </div>
                    <a className="reply-btn" onClick={() => handleReplyModeChange(comment)}>Reply</a>
                </div>
                <div className="message-text" dangerouslySetInnerHTML={{ __html: comment.text }}></div>
                <div>
                    {comment.files[0] && (
                        <Preview id={comment.id} file={comment.files[0]} isPreview={isPreview} setIsPreview={setIsPreview} />
                    )}
                </div>
                <div className="message-show-reply">
                    <a onClick={toggleShowReplies}>
                        {isShowReply ?
                            "Hide replies"
                            :
                            (comment.replies_count > 0 ? "Show replies" : "")
                        }
                    </a>
                </div>

            </div>
            {isShowReply && (
                <ul>
                    {replies.map((reply) => (
                        <Comment key={reply.id} comment={reply} handleReplyModeChange={handleReplyModeChange} />
                    ))}
                </ul>
            )}
        </li>
    );
}

function CommentApp() {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [parent, setParent] = useState(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [homePage, setHomePage] = useState(null);
    const [filterWord, setFilterWord] = useState('');
    const [sortLIFO, setSortLIFO] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [file, setFile] = useState(null);
    const [isPreview, setIsPreview] = useState(false);

    useEffect(() => {
        setIsLoading(true);

        axiosClient.get('/comments/main', {
            params: {
                sort: sortLIFO,
                filter_word: filterWord,
            }
        })
            .then((response) => {
                setComments(response.data.comments);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Помилка отримання коментарів: ', error);
                setIsLoading(false);
            });
    }, [isSending, sortLIFO, filterWord]);

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

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];

        if (selectedFile) {
            setFile(selectedFile)
        }
    };

    const handleReplyModeChange = (command) => {
        setParent(command)
    };


    const handleAddComment = () => {
        setIsSending(true);

        const formData = new FormData();
        if (parent){
            formData.append('parent_id', parent.id);
        }

        formData.append('user_name', username);
        formData.append('email', email);
        formData.append('home_page', homePage);
        formData.append('text', newComment);

        if (file) {
            formData.append('file', file);
        }

        axiosClient.post('/comments', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((response) => {
                setComments([...comments, response.data]);
                setNewComment('');
                setUsername('');
                setEmail('');
                setImage(null);
                setTextFile(null);
                setIsSending(false);
            })
            .catch((error) => {
                console.error('Помилка додавання коментаря: ', error);
                setIsSending(false);
            });
    };

    return (
        <div className="main">
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
                        type="file"
                        accept="image/*,.txt"
                        onChange={handleFileChange}
                    />

                    <textarea
                        placeholder="Напишіть ваш коментар"
                        value={newComment}
                        onChange={handleNewCommentChange}
                        required
                    />
                    <button onClick={handleAddComment}>Додати коментар</button>
                </div>
            </div>
            <div className="message-container">
                <CommentSearch setFilterWord={setFilterWord} setSortLIFO={setSortLIFO}/>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="comments-container">
                        <ul>
                            {comments.map((comment) => (
                                <Comment key={comment.id} comment={comment} handleReplyModeChange={handleReplyModeChange} />
                            ))}
                        </ul>
                    </div>
                )}
            </div>

        </div>
    );
}

export default CommentApp;
