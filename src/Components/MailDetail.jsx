import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MailService from '../Appwrite/MailService';
import { FiArrowLeft } from 'react-icons/fi';

function MailDetail() {
  const { id } = useParams();
  const [mail, setMail] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMail() {
      try {
        const mailData = await MailService.getMailById(id);
        setMail(mailData);
      } catch (error) {
        console.log('Appwrite service :: getMailById :: error', error);
        throw error;
      }
    }
    fetchMail();
  }, [id]);

  if (!mail) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-500 hover:text-blue-700 mb-4"
      >
        <FiArrowLeft className="mr-2" />
        Back
      </button>
      <div className="shadow-md rounded-lg p-4 bg-white">
        {/* /from */}
        <p className="text-sm text-gray-500">From</p>
        <p className="text-xl font-bold text-gray-800">{mail.name}</p>
        <p className="text-sm text-gray-500 mb-2">{mail.email}</p>

        <h1 className="font-semibold text-gray-800 mb-4">{mail.subject}</h1>
        <p className="text-gray-800 border-l-4 border-gray-400 pl-4 mb-4">{mail.message}</p>
        <p className="text-xs text-gray-500 mb-4">{new Date(mail.$createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
}

export default MailDetail;
