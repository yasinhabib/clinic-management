import { useState } from 'react';
import { useMutation, useApolloClient } from '@apollo/client/react';
import { CREATE_STAFF, GET_USERS } from '../graphql/queries';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const CreateStaff = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [createStaff, { loading }] = useMutation(CREATE_STAFF);
  const navigate = useNavigate();
  const client = useApolloClient();

  if (user?.role !== 'admin') {
    return <p className="text-center text-red-500">Access denied. Admin only.</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createStaff({ variables: { email, username } });
      await client.refetchQueries({ include: [GET_USERS] });
      alert('Staff user created successfully with default password "admin"');
      navigate('/users');
    } catch (error) {
      console.error('Error creating staff:', error);
      alert('Failed to create staff user');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create Staff User</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4 text-sm text-gray-600">
          <p>Default password: "admin"</p>
          <p>The staff user will be able to login with the provided username and password "admin".</p>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {loading ? 'Creating...' : 'Create Staff'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/users')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};