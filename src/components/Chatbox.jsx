import React, { useState, useEffect, useMemo, useRef } from 'react'
import defaultAvater from "../assets/Default.png"
import { RiSendPlaneFill } from 'react-icons/ri'
import { formatTimestamp } from '../utils/formatTimestamp'
import Logo from '../assets/chaticon.png'
import { messageData } from '../data/messageData'
import { auth, listenForMessages, sendMessage } from "../firebase/firebase";

const Chatbox = ({selectedUser}) => {
  const [messages, setMessages] = useState([]);
  const [messageText, sendMessageText] = useState('')
  const scrollRef = useRef(null)

  // optional chaining to prevent breakdown when the auth has not been set
  const chatId =  auth?.currentUser?.uid < selectedUser?.uid ? `${auth?.currentUser?.uid}-${selectedUser?.uid}` : `${selectedUser?.uid}-${auth?.currentUser?.uid}`;
  const user1 = auth?.currentUser;
  const user2 = selectedUser;
  const senderEmail = auth?.currentUser?.email;

     useEffect(() => {
        listenForMessages(chatId, setMessages);
    }, [chatId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages])


  // to memorize, store and return calculated value
  const sortedMessages = useMemo(() => {
    // spread operator to retain and return a new array
    return [...messages].sort((a, b) => {
      const aTimestamp = a?.timestamp.seconds + a?.timestamp.nanoseconds / 1e9;
      const bTimestamp = b?.timestamp.seconds + b?.timestamp.nanoseconds / 1e9;
      return aTimestamp - bTimestamp; 
    });
  }, [messages]);


  const handleSendMessage = (e) => {
    e.preventDefault();

    const newMessage = {
      sender: senderEmail,
      text: messageText,
      timestamp: {
        seconds: Math.floor(Date.now() / 1000),
        nanoseconds: 0,
      },
    };

    sendMessage(messageText, chatId, user1?.uid, user2?.uid);
    // Add the new message to the messages state
    setMessages((prevMessage) => [...prevMessage, newMessage])
    // Clear the input field after sending the message
    sendMessageText("");
  };

  return (
   <>
   {selectedUser ?  <section className=' flex flex-col items-start justify-start h-screen w-[100%] background'>
      <header className='border-b border-gray-300 w-[100%] h-[82px] md:h-fit p-4 bg-gray-200'>
        <main className='flex items-center gap-3'>
          <span className=''>
            <img src={selectedUser?.image || defaultAvater} alt="Default Avatar" className='w-10 h-10 rounded-full object-cover' />
          </span>
          <span>
            <h3 className='text-lg text-black font-semibold'>{selectedUser?.fullName || "RealChat"}</h3>
            <p className='p-0 font-light text-sm text-black'>@{selectedUser?.username || "RealChat"}</p>
          </span>
        </main>
      </header>

      <main className='custom-scrollbar relative h-[100vh] w-[100%] flex flex-col justify-between'>
        <section className='px-3 pt-5 b-20 lg:pb-10'>
          <div ref={scrollRef} className='overflow-auto h-[80vh]'>
            {sortedMessages?.map((msg, index) => (
              <>
                {msg?.sender === senderEmail ?
                  <div className='flex flex-col items-end w-full'>
                    <span className='flex gap-3 me-10 h-auto'>
                      <div className='h-auto'>
                        <div className='flex items-center justify-center p-6 rounded-lg bg-gray-300'>
                          <h4 className='font-medium text-lg text-grey-800 w-full break-words'>{msg.text}</h4>
                        </div>
                        <p className='text-right text-sm text-gray-300 mt-3'>{formatTimestamp(msg?.timestamp)}</p>
                      </div>
                    </span>
                  </div> : (
                  <div className='flex flex-col items-start w-full mt-5'>
                    <span className='flex gap-3 w-[40%] h-auto ms-10'>
                      <img src={defaultAvater} alt="Default Avatar" className='w-10 h-10 rounded-full object-cover' />
                      <div>
                        <div className='flex items-center justify-center p-6 rounded-lg bg-gray-200'>
                          <h4>{msg.text}</h4>
                        </div>
                        <p className=' text-sm text-gray-300 mt-3'>{formatTimestamp(msg?.timestamp)}</p>
                      </div>
                    </span>
                  </div>
                )}
              </>
            ))}
          </div>
        </section>
        <div className='sticky lg:bottom-0 p-3 bottom-4 h-fit w-[100%]'>
          <form onSubmit={handleSendMessage} action="" className='w-[100%] h-18 p-4 bg-gray-300 rounded-lg relative shadow-lg flex items-center gap-3 border-t border-gray-300'>
            <input value={messageText} onChange={(e) => sendMessageText(e.target.value)} type="text" placeholder='Type a message...' className='h-full relative pl-2 pr-4 w-[100%] rounded-lg  text-gray-900 ' />
            <button type='submit' className='flex items-center justify-center right-6 absolute p-2 rounded-full bg-green-300 hover:bg-green-400'>
              <RiSendPlaneFill color='green' />
            </button>
          </form>
        </div>
      </main>
    </section> : 
    <section className='bg-white h-screen w-[100%]'>
      <div className='flex flex-col items-center justify-center h-full'>
      <img src={Logo} alt="Default Avatar" className='w-20 h-20 rounded-full object-cover mt-5' />
      <h3 className='font-bold text-xl text-green-700'>Welcome to Chatfrik</h3>
      <p className='text-gray-400 text-sm mt-2'>Click on a user from the chat list to start a conversation.</p>
      <p className='text-gray-400 text-sm mt-2'>Or use the search feature to find users.</p>
      </div>
      </section>}
   </>
  )
}

export default Chatbox