import React from 'react'
import Navbar from './components/Navbar'
import Chatlist from './components/Chatlist'
import Chatbox from './components/Chatbox'
// import SearchModal from './components/SearchModal'
import Login from './components/Login'
import Regsiter from './components/Regsiter'

const App = () => {
  return (
    <div>
      <div className='container flex lg:flex-row flex-col items-start w-[100%]'>
        <Navbar />
        <Chatlist />
        <Chatbox />
      </div>
      {/* <SearchModal /> */}
      <div className='hidden'>
        <Login />
        <Regsiter />
      </div>
    </div>
  )
}

export default App