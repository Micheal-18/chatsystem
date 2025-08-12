import React, { useEffect, useMemo, useState } from 'react'
import defaultAvater from "../assets/Default.png"
import chat from '../assets/chaticon.png'
import { signOut } from 'firebase/auth'
import { auth, db, listenForChats } from '../firebase/firebase'
import { RiArrowDownSLine, RiArrowUpDownLine, RiArrowUpSLine, RiBardLine, RiChatAiLine, RiFile4Line, RiFolderUserLine, RiNotificationLine, RiShutDownLine } from 'react-icons/ri'
import SearchModal from './SearchModal'
import { doc, onSnapshot } from 'firebase/firestore'
import { formatTimestamp } from '../utils/formatTimestamp'

const Navbar = ({ setSelectedUser }) => {

  const [chats, setChats] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userDocRef = doc(db, "users", auth?.currentUser?.uid);
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      setUser(doc.data());
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = listenForChats(setChats);

    return () => {
      unsubscribe();
    };
  }, []);

  const sortedChats = useMemo(() => {
    // spread operator to retain and return a new array
    return [...chats].sort((a, b) => {
      const aTimestamp = a?.lastMessageTimestamp?.seconds + a?.lastMessageTimestamp?.nanoseconds / 1e9;
      const bTimestamp = b?.lastMessageTimestamp?.seconds + b?.lastMessageTimestamp?.nanoseconds / 1e9;
      return bTimestamp - aTimestamp; // Sort in descending order
    });
  }, [chats]);


  const startChat = (user) => {
    setSelectedUser(user);
  };

  const [click, setClick] = useState(false);

  const handleClick = () => {
    setClick(!click);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      alert("User signed out successfully");
    } catch (error) {
      alert("Error signing out: ", error);
    }
  };
  return (
    <section className='relative z-50 w-full'>
      <div className='sticky lg:static top-0 flex items-center lg:items-start lg:justify-start h-[7vh] lg:h-[100vh]  w-[100%] lg:w-[10%]  text-white py-8 lg:py-0'>
      <main className='flex lg:flex-col items-center justify-between w-[100%] lg:gap-10 lg:px-0'>
        <div className='flex items-start justify-center lg:border-b-1 border-[#fff] lg:w-[100%] p-4'>
          <span className='flex justify-center items-center'>
            <img src={chat} alt="" className='lg:h-10 h-10 object-contain bg-white rounded-md' />
          </span>
        </div>

        <ul className='flex flex-row lg:flex-col items-center gap-7 md:gap-10 lg:pt-4 px-2 md:px-0 lg:text-[16px] text-[18px] '>
          <li>
            <button className='lg:flex hidden lg:flex-col text-white cursor-pointer'><RiChatAiLine /></button>
          </li>

          <li>
            <button className='lg:flex hidden lg:flex-col text-white cursor-pointer'><RiFolderUserLine /></button>
          </li>

          <li>
            <button className='lg:flex hidden lg:flex-col text-white cursor-pointer'><RiNotificationLine /></button>
          </li>

          <li>
            <button className='lg:flex hidden lg:flex-col text-white cursor-pointer'><RiFile4Line /></button>
          </li>

          <li>
            <button className='lg:flex hidden lg:flex-col text-white cursor-pointer'><RiBardLine /></button>
          </li>
        </ul>
        <button onClick={handleSignOut} className='text-white cursor-pointer'><RiShutDownLine /></button>
        <button onClick={handleClick} className='block lg:hidden  text-white lg:text-2xl text-lg cursor-pointer'>{click ? <RiArrowUpSLine /> : <RiArrowDownSLine />}</button>
        {click && ((<div className='lg:hidden absolute top-[7vh] right-4 bg-gray-100 text-white w-[60%] h-[60vh] rounded-lg z-[1000] flex flex-col items-center justify-start gap-4 p-2 mt-8'>
          <div className='flex items-start justify-start w-[100%] gap-3'>
            <SearchModal startChat={startChat} />
          </div>
          {sortedChats?.map((chat) => (
            <button key={chat?.id} className='flex items-start justify-between w-[100%] p-3 px-2 border rounded-md active border-[#9090902c]'>
              {chat?.users?.filter((user) => user?.email !== auth?.currentUser?.email).map((user) => (
                <>
                  <div className='flex items-start gap-3' onClick={() => startChat(user)}>
                    <img src={user?.image || defaultAvater} alt="Default Avatar" className='w-10 h-10 rounded-full object-cover' />
                    <span >
                      <h3 className='p-0 text-[12px] text-left text-[#2A3d39] font-semibold'>{user?.fullName.split(" ")[0] || "ChatApp User"}</h3>
                      <p className='p-0 text-left font-light text-[8px] text-[#2A3d39]'>{chat?.lastMessage}</p>
                    </span>
                  </div>
                  <div>
                    <p className='p-0 text-left font-regular text-[8px] text-gray-400'>{formatTimestamp(chat?.lastMessageTimestamp)}</p>
                    <p className='p-0 text-right font-regular text-[5px] text-gray-400'>{chat?.lastMessageTimestamp ? new Date(chat?.lastMessageTimestamp?.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "No messages"}</p>
                  </div>

                </>))}

            </button>))}
        </div>))}
      </main>
    </div>
    </section>  
  )
}

export default Navbar