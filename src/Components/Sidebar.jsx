import React from 'react'
import { NavLink } from 'react-router-dom'
import authService from '../Appwrite/AuthService'
import MailService from '../Appwrite/MailService';

function Sidebar() {
    const [unSeenMails, setUnSeenMails] = React.useState(0);

    React.useEffect(() => {
        const fetchMails = async () => {
            try {
                const response = await MailService.getUnseenMailCount();
                setUnSeenMails(response.length);
            } catch (error) {
                console.log(error);
            }
        }
        fetchMails();
    }, []);

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
        <nav className='fixed w-72 h-full bg-slate-300'>
            <ul className='p-4'>
                <li>
                    <NavLink
                    to='/'
                    className={({ isActive }) => ` ${isActive ? 'text-red-500' : 'text-black'} p-4 block text-center hover:text-red-500 hover:bg-slate-600 rounded-lg`}
                    >Home</NavLink>
                </li>
                <li>
                    <NavLink
                    to='/mails'
                    className={({ isActive }) => ` relative ${isActive ? 'text-red-500' : 'text-black'} p-4 block text-center hover:text-red-500 hover:bg-slate-600 rounded-lg`}
                    >Message
                    <span className='absolute right-5 text-gray-100 bg-gray-400 px-2 rounded-md ' >{unSeenMails}</span>
                    </NavLink>
                </li>
                <li>
                    <div
                    onClick={handleLogout}
                    className={`text-black p-4 block text-center hover:text-red-500 hover:bg-slate-600 rounded-lg cursor-pointer`}
                    >Logout</div>
                </li>
            </ul>
        </nav>
    </>
  )
}

export default Sidebar