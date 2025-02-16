import React, { useState, useEffect } from 'react';
import { List, Input, Button } from 'antd';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './Notes.css';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState('');
  const [user, setUser] = useState(null);
  const [teamId, setTeamId] = useState(''); // Assuming teamId is available

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch the teamId for the current user
        fetchTeamId(currentUser.uid).then((id) => {
          if (id) {
            setTeamId(id);
            fetchNotes(id);
          } else {
            console.error('No teamId found for the user');
          }
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchTeamId = async (userId) => {
    // Fetch the teamId for the user from Firestore or another source
    // This is a placeholder implementation
    const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', userId)));
    if (!userDoc.empty) {
      return userDoc.docs[0].data().teamId;
    } else {
      return null;
    }
  };

  const fetchNotes = async (teamId) => {
    const q = query(collection(db, 'notes'), where('teamId', '==', teamId));
    const querySnapshot = await getDocs(q);
    const notesData = querySnapshot.docs.map(doc => doc.data().note);
    setNotes(notesData);
  };

  const addNote = async () => {
    console.log('Note:', note);
    console.log('User:', user);
    console.log('TeamId:', teamId);

    if (note.trim() && user && teamId) {
      try {
        await addDoc(collection(db, 'notes'), { note, userId: user.uid, teamId });
        setNotes([...notes, note]);
        setNote('');
        console.log('Note added successfully');
      } catch (error) {
        console.error('Error adding note: ', error);
      }
    } else {
      console.error('Note, user, or teamId is missing');
    }
  };

  return (
    <div className="notes-container">
      <Input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Not ekle"
        onPressEnter={addNote}
      />
      <Button type="primary" onClick={addNote} style={{ marginTop: '10px' }}>
        Not Ekle
      </Button>
      <List
        bordered
        dataSource={notes}
        renderItem={(item) => <List.Item>{item}</List.Item>}
        style={{ marginTop: '20px' }}
      />
    </div>
  );
};

export default Notes;