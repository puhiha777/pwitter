import React, { useState, useEffect } from "react";
import { v4, uuidv4 } from "uuid";
import { dbService, storageService } from "fbase";
import { collection, addDoc, query, onSnapshot, orderBy, } from "firebase/firestore";
import { ref, uploadString, getDownloadURL  } from "@firebase/storage";
import Nweet from "components/Nweet";

const Home = ({ userObj }) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const [attachment, setAttachment] = useState("");
    useEffect(() => {
        const q = query(
            collection(dbService, "nweets"),
            orderBy("createdAt", "desc")
        );
        onSnapshot(q, (snapshot) => {
            const nweetArr = snapshot.docs.map((document) => ({
            id: document.id,
            ...document.data(),
            }));
            setNweets(nweetArr);
        });
    }, []);
    const onSubmit = async (e) => {
        e.preventDefault();
        let attachmentUrl ="";
        if(attachment !== "")
        {
          const fileRef = ref(storageService, `${userObj.uid}/${v4()}`);
          const response = await uploadString(fileRef, attachment, "data_url");
          attachmentUrl = await getDownloadURL(response.ref);
        }
        
        const nweetObj = {
          text: nweet,
          createdAt: Date.now(),
          creatorId: userObj.uid,
          attachmentUrl
        };
        await addDoc(collection(dbService, "nweets"), nweetObj);
        setNweet("");
        setAttachment("");
        console.log(attachmentUrl);
    };
    const onChange = (event) => {
      const {
        target: { value },
      } = event;
      setNweet(value);
    };
    const onFileChange = (event) => {
      const {
        target: { files },
      } = event;
      const theFile = files[0];
      const reader = new FileReader();
      reader.onloadend = (finishedEvent) => {
        const {
          currentTarget: { result },
        } = finishedEvent;
        setAttachment(result);
      };
      reader.readAsDataURL(theFile);
    };
    const onClearAttachment = () => setAttachment(null);
    return (
      <div>
        <form onSubmit={onSubmit}>
          <input
            value={nweet}
            onChange={onChange}
            type="text"
            placeholder="What's on your mind?"
            maxLength={120}
          />
          <input type="file" accept="image/*" onChange={onFileChange} />
          <input type="submit" value="Pweet" />
          {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
        </form>
        <div>
            {nweets.map((nweet) => (
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