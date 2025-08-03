import Reac, {useState} from 'react'
import { FaSignInAlt } from 'react-icons/fa'

const Login = () => {

    const [userData, setUserData] = useState({
         email: '', password: ''
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
          alert("Login successful!");
        } catch (error) {
          console.log(error);
          
        }
      }

  return (
        <section className='container'>
        <div className="w-90 p-4 bg-white shadow-lg rounded-lg">
            <div className='text-center'>
                <h1 className='text-[20px] font-bold'>Sign Up</h1>
                <p className='text-xs text-gray-400'>Welcome back, login to continue </p>
            </div>

            <form className='mt-5 space-y-2'>  
                   
                    <input type="email" onChange={handleChangeUser} name="email" placeholder='Email' className="p-2 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
                
                    <input type="password" onChange={handleChangeUser} name="password" placeholder='password' className="p-2 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
                
                <button type="submit" onClick={handleAuth} className="w-full flex items-center justify-center gap-2 mb-2 bg-green-700 text-white p-2 rounded-md hover:bg-green-400 over:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-black">Login  <FaSignInAlt /> </button>

                <div className='mt-5 text-center text-grey-400 text-sm'>
                  <button>Don't have an account? Sign Up</button>  
                </div>
            </form>
        </div>
    </section>
  )
}

export default Login