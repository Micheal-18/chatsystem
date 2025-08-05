import React from 'react'
import { RiSearchLine } from 'react-icons/ri'

const SearchModal = () => {
  return (
    <div>
      <button className='bg-[#D9F2ED] w-10 h-10 flex items-center justify-center rounded-lg'>
        <RiSearchLine color='#10AA85' className='w-6 h-6 text-gray-500 ' />
      </button>
    </div>
  )
}

export default SearchModal