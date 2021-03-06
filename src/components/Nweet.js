import { dbService, storageService } from "fbase";
import React, { useState } from "react";

const Nweet = ({ nweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);

  const onDeleteClick = () => {
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    if (ok) {
      dbService.doc(`nweets/${nweetObj.id}`).delete();

      nweetObj.attachmentUrl &&
        storageService.refFromURL(nweetObj.attachmentUrl)?.delete();
    }
  };

  const toggleEditing = () => setEditing(prev => !prev);

  const onSubmit = async event => {
    event.preventDefault();
    await dbService.doc(`nweets/${nweetObj.id}`).update({
      text: newNweet,
    });
    setEditing(false);
  };

  const onChange = event => {
    const {
      target: { value },
    } = event;
    setNewNweet(value);
  };

  return (
    <div>
      {editing ? (
        <>
          {isOwner && (
            <>
              <form onSubmit={onSubmit}>
                <input
                  type="text"
                  placeholder="Edit your nweet"
                  value={newNweet}
                  onChange={onChange}
                  required
                />
                <input type="submit" value="Update Nweet" />
              </form>
              <button onClick={toggleEditing}>Cancel</button>
            </>
          )}
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {nweetObj.attachmentUrl && (
            <img
              src={nweetObj.attachmentUrl}
              alt="attachment"
              width="200px"
              height="200px"
            />
          )}
          {isOwner && <button onClick={onDeleteClick}>Delete Nweet</button>}
          {isOwner && <button onClick={toggleEditing}>Edit Nweet</button>}
        </>
      )}
    </div>
  );
};

export default Nweet;
