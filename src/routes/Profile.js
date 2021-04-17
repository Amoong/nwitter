import { authService } from "fbase";
import React, { useState } from "react";

const Profile = ({ userObj, history }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const onLogOutLick = () => {
    authService.signOut();
    history.push("/");
  };

  const onChnage = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName === newDisplayName) {
      return;
    }

    await userObj.updateProfile({
      displayName: newDisplayName,
    });
  };

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

export default Profile;
