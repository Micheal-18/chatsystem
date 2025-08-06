import React, { useState, useEffect, useMemo, useRef } from 'react'
import defaultAvater from "../assets/Default.png"
import { RiSendPlaneFill } from 'react-icons/ri'
import { formatTimestamp } from '../utils/formatTimestamp'
import { messageData } from '../data/messageData'

const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [messageText, sendMessageText] = useState('')
  const scrollRef = useRef(null)
  const senderEmail = "baxo@mailinator.com"

  useEffect(() => {
    // Simulating fetching messages from a data source
    setMessages(messageData);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages])


  // to memorize, store and return calculated value
  const sortedMessages = useMemo(() => {
    // spread operator to retain and return a new array
    return [...messages].sort((a, b) => {
      const aTimestamp = a.timestamp.seconds + a.timestamp.nanoseconds / 1e9;
      const bTimestamp = b.timestamp.seconds + b.timestamp.nanoseconds / 1e9;
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

    // Add the new message to the messages state
    setMessages((prevMessage) => [...prevMessage, newMessage])
    sendMessageText("");
  };

  return (
    <section className=' flex flex-col items-start justify-start h-screen w-[100%] background'>
      <header className='border-b border-gray-300 w-[100%] h-[82px] md:h-fit p-4 bg-white'>
        <main className='flex items-center gap-3'>
          <span className=''>
            <img src={defaultAvater} alt="Default Avatar" className='w-10 h-10 rounded-full object-cover' />
          </span>
          <span>
            <h3 className='text-lg text-black font-semibold'>Jane Gold</h3>
            <p className='p-0 font-light text-sm text-black'>@Bobola</p>
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
                        <div className='flex items-center justify-center p-6 rounded-lg bg-white'>
                          <h4 className='font-medium text-lg text-grey-800 w-full break-words'>{msg.text}</h4>
                        </div>
                        <p className='text-right text-sm text-gray-300 mt-3'>{formatTimestamp(msg?.timestamp)}</p>
                      </div>
                    </span>
                  </div> :
                  <div className='flex flex-col items-start w-full mt-5'>
                    <span className='flex gap-3 w-[40%] h-auto ms-10'>
                      <img src={defaultAvater} alt="Default Avatar" className='w-10 h-10 rounded-full object-cover' />
                      <div>
                        <div className='flex items-center justify-center p-6 rounded-lg bg-white'>
                          <h4>{msg.text}</h4>
                        </div>
                        <p className=' text-sm text-gray-300 mt-3'>{formatTimestamp(msg?.timestamp)}</p>
                      </div>
                    </span>
                  </div>}


              </>
            ))}

          </div>
        </section>
        <div className='sticky lg:bottom-0 p-3 bottom-4 h-fit w-[100%]'>
          <form onSubmit={handleSendMessage} action="" className='w-[100%] h-18 p-4 bg-white rounded-lg relative shadow-lg flex items-center gap-3 border-t border-gray-300'>
            <input value={messageText} onChange={(e) => sendMessageText(e.target.value)} type="text" placeholder='Type a message...' className='h-full relative pl-2 pr-4 w-[100%] rounded-lg  text-gray-900 ' />
            <button type='submit' className='flex items-center justify-center right-6 absolute p-2 rounded-full bg-green-300 hover:bg-green-400'>
              <RiSendPlaneFill color='green' />
            </button>
          </form>
        </div>
      </main>
    </section>
  )
}

export default Chatbox