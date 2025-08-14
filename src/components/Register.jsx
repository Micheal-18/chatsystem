import React, { useState } from 'react'
import { FaEye, FaEyeSlash, FaUserPlus } from 'react-icons/fa'
import { auth, db } from '../firebase/firebase'
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { FaGoogle } from 'react-icons/fa6'

const Register = ({ isLogin, setIsLogin }) => {
  const [loading, setLoading] = useState(false);
  const [click, setClick] = useState(false);

  const handleClick = () => {
    setClick(!click)
  }

  const [userData, setUserData] = useState({
    fullName: '', email: '', password: ''
  });

  const handleChangeUser = (e) => {
    const { name, value } = e.target;

    // Update the userData state with the input values with spread operator and retaining the old input
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData?.email, userData?.password)
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid)

      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        username: user.email ? user.email.split('@')[0] : "unknown",
        fullName: userData.fullName,
        image: ""

      });
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope('profile'); provider.addScope('email');


    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);

      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        username: user.email?.split('@')[0],
        fullName: user?.displayName?.split(" ")[0] || "ChatApp User",
        image: user.photoURL || ""
      });

    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };


  return (
    <section className='container flex justify-center items-center'>
      <div className="flex flex-col justify-center items-center w-100 h-120 p-5 bg-white shadow-lg rounded-lg">

        {/* Google Sign In Button */}
        <div className='mt-2 mb-2 text-center text-gray-400 text-sm'>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex justify-center items-center gap-2 mb-2 bg-gradient-to-r from-blue-700 via-green-500 to-red-600  text-white p-2 rounded-md  hover:-translate-y-1 hover:scale-105 transition-transform"
          >
            Sign in with Google <FaGoogle />
          </button>
        </div>

        <div className='text-center mb-5'>
          <h1 className='text-[20px] font-bold'>Sign Up</h1>
          <p className='text-xs text-gray-400'>Welcome back, create an account to continue </p>
        </div>

        <form onSubmit={handleAuth} className='mt-5 space-y-2'>

          <input disabled={loading} type='text' onChange={handleChangeUser} name='fullName' placeholder='Full Name' className="p-2  w-full border-gray-300 mb-3 bg-[#01aa851d] text-[#004939f3] rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />

          <input disabled={loading} type="email" onChange={handleChangeUser} name="email" placeholder='Email' className="p-2 w-full border-gray-300 mb-3 bg-[#01aa851d] text-[#004939f3] rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />

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



          <button disabled={loading} type="submit" className="w-full flex items-center justify-center gap-2 mb-2 bg-green-700 text-white p-2 rounded-md hover:bg-green-400 over:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-black"> {loading ? <><div className='loading'></div> Processing...</> : <>Register <FaUserPlus /></>} </button>


        </form>

        <button onClick={() => setIsLogin(!isLogin)}>Already have an account? Sign In</button>
      </div>
    </section>
  )
}

export default Register