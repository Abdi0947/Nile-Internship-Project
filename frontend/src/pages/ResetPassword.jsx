// ResetPassword.jsx
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.patch(
        `http://localhost:5003/api/auth/reset-password/${token}`,
        { password }
      );
      setMessage(res.data.status);
    } catch (err) {
      setMessage(err.response.data.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
        Reset Your Password
      </h2>

      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4 transition"
      />

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-md transition"
      >
        Reset Password
      </button>

      {message && (
        <p className="mt-4 text-center text-sm text-green-600">{message}</p>
      )}
    </form>
  );
}
