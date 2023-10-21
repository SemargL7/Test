import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosClient from "./axios-client.js";
import Preview from "./componets/Preview.jsx";
import CommentSearch from "./componets/CommentSearch.jsx";
import Captcha from "./componets/Captcha.jsx";
import ReactPaginate from "react-paginate";
import NotificationSidebar from "./componets/NotificationSidebar.jsx";

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
            axiosClient
                .get(`/comments/parent/${comment.id}`)
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
    };

    return (
        <table className="message">
            <tbody>
            <tr className="message-header">
                <td>
                    <strong>{comment.user_name}</strong>
                </td>
                <td className="message-date">
                    {formatDate(comment.created_at)}
                </td>
                <td>
                    ({comment.email})
                </td>
                <td>
                    <a className="reply-btn" onClick={() => handleReplyModeChange(comment)}>
                        Reply
                    </a>
                </td>
            </tr>
            <tr>
                <td colSpan="4">
                    <div className="message-text" dangerouslySetInnerHTML={{ __html: comment.text }}></div>
                </td>
            </tr>
            <tr>
                <td colSpan="4">
                    {comment.files && (
                        <Preview id={comment.id} file={comment.files[0]} isPreview={isPreview} setIsPreview={setIsPreview} />
                    )}
                </td>
            </tr>
            </tbody>
            <tfoot>
            <tr>
                <td colSpan="4" className="reply">
                    <a onClick={toggleShowReplies}>
                        {isShowReply ?
                            "Hide replies"
                            :
                            (comment.replies_count > 0 ? `Show replies(${comment.replies_count})` : "")
                        }
                    </a>
                </td>
            </tr>
            {isShowReply && (
                <tr>
                    <td colSpan="4">
                        {replies.map((reply) => (
                            <Comment key={reply.id} comment={reply} handleReplyModeChange={handleReplyModeChange} />
                        ))}
                    </td>
                </tr>
            )}
            </tfoot>
        </table>
    );
}

function CommentApp() {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [parent, setParent] = useState(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [homePage, setHomePage] = useState(null);

    const [isErrorName,setIsErrorName] = useState(false);
    const [isErrorEmail,setIsErrorEmail] = useState(false);
    const [isErrorComment,setIsErrorComment] = useState(false);

    const [filterWord, setFilterWord] = useState('');
    const [sortLIFO, setSortLIFO] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [file, setFile] = useState(null);
    const [isPreview, setIsPreview] = useState(false);
    const [isFormMessageDisplay, setIsFormMessageDisplay] = useState(false);
    const [isCaptchaValid, setIsCaptchaValid] = useState(false);
    const [commentPreview, setCommentPreview] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1)
    const [notificationShowed, setNotificationShowed] =  useState(false)
    const [formData, setFormData] = useState({
        username: localStorage.getItem('username') || '',
        email: localStorage.getItem('email') || '',
        homePage: localStorage.getItem('homePage') || '',
    });

    useEffect(() => {
        const savedUsername = localStorage.getItem('username') || '';
        const savedEmail = localStorage.getItem('email') || '';
        const savedHomePage = localStorage.getItem('homePage') || '';

        setUsername(savedUsername);
        setEmail(savedEmail);
        setHomePage(savedHomePage);
    }, []);

    useEffect(() => {
        setIsLoading(true);

        axiosClient.get('/comments/main', {
            params: {
                sort: sortLIFO,
                filter_word: filterWord.value,
                filter_type : filterWord.type,
                page: currentPage,
            }
        })
            .then((response) => {
                setComments(response.data.comments.data);
                setTotalPages(response.data.comments.last_page);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Помилка отримання коментарів: ', error);
                setIsLoading(false);
            });
    }, [isSending, sortLIFO, filterWord, currentPage]);
    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected + 1);
    };
    const handleNewCommentChange = (event) => {
        const newCommentValue = event.target.value;
        setNewComment(newCommentValue);

        const cleanedCommentPreview = removeInvalidTags(newCommentValue);
        setCommentPreview(cleanedCommentPreview);
    };
    function removeInvalidTags(comment) {
        const allowedTagsRegex = /<(?!\/?(a|i|strong|code)\b)[^>]+>/gi;
        return comment.replace(allowedTagsRegex, '');
    }

    const handleUsernameChange = (event) => {
        const newUsername = event.target.value;
        setUsername(newUsername);
        localStorage.setItem('username', newUsername);
    };

    const handleEmailChange = (event) => {
        const newEmail = event.target.value;
        setEmail(newEmail);
        localStorage.setItem('email', newEmail);
    };

    const handleHomePageChange = (event) => {
        const newHomePage = event.target.value;
        setHomePage(newHomePage);
        localStorage.setItem('homePage', newHomePage);
    };


    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type.startsWith('text/')) {
            if (selectedFile.size > 100000) {
                alert('Розмір файлу перевищує 100 КБ і не може бути завантажений.');
            } else {
                setFile(selectedFile);
            }
        }
        if (selectedFile) {
            setFile(selectedFile)
        }
    };

    const handleReplyModeChange = (command) => {
        setParent(command)
    };


    const handleAddComment = () => {
        console.error(isCaptchaValid)
        const formData = new FormData();
        if (parent){
            formData.append('parent_id', parent.id);
        }

        setIsErrorName(username === "");
        setIsErrorEmail(email === "");
        setIsErrorComment(newComment === "");

        if (isErrorName || isErrorComment || isErrorEmail){
            return
        }
        formData.append('user_name', username);
        formData.append('email', email);
        formData.append('home_page', homePage);
        formData.append('text', newComment);

        if (file) {
            formData.append('file', file);
        }
        if (!isValidComment(newComment) || !isCaptchaValid){
            console.error("text or captcha Not VALID")
        }else {
            setIsSending(true);
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
        }

    };
    function handleTagButtonClick(tag) {
        if (tag === "a") {
            const href = prompt("Введіть URL для посилання:");
            if (href) {
                const updatedComment = newComment + `<${tag} href="${href}"></${tag}>`;
                setNewComment(updatedComment);
            }
        } else {
            const updatedComment = newComment + `<${tag}></${tag}>`;
            setNewComment(updatedComment);
        }
    }
    function isValidComment(comment) {
        const tagRegex = /<[^>]+>/g;
        const textWithoutTags = comment.replace(tagRegex, '');
        const otherTagsRegex = /<\/?\s*([a|i|strong|code]+)\s*>/gi;

        const allowedTags = ['i', 'a', 'strong', 'code'];
        const cleanedComment = textWithoutTags.replace(otherTagsRegex, (match, p1) => {
            return allowedTags.includes(p1.toLowerCase()) ? match : '';
        });

        return cleanedComment === textWithoutTags;
    }
    const handleCaptchaVerification = (isVerified) => {
        console.log(isVerified)
        setIsCaptchaValid(isVerified);
    };
    const showNotificationSidebar = () => {
        if (!notificationShowed){
            document.querySelector('.notification-sidebar').classList.add('show');
            setNotificationShowed(!notificationShowed)
        }else {
            document.querySelector('.notification-sidebar').classList.remove('show');
            setNotificationShowed(!notificationShowed)
        }

    };
    const handleShowForm = () =>{
        setIsFormMessageDisplay(!isFormMessageDisplay)
    }
    return (
        <div className="main">

            <div className="message-container">
                <CommentSearch setFilterWord={setFilterWord} setSortLIFO={setSortLIFO}/>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="comments-container">
                        <ul>
                            {
                                comments.map((comment) => (
                                <Comment key={comment.id} comment={comment} handleReplyModeChange={handleReplyModeChange} />
                            ))}
                        </ul>
                    </div>
                )}
                <div className="pagination">
                    <ReactPaginate
                        previousLabel={'previous'}
                        nextLabel={'next'}
                        breakLabel={'...'}
                        pageCount={totalPages}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageChange}
                        containerClassName={'pagination'}
                        subContainerClassName={'pages pagination'}
                        activeClassName={'active'}
                    />
                </div>

            </div>
            {
                isFormMessageDisplay ?
                    <div className="comment-form">
                        <div className="hide-form">
                            <button onClick={handleShowForm}>Hide Form</button>
                        </div>
                        <button onClick={showNotificationSidebar}>Show notification</button>
                        <NotificationSidebar />
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
                            {
                                isErrorName ?
                                    <div className="error">
                                        Введіть ім'я
                                    </div>
                                    :""
                            }
                            <input
                                type="text"
                                placeholder="Ваше ім'я"
                                value={username}
                                onChange={handleUsernameChange}
                                required
                            />
                            {
                                isErrorEmail ?
                                    <div className="error">
                                        Введіть Email
                                    </div>
                                    :""
                            }
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
                            <div>
                                <Captcha onVerify={handleCaptchaVerification} />
                                <div className="text-tags">
                                    <button onClick={() => handleTagButtonClick("i")}>i</button>
                                    <button onClick={() => handleTagButtonClick("a")}>a</button>
                                    <button onClick={() => handleTagButtonClick("strong")}>strong</button>
                                    <button onClick={() => handleTagButtonClick("code")}>code</button>
                                </div>
                            </div>
                            <div className="form-block-send">
                                <div className="image-upload">
                                    <label htmlFor="file-input">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="30px" height="30px" viewBox="0 0 32 32" version="1.1">
                                            <path d="M5.397 31.488c-1.356 0-2.659-0.561-3.697-1.6-2.301-2.309-2.301-6.064-0.001-8.372l17.946-19.057c2.8-2.804 7.089-2.553 10.219 0.582 1.402 1.405 2.189 3.431 2.16 5.559-0.029 2.107-0.852 4.123-2.259 5.531l-13.563 14.439c-0.377 0.404-1.011 0.423-1.413 0.044s-0.421-1.014-0.043-1.417l13.584-14.461c1.063-1.065 1.672-2.575 1.695-4.164s-0.552-3.090-1.574-4.114c-1.92-1.924-5.046-2.932-7.37-0.602l-17.945 19.057c-1.543 1.547-1.542 4.032-0.020 5.558 0.714 0.715 1.562 1.063 2.464 1.008 0.893-0.055 1.811-0.512 2.585-1.288l14.279-15.198c0.517-0.518 1.558-1.79 0.499-2.851-0.599-0.601-1.020-0.563-1.159-0.552-0.395 0.035-0.858 0.309-1.337 0.79l-10.748 11.43c-0.38 0.404-1.013 0.423-1.414 0.043-0.402-0.379-0.421-1.014-0.042-1.416l10.767-11.452c0.846-0.851 1.712-1.312 2.593-1.391 0.688-0.061 1.71 0.085 2.753 1.131 1.548 1.551 1.355 3.826-0.477 5.663l-14.279 15.197c-1.14 1.144-2.517 1.808-3.898 1.893-0.101 0.007-0.203 0.010-0.304 0.010z"/>
                                        </svg>
                                    </label>

                                    <input id="file-input" type="file" onChange={handleFileChange} hidden/>
                                </div>
                                <textarea
                                    placeholder="Напишіть ваш коментар"
                                    value={newComment}
                                    onChange={handleNewCommentChange}
                                    required
                                />
                                <button onClick={handleAddComment}> send </button>
                            </div>
                            {
                                isErrorComment ?
                                    <div className="error">
                                        Введіть повідомлення
                                    </div>
                                    :
                                    ""
                            }
                        </div>

                        <div className="comment-preview">
                            <h3>Preview</h3>
                            <div className="message-text" dangerouslySetInnerHTML={{ __html: commentPreview }}></div>
                        </div>
                    </div>
                    :
                    <div className="buttonShowForm">
                        <button onClick={handleShowForm}>Send message</button>
                    </div>
            }

        </div>
    );
}

export default CommentApp;
