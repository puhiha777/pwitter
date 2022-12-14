import React, { useState } from "react";
import { dbService,storageService  } from "fbase";
import { deleteObject, ref } from "@firebase/storage";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";

const Nweet = ({ nweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);
    const NweetTextRef = doc(dbService, "nweets", `${nweetObj.id}`);
    const NweetUrlRef = ref(storageService , nweetObj.attachmentUrl);
    const onDeleteClick = async () => {
        const ok = window.confirm("want to delete this nweet?");
        if (ok) { 
            await deleteDoc(NweetTextRef); 
            await deleteObject(NweetUrlRef);
        }
    };
    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (event) => {
        event.preventDefault();
        await updateDoc(NweetTextRef, {
            text: newNweet,
        });
        setEditing(false);
    };
    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewNweet(value);
    };
    return (
        <div>
        {editing ? (
            <>
                <form onSubmit={onSubmit}>
                    <input
                    type="text"
                    placeholder="Edit your nweet"
                    value={newNweet}
                    required
                    onChange={onChange}
                    />
                    <input type="submit" value="Update Nweet" />
                </form>
                <button onClick={toggleEditing}>Cancel</button>
            </>
        ) : (
            <>
                <h4>{nweetObj.text}</h4>
                {nweetObj.attachmentUrl && (
                    <img src={nweetObj.attachmentUrl} width="120px" height="120px" />)}
                {isOwner && (
                    <>
                    <button onClick={onDeleteClick}>Delete Nweet</button>
                    <button onClick={toggleEditing}>Edit Nweet</button>
                    </>
                )}
            </>
        )}
        </div>
    );
};

export default Nweet;