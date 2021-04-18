import { authService, dbService } from "fbase";
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

const Profile = ({ userObj, history, refreshUser }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const onLogOutLick = () => {
    authService.signOut();
    history.push("/");
  };

  const onChnage = event => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const onSubmit = async event => {
    event.preventDefault();
    if (userObj.displayName === newDisplayName) {
      return;
    }

    await userObj.updateProfile({
      displayName: newDisplayName,
    });
    refreshUser();
  };

  const getMyNweets = async () => {
    const nweets = await dbService
      .collection("nweets")
      .where("creatorId", "==", userObj.uid)
      .orderBy("createdAt")
      .get();

    nweets.docs.map(doc => console.log(doc.data()));
  };

  useEffect(() => {
    getMyNweets();
  }, []);

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Diplay name"
          onChange={onChnage}
          value={newDisplayName}
        />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutLick}>Log Out</button>
    </>
  );
};

export default withRouter(Profile);
