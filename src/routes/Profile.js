import React, { useState } from "react";
import { authService } from "fbase";
/*import { collection, orderBy, getDocs, query, where} from "firebase/firestore";*/
import { useNavigate } from "react-router-dom";
import { updateProfile } from "@firebase/auth";

export default ({ refreshUser, userObj }) => {
    const navigate = useNavigate();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const onLogOutClick = () => {
      authService.signOut();
      navigate("/", { replace: true });
    };
    /*
    const getMyNweets = async () => {
      const q = query(
        collection(dbService, "nweets"),
        where("creatorId", "==", userObj.uid),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
      });
    };*/
    const onChange = (event) => {
      const {
        target: { value },
      } = event;
      setNewDisplayName(value);
    };
    const onSubmit = async (event) => {
      event.preventDefault();
      if (userObj.displayName !== newDisplayName) {
        await updateProfile(authService.currentUser, { displayName: newDisplayName });
        console.log(userObj.updateProfile);
        refreshUser();
      }
    };
    return (
      <>
        <form onSubmit={onSubmit}>
          <input onChange={onChange} type="text" placeholder="Display name" value={newDisplayName} />
          <input type="submit" value="Update Profile" />
        </form>
        <button onClick={onLogOutClick}>Log Out</button>
      </>
    );
  };