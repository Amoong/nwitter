import { authService, dbService } from "fbase";
import React, { useEffect } from "react";

const Profile = ({ userObj }) => {
  const onLogOutLick = () => {
    authService.signOut();
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
      <button onClick={onLogOutLick}>Log Out</button>
    </>
  );
};

export default Profile;
