import "./Profile.css";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../App/App";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProfileHistory from "../ProfileHistory/ProfileHistory";
import FriendConnection from "../FriendConnection/FriendConnection";

export default function Profile() {
    const { username } = useParams();
    const { setErrorMessage, setLoading } = useContext(UserContext);
    const [profile, setProfile] = useState({});

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${import.meta.env.VITE_HOST}/user/${username}`,
                    { withCredentials: true, validateStatus: () => true }
                );

                if (response.status === 200) {
                    setProfile(response.data.user);
                }

                if (response.status === 404) {
                    setErrorMessage(response.data.error);
                }

                if (response.status === 500) {
                    setErrorMessage(
                        `${response.statusText}: Please try again later.`
                    );
                }

                setLoading(false);
            } catch (error) {
                setErrorMessage(`${error.message}: Please try again later.`);
            }
        };
        fetchProfile();
    }, [username]);

    return profile.username ? (
        <div className="profile-container">
            <div className="profile-card">
                <FriendConnection
                    username={username}
                    profile={profile}
                    setProfile={setProfile}
                />
                <div className="profile-picture">
                    <img
                        src={profile.picture}
                        alt={`This is a profile picture associated with ${profile.username}`}
                    />
                </div>
                <div className="profile-details">
                    <h1>{profile.fullName}</h1>
                    <p>Username: {profile.username}</p>
                    <p>Email: {profile.email}</p>
                </div>
                <ProfileHistory username={username} />
            </div>
        </div>
    ) : null;
}
