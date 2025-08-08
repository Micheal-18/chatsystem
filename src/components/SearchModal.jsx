import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { FaXmark } from 'react-icons/fa6'
import { RiSearchLine } from 'react-icons/ri'
import defaultAvater from "../assets/Default.png"
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from "../firebase/firebase"

const SearchModal = ({ startChat }) => {

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);

  const openModal = () => {
    setIsOpen(true);
  }
  const closeModal = () => {
    setIsOpen(false);
  }

  const handleInput = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      alert('Please enter a search term')
      return;
    }

    try {
      const normalizedSearchTerm = searchTerm.toLowerCase();
      const q = query(
        collection(db, "users"), where("username", ">=", normalizedSearchTerm), where("username", "<=", normalizedSearchTerm + "\uf8ff")
      );


      const querySnapShot = await getDocs(q);

      const foundUsers = [];

      querySnapShot.forEach((doc) => {
        foundUsers.push(doc.data());
      });

      setUsers(foundUsers);

      if (foundUsers.length === 0) {
        alert("No users found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(users);


  return (
    <div>
      <button onClick={openModal} className='bg-[#D9F2ED] w-10 h-10 flex items-center justify-center rounded-lg'>
        <RiSearchLine color='#10AA85' className='w-6 h-6 text-gray-500 ' />
      </button>
      {isOpen && (
        <div className='fixed inset-0 z-[100] flex justify-center items-center bg-[#00170cb7]' onClick={closeModal}>
          <div className='relative p-4 w-full max-w-md  max-h-full' onClick={(e) => e.stopPropagation()}>
            <div className='relative bg-[#01AA85] w-[100%] p-3 rounded-md shadow-lg'>
              <div className='flex items-center justify-between p-4 md:p-5 border-b border-gray-200'>
                <h3 className='text-xl font-semibold text-gray-300'>Search Chat</h3>
                <button onClick={closeModal} className='text-gray-300 bg-transparent hover:bg-[#d9f2ed] hover:text-[#01AA85] rounded-lg text-sm  w-8 h-8 inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-200' type='button'>
                  <FaXmark size={20} />
                </button>
              </div>
              <div className='p-4 md:p-5'>
                <div className='space-y-4'>
                  <div className='flex gap-2'>
                    <input onChange={handleInput} type='text' className='bg-gray-300 text-gray-900 outline-none rounded-lg w-[100%] p-2' placeholder='Search users' />
                    <button onClick={handleSearch} className='bg-green-900 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition duration-200'>
                      <FaSearch />
                    </button>
                  </div>
                </div>
                <div className='mt-6 space-y-3'>
                  {users?.map((user) => (
                    <div onClick={() => {
                      console.log(user);
                      startChat(user);
                      closeModal();
                    }} className='flex items-start gap-3 bg-[#15eabc34] rounded-lg p-2 cursor-pointer border border-[#ffffff20] shadow-sm hover:shadow-md transition duration-200'>
                      <img src={user?.image || defaultAvater} className='w-10 h-10 rounded-full object-cover' />
                      <span>
                        <h2 className='p-0 md:text-lg text-gray-300 font-semibold'>{user?.fullName || "Default User"}</h2>
                        <p className='p-0 text-xs text-gray-300'>@{user?.username}</p>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchModal