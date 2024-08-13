import React, { useState, useEffect } from 'react';
import MailService, { Mail } from '../Appwrite/MailService';
import { FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

function Messages() {
  const [loading, setLoading] = useState(true);
  const [mails, setMails] = useState([]);
  const [offset, setOffset] = useState(0);
  const [showSeeMore, setShowSeeMore] = useState(false);
    const navigate = useNavigate();

  async function fetchMails(limit, offset) {
    try {
      const newMails = await MailService.getMail(limit, offset);

      // Check if there are any duplicate mails
      const uniqueMails = newMails.filter(
        (newMail) => !mails.some((mail) => mail.$id === newMail.$id)
      );

      // Update the mails state and offset
      setMails([...mails, ...uniqueMails]);
      setOffset(offset + limit);

      // Update the showSeeMore state
      setShowSeeMore(uniqueMails.length === limit);
    } catch (error) {
      console.log('Appwrite service :: getMails :: error', error);
      throw error;
    }
  }

  useEffect(() => {
    fetchMails(2, 0);
  }, []);

  async function deleteMail(id) {
    try {
      await MailService.deleteMail(id);
      setMails(mails.filter((mail) => mail.$id !== id));
      if (mails.length <= 2) {
        setShowSeeMore(false);
      }
    } catch (error) {
      console.log('Appwrite service :: deleteMail :: error', error);
      throw error;
    }
  }



  async function markAsSeen(id) {
    try {
      MailService.updateMail(id, true);
      setMails(
        mails.map((mail) => {
          if (mail.$id === id) {
            return { ...mail, seen: true };
          }
          return mail;
        })
      );
    } catch (error) {
      console.log('Appwrite service :: markAsSeen :: error', error);
      throw error;
    }
  }

  const handleMailClick = (id) => {
    markAsSeen(id);
    navigate(`/mail/${id}`);
  };

  function truncateMessage(message) {
    if (message.length > 60) {
      return message.substring(0, 60) + '...';
    }
    return message;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {mails.map((mail) => (
        <div onClick={() =>handleMailClick(mail.$id)} key={mail.$id} className={`flex cursor-pointer shadow-md rounded-lg p-4 mb-4 ${mail.seen ? 'bg-white' : 'bg-gray-100'}`}>
          <div className="flex-1">
            <h3 className="sm:text-lg font-bold text-gray-800">{mail.name}</h3>
            <h3 className="text-sm font-semibold  text-gray-800">{mail.subject}</h3>
            <p className="text-xs sm:text-sm text-gray-600">{truncateMessage(mail.message)}</p>
            <p className="text-xs sm:text-sm text-gray-500">{new Date(mail.$createdAt).toLocaleString()}</p>
          </div>
          <button
            onClick={(e) => {
                e.stopPropagation();
                deleteMail(mail.$id);
              }}
            className="text-red-500  hover:text-red-700 transition-colors duration-300 border-l pl-4"
          >
            <FiTrash2 className="w-6 h-6" />
          </button>
        </div>
      ))}
      {showSeeMore && mails.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={() => fetchMails(2, offset)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
          >
            See More
          </button>
        </div>
      )}
    </div>
  );
}

export default Messages;
