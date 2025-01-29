

import React, { useState } from 'react';
import { signInWithEmailAndPassword, updatePassword } from 'firebase/auth';
import { auth } from '../firebaseconfig';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FcLeft } from "react-icons/fc";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [resetMessage, setResetMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check user role and navigate accordingly
      const idTokenResult = await user.getIdTokenResult();
      if (idTokenResult.claims.admin) {
        navigate('/admin'); // Navigate to admin page if user is an admin
      } else {
        navigate('/main'); // Navigate to main page if user is a normal user
      }

    } catch (error) {
      setError(error.message);
      console.error('Error:', error.message);
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updatePassword(user, newPassword);
      setResetMessage('Password updated successfully!');
      setShowForgotPassword(false);
    } catch (error) {
      setError(error.message);
      console.error('Error:', error.message);
    }
  };

  return (
    
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <Link to="/"><FcLeft className='size-7'/></Link>
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="button"
            onClick={handleLogin}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </form>
        <div className='flex justify-between'>
        <p>New User!</p>
        <Link className='text-blue-800 text-xl hover:underline' to="/signup">SignUp</Link>
        </div>
        <div className="text-center mt-4">
          <button
            onClick={() => setShowForgotPassword(true)}
            className="text-blue-500 hover:underline"
          >
            Forgot Password?
          </button>
        </div>
      </div>

      {showForgotPassword && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-center">Reset Password</h2>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handlePasswordUpdate}
              className="w-full bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-600 transition duration-300"
            >
              Update Password
            </button>
            <button
              onClick={() => setShowForgotPassword(false)}
              className="w-full bg-red-500 text-white p-2 rounded mt-2 hover:bg-red-600 transition duration-300"
            >
              Cancel
            </button>
            {resetMessage && <p className="text-green-500 text-sm mt-4">{resetMessage}</p>}
          </div>
          
        </div>
        
      )}
    </div>
  );
};

export default LoginPage;

