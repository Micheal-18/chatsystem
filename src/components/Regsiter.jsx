import React, { useState } from 'react'
import { FaUserPlus } from 'react-icons/fa'

const Regsiter = () => {

  const [userData, setUserData] = useState({
    fullName: '', email: '', password: ''
  });

  const handleChangeUser = (e) => {
    const { name, value } = e.target;

    // Update the userData state with the input values with spread operator
    setUserData((prevState) => ({ 
      ...prevState, 
      [name]: value,
    }));
  }

  const handleAuth = async () => {
    try {
      alert("Registration successful!");
    } catch (error) {
      console.log(error);
      
    }
  }

  return (
    <section className='container'>
        <div className="flex flex-col justify-center items-center w-100 h-120 p-5 bg-white shadow-lg rounded-lg">
            <div className='text-center mb-8'>
                <h1 className='text-[20px] font-bold'>Sign Up</h1>
                <p className='text-xs text-gray-400'>Welcome back, create an account to continue </p>
            </div>

            <form className='mt-5 space-y-2'>

                <input type='text' onChange={handleChangeUser} name='fullName' placeholder='Full Name' className="p-2  w-full border-gray-300 mb-3 bg-[#01aa851d] text-[#004939f3] rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />

                    <input type="email" onChange={handleChangeUser} name="email" placeholder='Email' className="p-2 w-full border-gray-300 mb-3 bg-[#01aa851d] text-[#004939f3] rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
                
                    <input type="password" onChange={handleChangeUser} name="password" placeholder='password' className="p-2  w-full border-green-200 mb-3 bg-[#01aa851d] text-[#004939f3] rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
                
                
                  <button onClick={handleAuth} type="submit" className="w-full flex justify-center items-center gap-2 mb-2 bg-green-700 text-white p-2 rounded-md hover:bg-green-400 over:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-black">Register <FaUserPlus /> </button>
                

                <div className='mt-5  text-center text-grey-400 text-sm'>
                  <button>Already have an account? Sign In</button>
                </div>
            </form>
        </div>
    </section>
  )
}

export default Regsiter