import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Button, Layout, Typography, Row, Col, Avatar } from 'antd';
import Notes from '../Notes/Notes';
import Team from '../Team/Team';
import './Dashboard.css';

const { Header, Content } = Layout;
const { Title } = Typography;

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
   
    return () => unsubscribe();
  }, []);

  return (
    <Layout className="dashboard-container">
      <Header className="dashboard-header">
        <Row justify="space-between" align="middle">
          <Col>
            {user ? (
              <Row align="middle">
                <Avatar src={user.photoURL} size="large" style={{ marginRight: '10px' }} />
                <Title level={2} style={{ color: 'white', margin: 0 }}>Hoş geldin, {user.displayName}!</Title>
              </Row>
            ) : (
              <Title level={2} style={{ color: 'white' }}>Lütfen giriş yapın.</Title>
            )}
          </Col>
          <Col>
            {user && (
              <Button type="primary" onClick={() => signOut(auth)}>
                Çıkış Yap
              </Button>
            )}
          </Col>
        </Row>
      </Header>
      <Content className="dashboard-content">
        {user && <Notes />}
        {user && <Team />}
      </Content>
    </Layout>
  );
};

export default Dashboard;