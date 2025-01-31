import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      {user ? (
        <>
          <h2>Hoş geldin, {user.email}!</h2>
          <button onClick={() => signOut(auth)}>Çıkış Yap</button>
        </>
      ) : (
        <h2>Lütfen giriş yapın.</h2>
      )}
    </div>
  );
};

export default Dashboard;   