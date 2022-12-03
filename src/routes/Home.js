import React, { useState, useEffect } from "react";
import { dbService } from "fbase";
import { collection, addDoc, serverTimestamp, query, onSnapshot, orderBy, } from "firebase/firestore";
import Nweet from "components/Nweet";

const Home = ({ userObj }) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
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
        await addDoc(collection(dbService, "nweets"), {
            text: nweet,
            createdAt: serverTimestamp(),
            creatorId: userObj.uid,
        });
        setNweet("");
    };
    const onChange = (event) => {
      const {
        target: { value },
      } = event;
      setNweet(value);
    };
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
          <input type="submit" value="Nweet" />
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