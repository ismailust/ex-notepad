import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Input, Button, Select } from 'antd';
import './Team.css';

const { Option } = Select;

const Team = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [newTeamName, setNewTeamName] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchTeams();
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchTeams = async () => {
    const querySnapshot = await getDocs(collection(db, 'teams'));
    const teamsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setTeams(teamsData);
  };

  const joinTeam = async () => {
    if (selectedTeam && user) {
      try {
        await setDoc(doc(db, 'userTeams', `${user.uid}_${selectedTeam}`), { userId: user.uid, teamId: selectedTeam });
        await setDoc(doc(db, 'users', user.uid), { teamId: selectedTeam }, { merge: true });
        alert('Takıma katıldınız!');
      } catch (error) {
        console.error('Error joining team: ', error);
      }
    } else {
      alert('Lütfen bir takım seçin.');
    }
  };

  const createTeam = async () => {
    if (newTeamName.trim() && user) {
      try {
        const teamRef = doc(collection(db, 'teams')); // Generate a new document reference with a unique ID
        await setDoc(teamRef, { name: newTeamName, userId: user.uid });
        const teamId = teamRef.id;
        setTeams([...teams, { id: teamId, name: newTeamName, userId: user.uid }]);
        setNewTeamName('');
        await setDoc(doc(db, 'users', user.uid), { teamId }, { merge: true });
        alert('Takım oluşturuldu ve takıma katıldınız!');
      } catch (error) {
        console.error('Error creating team: ', error);
      }
    } else {
      alert('Lütfen bir takım adı girin.');
    }
  };

  return (
    <div className="team-container">
      <h2>Takıma Katıl</h2>
      <Select
        style={{ width: '100%' }}
        placeholder="Bir takım seçin"
        onChange={(value) => setSelectedTeam(value)}
      >
        {teams.map((team) => (
          <Option key={team.id} value={team.id}>
            {team.name}
          </Option>
        ))}
      </Select>
      <Button type="primary" onClick={joinTeam} style={{ marginTop: '10px' }}>
        Katıl
      </Button>
      <h2>Takım Yarat</h2>
      <Input
        value={newTeamName}
        onChange={(e) => setNewTeamName(e.target.value)}
        placeholder="Takım adı girin"
        style={{ marginTop: '10px' }}
      />
      <Button type="primary" onClick={createTeam} style={{ marginTop: '10px' }}>
        Takım Yarat
      </Button>
    </div>
  );
};

export default Team;