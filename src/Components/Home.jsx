import React from 'react'
import authService from '../Appwrite/AuthService'
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom'

function Home() {

    const handleLogout = async () => {
        try {
        await authService.logout();
        window.location.href = '/login';
        } catch (error) {
        console.log(error);
        }
    }

  return (
    <>
    <div className='flex flex-row '>
        <Sidebar />
        <div className='flex-grow ml-72'>
        <Outlet />
        </div>      
    </div>
    
    
    </>
    
  )
}

export default Home