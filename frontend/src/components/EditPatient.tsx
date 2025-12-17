import { useState, useEffect } from 'react';
import { GET_PATIENT, UPDATE_PATIENT, GET_PATIENTS } from '../graphql/queries';
import { useAuth } from '../contexts/AuthContext';
import { useMutation, useQuery } from '@apollo/client/react';
import { useNavigate, useParams } from 'react-router-dom';

export const EditPatient = () => {
  const { id } = useParams<{ id: string }>();
  const [namaLengkap, setNamaLengkap] = useState('');
  const [umur, setUmur] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState<'L' | 'P'>('L');
  const [noTelp, setNoTelp] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { loading: queryLoading, error: queryError, data } = useQuery<any>(GET_PATIENT, {
    variables: { id: parseInt(id!) },
    skip: !id,
  });

  const [updatePatient, { loading: mutationLoading }] = useMutation(UPDATE_PATIENT, {
    refetchQueries: [{ query: GET_PATIENTS }],
  });

  useEffect(() => {
    if (data?.patient) {
      const patient = data.patient;
      setNamaLengkap(patient.nama_lengkap);
      setUmur(patient.umur.toString());
      setJenisKelamin(patient.jenis_kelamin);
      setNoTelp(patient.no_telp);
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePatient({
        variables: {
          id: parseInt(id!),
          updatePatientInput: {
            nama_lengkap: namaLengkap,
            umur: parseInt(umur),
            jenis_kelamin: jenisKelamin,
            no_telp: noTelp,
          },
        },
      });
      navigate('/patients');
    } catch (error) {
      console.error('Error updating patient:', error);
      alert('Failed to update patient');
    }
  };

  if (!isAuthenticated) {
    return <p className="text-center text-red-500">Please login to edit patients</p>;
  }

  if (queryLoading) return <p className="text-center">Loading patient...</p>;
  if (queryError) return <p className="text-center text-red-500">Error: {queryError.message}</p>;

  return (
    <div className="container mx-auto px-4 max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Patient</h2>
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
            onClick={() => navigate('/patients')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutationLoading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {mutationLoading ? 'Updating...' : 'Update Patient'}
          </button>
        </div>
      </form>
    </div>
  );
};