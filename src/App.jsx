import React, {useState, useEffect} from 'react'
import Navbar from './components/Navbar'
import Chatlist from './components/Chatlist'
import Chatbox from './components/Chatbox'
import Login from './components/Login'
import Register from './components/Register'
import {auth} from './firebase/firebase'

const App = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null); 
  const [selectedUser, setSelectedUser] = useState(null);
   const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth.currentUser
    if (currentUser) {
      setUser(currentUser);
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    //cleanup function
    return () => unsubscribe()
  }, []);


  return (
    <div>
     {user ? (
      <div className='container flex lg:flex-row flex-col items-start w-[100%]'>
        <Navbar setSelectedUser={setSelectedUser}/>
        <Chatlist setSelectedUser={setSelectedUser}/>
        <Chatbox  selectedUser={selectedUser} />
      </div>
     ) : (
       <div>
        {isLogin ? <Login isLogin={isLogin} setIsLogin={setIsLogin}/> : <Register isLogin={isLogin} setIsLogin={setIsLogin}/>}
      </div>
     )}
     
    </div>
  )
}

export default App;