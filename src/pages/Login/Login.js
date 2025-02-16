import React, { useState } from 'react';
import { auth, db } from '../../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await ensureTeamId(user.uid);
      setError('');
    } catch (error) {
      setError('Giriş hatası: ' + error.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await ensureTeamId(user.uid);
      setError('');
    } catch (error) {
      setError('Google ile giriş hatası: ' + error.message);
    }
  };

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await assignTeamId(user.uid);
      alert("Kayıt başarılı!");
      setError('');
    } catch (error) {
      setError('Kayıt hatası: ' + error.message);
    }
  };

  const assignTeamId = async (userId) => {
    const teamId = 'default-team-id'; // Replace with logic to generate or fetch a team ID
    await setDoc(doc(db, 'users', userId), { teamId });
  };

  const ensureTeamId = async (userId) => {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists() || !userDoc.data().teamId) {
      await assignTeamId(userId);
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