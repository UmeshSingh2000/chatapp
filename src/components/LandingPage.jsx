import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import ChatScreen from './ChatScreen';

const LandingPage = () => {
  const socket = useMemo(() => io('https://backend-v52s.onrender.com/'), []);
  const [searchUser, setSearchUser] = useState('');
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();
  const loginUser = localStorage.getItem('username')
  const [recieveMessages, setRecieveMessages] = useState([])
  const [hamburger, setHamburger] = useState(false);

  const selectUser = (user) => {
    setSelectedUser(user);
  }
  const handleSearchUser = (e) => {
    setSearchUser(e.target.value);
  };

  const handleForm = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://backend-v52s.onrender.com/', {
        username: searchUser,
      });
      setUser(res.data)
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
    const value = localStorage.getItem('login');
    if (value !== 'true') {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('login');
    localStorage.removeItem('username');
    navigate('/');
  };

  useEffect(() => {
    socket.on('connect', async () => {
      console.log('connected', socket.id);
      try {
        const username = localStorage.getItem('username');
        const response = await axios.put('https://backend-v52s.onrender.com/setId', {
          username: username,
          id: socket.id,
        });
      } catch (error) {
        console.error('Error setting socket ID:', error);
      }
    });

    return () => {
      socket.off('connect');
    };
  }, [socket]);
  useEffect(() => {
    if (user) {
      setUsers((prevUsers) => [...prevUsers, user]);
    }
  }, [user]);
  useEffect(() => {
    socket.on("recieved-message", async ({ message, sender, timestamp }) => {
      const res = await axios.post('https://backend-v52s.onrender.com/', {
        username: sender
      });
      const newUser = res.data;
      setUsers((prevUsers) => {
        // Check if user exists
        const userExists = prevUsers.find(u => u.username === newUser.username);
        if (userExists) {
          // Update existing user's message
          return prevUsers.map(u =>
            u.username === newUser.username
              ? { ...u, message }
              : u
          );
        } else {
          // Add new user to the state
          return [...prevUsers, { ...newUser, message }];
        }
      });
      setRecieveMessages((prevMessages) => [
        ...prevMessages,
        { message, timestamp,sender }
      ]);
    })
    return () => {
      socket.off('recieved-message');
    };
  }, [socket])


  const handleHamburger = () => {
    setHamburger(!hamburger);
  }
  const [menuStyle, setMenuStyle] = useState({
    left: window.innerWidth <= 850 ? '-100%' : '0'
  });
  
  useEffect(() => {
    const updateMenuStyle = () => {
      if (window.innerWidth <= 850) {
        setMenuStyle((prevStyle) => ({
          ...prevStyle,
          left: hamburger ? '0' : '-100%'
        }));
      } else {
        setMenuStyle({
          left: '0'
        });
      }
    };
  
    updateMenuStyle();
  
    window.addEventListener('resize', updateMenuStyle);
  
    return () => {
      window.removeEventListener('resize', updateMenuStyle);
    };
  }, [hamburger]);
  

  return (
    <div className='homepage'>
      <i className="fa-solid fa-bars-staggered hamburger" onClick={handleHamburger}></i>
      <div className='left' style={menuStyle}>
        <h1>Chats</h1>
        <div className='search'>
          <form onSubmit={handleForm}>
            <input
              type='text'
              placeholder='Search...'
              value={searchUser}
              onChange={handleSearchUser}
              required
              className='searchBar'
            />
            <button type='submit'><i className="fa-solid fa-magnifying-glass" type='submit'></i></button>
          </form>
        </div>

        <div className='userList'>
          {users.map((u, index) => (
            <div key={index} className='user' onClick={() => selectUser(u)}>
              <div className="profile">
                <img src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg" alt="" />
              </div>
              <div>
                <p>{u.username}</p>
                <p style={{
                  color: 'gray',
                  fontSize: '12px',

                }}>{u.message && 'New message'}</p>
              </div>
            </div>
          ))}
        </div>
        <div className='bottom'>
          <button className='logout' onClick={handleLogout}>
            Logout
          </button>
          <div className="profile">
            {loginUser}
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg" alt="" />
          </div>
        </div>
      </div>
      <div className='right'>
        <ChatScreen selectedUser={selectedUser} socket={socket} recieveMessages={recieveMessages} setRecieveMessages={setRecieveMessages} />
      </div>
    </div>
  );
};

export default LandingPage;
