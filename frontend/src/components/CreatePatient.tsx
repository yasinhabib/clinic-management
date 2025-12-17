import { useState } from 'react';
import { CREATE_PATIENT, GET_PATIENTS } from '../graphql/queries';
import { useAuth } from '../contexts/AuthContext';
import { useMutation } from '@apollo/client/react';
import { useNavigate, useLocation } from 'react-router-dom';

export const CreatePatient = () => {
  const [namaLengkap, setNamaLengkap] = useState('');
  const [umur, setUmur] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState<'L' | 'P'>('L');
  const [noTelp, setNoTelp] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromModal = location.state?.fromModal;

  const [createPatient, { loading }] = useMutation(CREATE_PATIENT, {
    refetchQueries: [{ query: GET_PATIENTS }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPatient({
        variables: {
          createPatientInput: {
            nama_lengkap: namaLengkap,
            umur: parseInt(umur),
            jenis_kelamin: jenisKelamin,
            no_telp: noTelp,
          },
        },
      });
      setNamaLengkap('');
      setUmur('');
      setJenisKelamin('L');
      setNoTelp('');
      if (fromModal) {
        navigate('/workflow/appointment', { state: { showModal: true } });
      } else {
        navigate('/patients');
      }
    } catch (error) {
      console.error('Error creating patient:', error);
      alert('Failed to create patient');
    }
  };

  if (!isAuthenticated) {
    return <p className="text-center text-red-500">Please login to create patients</p>;
  }

  return (
    <div className="container mx-auto px-4 max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Patient</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label htmlFor="namaLengkap" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            id="namaLengkap"
            type="text"
            placeholder="Enter full name"
            value={namaLengkap}
            onChange={(e) => setNamaLengkap(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="umur" className="block text-sm font-medium text-gray-700 mb-2">
            Age
          </label>
          <input
            id="umur"
            type="number"
            placeholder="Enter age"
            value={umur}
            onChange={(e) => setUmur(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="jenisKelamin" className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <select
            id="jenisKelamin"
            value={jenisKelamin}
            onChange={(e) => setJenisKelamin(e.target.value as 'L' | 'P')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="L">Male</option>
            <option value="P">Female</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="noTelp" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            id="noTelp"
            type="tel"
            placeholder="Enter phone number"
            value={noTelp}
            onChange={(e) => setNoTelp(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              if (fromModal) {
                navigate('/workflow/appointment', { state: { showModal: true } });
              } else {
                navigate('/patients');
              }
            }}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Patient'}
          </button>
        </div>
      </form>
    </div>
  );
};