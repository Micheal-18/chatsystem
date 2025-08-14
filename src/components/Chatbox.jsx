import React, { useState, useEffect, useMemo, useRef } from 'react'
import defaultAvater from "../assets/Default.png"
import { RiArrowLeftRightFill, RiEmojiStickerFill, RiMicFill, RiMore2Line, RiPhoneFill, RiPhoneLine, RiSearchLine, RiSendPlaneFill, RiVideoChatLine, RiVideoFill } from 'react-icons/ri'
import { formatTimestamp } from '../utils/formatTimestamp'
import Logo from '../assets/chaticon.png'
import { messageData } from '../data/messageData'
import { auth, listenForMessages, sendMessage } from "../firebase/firebase";
import { TbArrowsDiagonalMinimize } from 'react-icons/tb'
import { MdCallEnd } from 'react-icons/md'
import EmojiPicker from 'emoji-picker-react'


const Chatbox = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [messageText, sendMessageText] = useState('')
  const scrollRef = useRef(null)
  const [openVideocall, setOpenVideoCall] = useState();
  const [openEmoji, setOpenEmoji] = useState();
  const textareaRef = useRef(null);

  const handleTextChange = (e) => {
    sendMessageText(e.target.value);

    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleOpenEmoji = () => {
    setOpenEmoji(true);
  }

  const handleCloseEmoji = () => {
    setOpenEmoji(false);
  }

  const handleOpenVideoCall = () => {
    setOpenVideoCall(true);
  }

  const handleCloseVideoCall = () => {
    setOpenVideoCall(false);
  }

  // optional chaining ? to prevent breakdown when the auth has not been set
  const chatId = auth?.currentUser?.uid < selectedUser?.uid ? `${auth?.currentUser?.uid}-${selectedUser?.uid}` : `${selectedUser?.uid}-${auth?.currentUser?.uid}`;
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
      const aTimestamp = a?.timestamp?.seconds + a?.timestamp?.nanoseconds / 1e9;
      const bTimestamp = b?.timestamp?.seconds + b?.timestamp?.nanoseconds / 1e9;
      return aTimestamp - bTimestamp;
    });
  }, [messages]);



  // Clear input and optionally messages when switching chats
  useEffect(() => {
    sendMessageText("");
    setMessages([]);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [selectedUser]);

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
      {selectedUser ? <section className=' flex flex-col items-start justify-start h-screen w-[100%] background'>
        <header className='flex justify-between border-b border-gray-300 w-[100%] h-[82px] md:h-fit p-4 bg-gray-200 opacity-90'>
          <main className='flex items-center gap-3'>
            <span className=''>
              <img src={selectedUser?.image || defaultAvater} alt="Default Avatar" className='w-10 h-10 rounded-full object-cover' />
            </span>
            <span>
              <h3 className='text-lg text-black font-semibold'>{selectedUser?.fullName?.split(" ")[0] || "ChatApp User"}</h3>
              <p className='p-0 font-light text-sm text-black'>@{selectedUser?.username || "ChatApp"}</p>
            </span>

          </main>
          <div className='flex items-center justify-center gap-1 md:gap-3 '>
            <button onClick={handleOpenVideoCall} className='bg-[#D9F2ED] w-10 h-10 flex items-center justify-center rounded-lg'>
              <RiVideoChatLine />
            </button>

            <button className='bg-[#D9F2ED] w-10 h-10 flex items-center justify-center rounded-lg'>
              <RiPhoneLine />
            </button>
            <button className='bg-[#D9F2ED] w-10 h-10 flex items-center justify-center rounded-lg'>
              <RiMore2Line color='#10AA85' className='w-6 h-6 text-gray-500 ' />
            </button>
          </div>
        </header>
        {openVideocall && (
          <div className='absolute z-[100] mx-5  w-[50%] h-[100vh] rounded-md bg-black'>
            <header className='flex items-center justify-end p-2  w-full  '>
              <button onClick={handleCloseVideoCall} className='w-10 h-10 bg-white rounded-full flex justify-center items-center'>
                <TbArrowsDiagonalMinimize className='text-sm md:text-lg' />
              </button>
            </header>

            <div className='flex items-center justify-center pt-16'>
              <span >
                <img src={defaultAvater} alt='' className='object-contain h-40' />
              </span>
            </div>

            <div className='flex items-start justify-start p-4'>
              <div className='flex items-center justify-center w-20 h-30 bg-white rounded-md'>
                <span>
                  <img src={defaultAvater} alt='' className='object-contain h-5' />
                </span>
              </div>
            </div>

            <footer className='flex item-center justify-center'>
              <div className='flex space-x-6 pt-20 '>
                <button className='w-10 h-10 bg-white rounded-full flex justify-center items-center'>
                  <RiVideoChatLine />
                </button>
                <button className='w-10 h-10 bg-white rounded-full flex justify-center items-center'>
                  <RiMicFill />
                </button>
                <button className='w-10 text-white h-10 bg-red-700 rounded-full flex justify-center items-center'>
                  <MdCallEnd />
                </button>
              </div>
            </footer>
          </div>
        )}

        <main className='custom-scrollbar relative h-[100vh] w-[100%] flex flex-col justify-between'>
          <section className='px-3  pt-5 b-20 lg:pb-10'>
            <div ref={scrollRef} className='overflow-auto h-[80vh]'>
              {sortedMessages?.map((msg, index) => (
                <>
                  {msg?.sender === senderEmail ?
                    <div className='flex  flex-col items-end w-full'>
                      <span className='flex gap-3 me-10 h-auto'>
                        <div className='h-auto'>
                          <div className='flex items-center justify-center p-6 rounded-lg bg-gray-100'>
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
                            <div className='flex items-center justify-center p-6 rounded-lg bg-gray-100'>
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
            <form onSubmit={handleSendMessage} action="" className='w-[100%] h-18 p-4 bg-gray-100 opacity-90  rounded-lg relative shadow-lg flex items-center gap-3 border-t border-gray-300'>
              <button onClick={handleOpenEmoji} type='button' className='bg-green-300 w-10 h-10 flex items-center  justify-center rounded-full'><RiEmojiStickerFill /></button>
              {openEmoji && (<div className="absolute bottom-16 left-3 z-50">
                <EmojiPicker
                  onEmojiClick={(emoji) => sendMessageText(messageText + emoji.emoji)}

                  disableSearchBar={true}
                  disableSkinTonePicker={true}
                  width={300}
                  height={400}
                />
              </div>)}
              <textarea value={messageText} onChange={handleTextChange} onClick={handleCloseEmoji} placeholder='Type a message...' className='relative w-full resize-none overflow-hidden  whitespace-pre-wrap break-words p-2 border border-gray-300 rounded-md text-sm leading-snug focus:outline-none focus:ring-2 focus:ring-gray-400' />
              <button style={{ alignSelf: "center" }} type='submit' className='flex items-center justify-center right-6 absolute p-2 rounded-full bg-green-300 hover:bg-green-400'>
                <RiSendPlaneFill color='green' />
              </button>
            </form>
          </div>
        </main>
      </section> :
        <section className='bg-white h-screen w-[100%]'>
          <div className='flex flex-col items-center justify-center h-full'>
            <img src={Logo} alt="Default Avatar" className='w-20 h-20 rounded-full object-cover mt-5' />
            <h3 className='font-bold text-xl text-green-700'>Welcome to RealChat</h3>
            <p className='text-gray-400 text-sm mt-2'>Click on a user from the chat list to start a conversation.</p>
            <p className='text-gray-400 text-sm mt-2'>Or use the search feature to find users.</p>
          </div>
        </section>}
    </>
  )
}

export default Chatbox