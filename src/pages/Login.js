import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import './Login.css';

const provider = new GoogleAuthProvider();

const addNote = async (noteText,userId) => {
  try {
    await addDoc(collection(db, "account"), {
      note: noteText,
      userId: userId,
    });
    console.log("Not başarıyla eklendi!");
  } catch (error) {
    console.error("Not ekleme hatası:", error.message);
  }
};

const handleGoogleLogin = async () => {
  try {
    await signInWithPopup(auth, provider);
    alert("Google ile giriş başarılı!");
  } catch (error) {
    console.error("Google giriş hatası:", error.message);
  }
};
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log(auth.currentUser.uid);
      await addNote(auth.currentUser.email,auth.currentUser.uid);
      setError(''); // Clear error message on successful login
      alert("Giriş başarılı!");
    } catch (error) {
      setError('Giriş hatası: ' + error.message);
    }
  };

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Kayıt başarılı!");
    } catch (error) {
      console.error("Kayıt hatası:", error.message);
    }
  };

  

  return (
    <div className="login-container">
      <h2>Giriş Yap / Kayıt Ol</h2>
      {error && <p className="error-message">{error}</p>}
      <input type="email" placeholder="E-posta" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Şifre" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Giriş Yap</button>
      <button onClick={handleGoogleLogin}>
        <FontAwesomeIcon icon={faGoogle} /> Google Giriş Yap
      </button>
      <button onClick={handleRegister}>Kayıt Ol</button>
    </div>
  );
};

export default Login;