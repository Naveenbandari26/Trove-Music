import React from 'react';
import mainpic from '../main-intro.png';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className='bg-[#212529]'>
      <div className='w-full  flex flex-col h-[100vh]'>
        <div className='w-full  flex justify-between px-10 py-3 w-90% h-[70px] bg-transparent sticky top-1'>
          <h1 className=' text-4xl text-white'>Trove</h1>
          <div className='flex gap-[2em]'>
            <Link to='/signup' ><button className='border-2 rounded-[10px] text-white py-2 w-auto px-3'>Get Started</button></Link>
            <Link to='/login'><button className='border-2 rounded-[10px] text-white py-2 w-auto px-3 bg'>Login</button></Link>
          </div>
        </div>
        <div className="w-90% flex flex-col justify-around items-center">
          <div className="info text-white text-2xl flex flex-col justify-center items-center ">
            <h2 className='text-6xl px-5  mb-3 font-mono'>We presenting </h2>
            <h1 className='text-7xl mt-2 mb-1'>Trove</h1>
            <p className='text-sm opacity-[0.5]'>where you can enjoy all the playlist and experience extra features!!</p>
            
          </div>
          <div className="mt-[-00px]">
            <img className='w-100% h-[70vh]' src={mainpic} alt="img" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
