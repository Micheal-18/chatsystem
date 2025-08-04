import React from 'react'
import chat from '../assets/chaticon.png'
import { RiArrowDownSLine, RiBardLine, RiChatAiLine, RiFile4Line, RiFolderUserLine, RiNotificationLine, RiShutDownLine } from 'react-icons/ri'

const Navbar = () => {
  return (
    <section className='sticky lg:static top-0 flex items-center lg:items-start lg:justify-start h-[7vh] lg:h-[100vh]  w-[100%] lg:w-[10%] bg-green-800 text-white py-8 lg:py-0'>
      <main className='flex lg:flex-col items-center justify-between w-[100%] lg-gap-10 lg-px-0'>
        <div className='flex items-start justify-center lg:border-b-1 border-[#fff] lg:w-[100%] p-4'>
          <span className='flex justify-center items-center'>
            <img src={chat} alt="" className='lg:h-20 h-10 object-contain bg-white rounded-md' />
          </span>
        </div>

        <ul className='flex flex-row lg:flex-col items-center gap-7 md:gap-10 lg:pt-4 px-2 md:px-0 lg:text-[24px] text-[18px] '>
         <li>
          <button className='text-white cursor-pointer'><RiChatAiLine /></button>
         </li>

          <li>
          <button className='text-white cursor-pointer'><RiFolderUserLine/></button>
         </li>

          <li>
          <button className='text-white cursor-pointer'><RiNotificationLine /></button>
         </li>

          <li>
          <button className='text-white cursor-pointer'><RiFile4Line /></button>
         </li>

          <li>
          <button className='text-white cursor-pointer'><RiBardLine /></button>
         </li>

         <li>
          <button className='text-white cursor-pointer'><RiShutDownLine/></button>
         </li>

        </ul>  
          <button className='block lg:hidden text-white lg:text-2xl text-lg cursor-pointer'><RiArrowDownSLine/></button>

      </main>
    </section>
  )
}

export default Navbar