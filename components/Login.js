import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../firebase/firebase';
import firebase from '../firebase/firebase';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
// import UserDashboard from './UserDashboard';

export default function Login() {
  const auth = getAuth(firebase);

  const [user, setUser] = useState(null);

  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(true);

  const { login, signup, currentUser } = useAuth();
  console.log(currentUser);

  const provider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();
  const githubProvider = new GithubAuthProvider();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });
    return unsubscribe;
  }, [auth]);

  if (authLoading) {
    return <div className='loader-container'><div className='loader'>CodeLingo</div></div>;
  }

  
  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result.user);
    } catch (error) {
      const errorCode = error.code;

  
      if (errorCode === 'auth/popup-closed-by-user') {
        // Handle this error gracefully, such as displaying a message to the user
        console.log('Sign-in popup closed by the user');
      } else {
        // Handle other errors
        console.error('Error during sign-in:', error);
      }
    }


  };
  const signInWithFacebook = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      console.log(result.user);
    } catch (error) {
      const errorCode = error.code;

  
      if (errorCode === 'auth/popup-closed-by-user') {
        // Handle this error gracefully, such as displaying a message to the user
        console.log('Sign-in popup closed by the user');
      } else {
        // Handle other errors
        console.error('Error during sign-in:', error);
      }
    }
  };
  
  const signInWithGithub = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      console.log(result.user);
    } catch (error) {
      const errorCode = error.code;

  
      if (errorCode === 'auth/popup-closed-by-user') {
        // Handle this error gracefully, such as displaying a message to the user
        console.log('Sign-in popup closed by the user');
      } else {
        // Handle other errors
        console.error('Error during sign-in:', error);
      }
    }
  };


  const signOut = async () => {
    await auth.signOut();
  };


    async function submitHandler() {
        if (!email || !password) {
            setError('Please enter email and password')
            return
        }
        if (isLoggingIn) {
            try {
                await login(email, password)
            } catch (err) {
                setError('Incorrect email or password')
            }
            return
        }
        await signup(email, password)
    }

    return (
        <div className='flex-1 text-xs sm:text-sm duration-300  flex flex-col justify-center items-center gap-2 sm:gap-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black p-24 border border-white 
        '>
            <h1 className='font-extrabold select-none text-2xl sm:text-4xl uppercase'>{isLoggingIn ? 'Login' : 'register'}</h1>
            {error && <div className='w-full max-w-[40ch] border-rose-400 border text-center border-solid text-rose-400 py-2'>{error}</div>}
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email Address' className='outline-none duration-300 border-b-2 border-solid border-white focus:border-cyan-300 text-slate-900 p-2 w-full max-w-[40ch]' />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Password' className='outline-none text-slate-900 p-2 w-full max-w-[40ch] duration-300 border-b-2 border-solid border-white focus:border-cyan-300' />
            <button onClick={submitHandler} className='w-full max-w-[40ch] border border-white border-solid uppercase py-2 duration-300 relative after:absolute after:top-0 after:right-full after:bg-white after:z-10 after:w-full after:h-full overflow-hidden hover:after:translate-x-full after:duration-300 hover:text-slate-900'>
                <h2 className='relative z-20'>
                    SUBMIT
                </h2>
            </button>
            <h2 className='duration-300 hover:scale-110 cursor-pointer' onClick={() => setIsLoggingIn(!isLoggingIn)}>{!isLoggingIn ? 'Login' : 'Register'}</h2>
        
        {user ? (
  <div className="text-center flex flex-col gap-4 items-center mt-6">
    <div>Welcome, {(user).displayName ?? 'User'}!</div>
    <button onClick={signOut}>
      <div className="bg-red-600 text-white rounded-md p-1 w-32">
        Sign Out
      </div>
    </button>
  </div>
) : (
  <div className="text-center flex flex-col gap-4 items-center mt-6">
    <h4>Please Sign In To Continue </h4>
    <div className='flex flex-row gap-12'>
    <div>
    
    <button onClick={signIn}>
      <div className="bg-black hover:bg-white hover:text-black text-white border border-indigo-600 rounded-md p-2 w-48">
        Sign In with Google
      </div>
    </button>
    </div>
    <div>
   
    <button onClick={signInWithGithub}>
          <div className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-800 rounded-md p-2 w-48">
            Sign In with GitHub
          </div>
        </button>
    </div>
    </div>
    
   
    
      {/* <div className="flex gap-2">
        <button onClick={signInWithFacebook}>
          <div className="bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 rounded-md p-2 w-48">
            Sign In with Facebook
          </div>
        </button>
       
      </div> */}
  </div>
  
)}
        </div>
    )
}