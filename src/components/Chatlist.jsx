import React, {useState, useEffect, useMemo} from 'react'
import defaultAvater from "../assets/Default.png"
import { RiMore2Fill } from 'react-icons/ri'
import SearchModal from './SearchModal'
import  {formatTimestamp}  from '../utils/formatTimestamp'
import { listenForChats } from '../firebase/firebase'
import chatData  from '../data/Chat'

const Chatlist = () => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const unsubscribe = listenForChats(setChats);
    // Initializing with static data for development purposes

    return () => {
      unsubscribe(); // Clean up the listener on component unmount
    } 
  }, []);

  const sortedChats = useMemo(() => {
    // spread operator to retain and return a new array
    return [...chats].sort((a, b) => {
      const aTimestamp = a.lastMessageTimestamp.seconds + a.lastMessageTimestamp.nanoseconds / 1e9 ;
      const bTimestamp = b.lastMessageTimestamp.seconds + b.lastMessageTimestamp.nanoseconds / 1e9 ;
      return bTimestamp - aTimestamp; // Sort in descending order
    });
  }, [chats]);

  return (
    <section className='relative hidden lg:flex flex flex-col items-start justify-start bg-gray-200 h-[100vh] w-[100%] md:w-[600px]'>
      <header className='flex items-center justify-between w-[100%] p-2 border-b-2 border-gray-200  sticky md:static z-[100] top-0'>
        <main className='flex items-center justify-start gap-4 p-2'>
          <img src={defaultAvater} alt="Default Avatar" className='w-10 h-10 rounded-full object-cover' />

          <span className='flex flex-col items-start justify-start'>
            <h1 className='p-0 md:text-lg text-black font-semibold'>{"Jane Gold"}</h1>
            <p className='p-0 font-light text-xs text-gray-400'>{"@Chatfrik"}</p>
          </span>
        </main>
        <button className='bg-[#D9F2ED] w-10 h-10 flex items-center justify-center rounded-lg'>
          <RiMore2Fill color='#01AA85' className='w-8 h-8'/>
        </button>
      </header>

      <div className='w-[100%] mt-2 px-5'>
        <header className='flex items-center justify-between'>
          <h3 className='text-[16px]'>Messages 
            ({chats?.length || 0})</h3>
          <SearchModal />
        </header>
      </div>

      <main className='flex flex-col items-start justify-start w-[100%] gap-2 p-5 overflow-y-auto h-[calc(100vh-7rem)]'>

        {sortedChats?.map((chat) => (
           <button key={chat?.uid} className='flex items-start justify-between w-[100%] p-3 px-2 border-b border-[#9090902c]'> 
         {chat?.users?.filter((user) => user?.email !== "baxo@mailinator.com").map((user) => (
           <>
          <div className='flex items-start gap-3'>
            <img src={user?.image} alt="Default Avatar" className='w-10 h-10 rounded-full object-cover' />
            <span>
              <h1 className='p-0 text-[17px] text-left text-[#2A3d39] font-semibold'>{user?.fullName  || "ChatFrik User"}</h1>
              <p className='p-0 text-left font-light text-[14px] text-[#2A3d39]'>{chat?.lastMessage}</p>
            </span>
          </div>
          <p className='p-0 text-left font-regular text-[11px] text-gray-400'>{formatTimestamp(chat?.lastMessageTimestamp)}</p>
          </>
         ))}
        </button>
        ))}
       
      </main>
    </section>
  )
}

export default Chatlist