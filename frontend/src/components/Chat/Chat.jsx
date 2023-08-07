import "./Chat.css";
import { useState, useEffect } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { formatDateTime, NetworkError, ServerError } from "../../utils";
import { setLoading } from "../../redux/loading";

export default function Chat({ socket, user, room, friend }) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                dispatch(setLoading(true));
                const response = await axios.get(
                    `${import.meta.env.VITE_HOST}/messages/${friend.user2.id}`,
                    { withCredentials: true, validateStatus: () => true }
                );

                if (response.status === 200) {
                    setMessageList(response.data.messages);
                }

                if (response.status === 500) {
                    ServerError();
                }

                dispatch(setLoading(false));
            } catch (error) {
                dispatch(setLoading(false));
                NetworkError(error);
            }
        };
        fetchMessages();
    }, [room]);

    const sendMessage = async (event) => {
        event.preventDefault();

        try {
            dispatch(setLoading(true));
            const messageData = {
                room,
                author: user.username,
                friendID: friend.user2.id,
                content: currentMessage
            };

            const response = await axios.post(
                `${import.meta.env.VITE_HOST}/message`,
                messageData,
                { withCredentials: true, validateStatus: () => true }
            );

            if (response.status === 200) {
                await socket.emit("send_message", response.data.message);
                setMessageList((list) => [...list, response.data.message]);
                setCurrentMessage("");
            }

            if (response.status === 500) {
                ServerError();
            }
            dispatch(setLoading(false));
        } catch (error) {
            dispatch(setLoading(false));
            NetworkError(error);
        }
    };

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        });

        return () => socket.removeListener("receive_message");
    }, [socket]);

    return (
        <div className="chat-section">
            <ScrollToBottom className="chat-window">
                {messageList.map((messageContent) => (
                    <div
                        key={messageContent.id}
                        className={
                            user.username === messageContent.author
                                ? "your-messages"
                                : "friend-messages"
                        }
                    >
                        <div className="message-bubble">
                            <img
                                src={
                                    user.username === messageContent.author
                                        ? user.picture
                                        : friend.user2.picture
                                }
                                alt={`This is the profile of ${
                                    user.username === messageContent.author
                                        ? user.username
                                        : friend.user2.username
                                }.`}
                                className="profile-picture"
                            />
                            <div>
                                <div className="message-content">
                                    <p>{messageContent.content}</p>
                                </div>
                                <div className="message-footer">
                                    <Link
                                        to={`/profile/${messageContent.author}`}
                                        className="user-link"
                                    >
                                        <p
                                            className={
                                                user.username ===
                                                messageContent.author
                                                    ? "message-author text-success"
                                                    : "message-author text-primary"
                                            }
                                        >
                                            {user.username ===
                                            messageContent.author
                                                ? user.fullName
                                                : friend.user2.fullName}
                                        </p>
                                    </Link>
                                    <p className="message-time">
                                        {formatDateTime(
                                            messageContent.createdAt
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </ScrollToBottom>
            <form onSubmit={sendMessage}>
                <input
                    className="send-message"
                    type="text"
                    value={currentMessage}
                    placeholder="Write a message..."
                    onChange={(event) => setCurrentMessage(event.target.value)}
                    required
                />
            </form>
        </div>
    );
}
