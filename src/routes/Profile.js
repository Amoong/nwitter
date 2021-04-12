import { authService } from "fbase";
import React from "react";

const Profile = () => {
  const onLogOutLick = () => {
    authService.signOut();
  };

  return (
    <>
      <button onClick={onLogOutLick}>Log Out</button>
    </>
  );
};

export default Profile;
