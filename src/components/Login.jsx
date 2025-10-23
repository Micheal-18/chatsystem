import React, { useState } from 'react'
import { FaEye, FaEyeSlash, FaSignInAlt } from 'react-icons/fa'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase'

const Login = ({ isLogin, setIsLogin }) => {

  const [loading, setLoading] = useState(false);
  const [click, setClick] = useState(false);

  const handleClick = () => {
    setClick(!click)
  }

  const [userData, setUserData] = useState({
    email: '', password: ''
  });

  const handleChangeUser = (e) => {
    const { name, value } = e.target;

    // Update the userData state with the input values with spread operator and retaining
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

const handleAuth = async (e) => {
  e.preventDefault();
  if (loading) return;
  if (!userData.email || !userData.password) {
    alert("Please fill in all fields.");
    return;
  }

  setLoading(true);
  try {
    await signInWithEmailAndPassword(auth, userData.email, userData.password);
    alert("Login successful!");
    
  } catch (error) {
    let message = "";
    switch (error.code) {
      case "auth/user-not-found":
        message = "No account found with this email.";
        break;
      case "auth/wrong-password":
        message = "Incorrect password.";
        break;
      case "auth/invalid-email":
        message = "Invalid email address format.";
        break;
      default:
        message = "Login failed. Please try again.";
    }
    alert(message);
  } finally {
    setLoading(false);
  }
};


  return (
    <section className='container flex justify-center items-center'>
      <div className="w-90 p-4 bg-white shadow-lg rounded-lg">
        <div className='text-center'>
          <h1 className='text-[20px] font-bold'>Sign In</h1>
          <p className='text-xs text-gray-400'>Welcome back, login to continue </p>
        </div>

        <form className='mt-5 space-y-2'>

          <input type="email" onChange={handleChangeUser} name="email" placeholder='Email' className="p-2 w-full border-gray-300 bg-[#01aa851d] rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />

          <div className="relative w-full">
            <input
              type={click ? "text" : "password"}
              onChange={handleChangeUser}
              name="password"
              placeholder="password"
              className="p-2 block w-full border-gray-300 bg-[#01aa851d] rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pr-10" // added pr-10 to prevent text from overlapping icon
              required
            />

            {click ? (
              <FaEye
                onClick={handleClick}
                color="gray"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              />
            ) : (
              <FaEyeSlash
                onClick={handleClick}
                color="gray"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              />
            )}
          </div>


          <button disabled={loading} type="submit" onClick={handleAuth} className="w-full flex items-center justify-center gap-2 mb-2 bg-green-700 text-white p-2 rounded-md hover:bg-green-400 over:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-black"> {loading ? <><div className='loading'></div> Processing...</> : <>Login  <FaSignInAlt /></>} </button>

          <div className='mt-5 text-center text-grey-400 text-sm'>
            <button onClick={() => setIsLogin(!isLogin)}>Don't have an account? Sign Up</button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default Login