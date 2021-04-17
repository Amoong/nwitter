import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fbase";
import Nweet from "components/Nweet";

const Home = ({ userObj }) => {
  const fileRef = useRef(null);
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState(null);

  const getNweets = async () => {
    const dbNweets = await dbService.collection("nweets").get();
    dbNweets.forEach(document => {
      const nweetObject = {
        ...document.data(),
        id: document.id,
      };

      setNweets(prev => [nweetObject, ...prev]);
    });
  };

  useEffect(() => {
    getNweets();
    dbService
      .collection("nweets")
      .orderBy("createdAt", "desc")
      .onSnapshot(snapshot => {
        const nweetArray = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNweets(nweetArray);
      });
  }, []);

  const onSubmit = async event => {
    event.preventDefault();

    let attachmentUrl = "";

    if (attachment) {
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);

      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
    }

    const payload = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };

    await dbService.collection("nweets").add(payload);

    setNweet("");
    onClearAttachment();
  };

  const onChange = event => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };

  const onFileChange = event => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setAttachment(reader.result);
    };

    reader.readAsDataURL(theFile);
  };

  const onClearAttachment = () => {
    setAttachment("");
    fileRef.current.value = "";
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={nweet}
          onChange={onChange}
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={onFileChange}
        />
        <input type="submit" value="Nweet" />
        {attachment && (
          <div>
            <img src={attachment} alt="attachment" width="50px" height="50px" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
      </form>
      <div>
        {nweets.map(nweet => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};
export default Home;
