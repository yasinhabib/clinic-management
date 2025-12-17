import { useState } from 'react';
import { CREATE_EXAMINATION, GET_EXAMINATIONS, GET_APPOINTMENTS } from '../graphql/queries';
import { useAuth } from '../contexts/AuthContext';
import { useMutation, useQuery } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';

export const CreateExamination = () => {
  const [appointmentId, setAppointmentId] = useState('');
  const [namaDokter, setNamaDokter] = useState('');
  const [hasilPemeriksaan, setHasilPemeriksaan] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { loading: appointmentsLoading, data: appointmentsData } = useQuery<any>(GET_APPOINTMENTS);

  const [createExamination, { loading }] = useMutation(CREATE_EXAMINATION, {
    refetchQueries: [{ query: GET_EXAMINATIONS }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createExamination({
        variables: {
          createExaminationInput: {
            appointmentId: parseInt(appointmentId),
            nama_dokter: namaDokter,
            hasil_pemeriksaan: hasilPemeriksaan,
          },
        },
      });
      setAppointmentId('');
      setNamaDokter('');
      setHasilPemeriksaan('');
      navigate('/examinations');
    } catch (error) {
      console.error('Error creating examination:', error);
      alert('Failed to create examination');
    }
  };

  if (!isAuthenticated) {
    return <p className="text-center text-red-500">Please login to create examinations</p>;
  }

  return (
    <div className="container mx-auto px-4 max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Examination</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label htmlFor="appointmentId" className="block text-sm font-medium text-gray-700 mb-2">
            Appointment
          </label>
          <select
            id="appointmentId"
            value={appointmentId}
            onChange={(e) => setAppointmentId(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select an appointment</option>
            {appointmentsData?.appointments?.map((appointment: any) => (
              <option key={appointment.id} value={appointment.id}>
                {appointment.patient.nama_lengkap} - {appointment.tanggal} {appointment.waktu}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="namaDokter" className="block text-sm font-medium text-gray-700 mb-2">
            Doctor Name
          </label>
          <input
            id="namaDokter"
            type="text"
            placeholder="Enter doctor name"
            value={namaDokter}
            onChange={(e) => setNamaDokter(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="hasilPemeriksaan" className="block text-sm font-medium text-gray-700 mb-2">
            Examination Result
          </label>
          <textarea
            id="hasilPemeriksaan"
            placeholder="Enter examination result"
            value={hasilPemeriksaan}
            onChange={(e) => setHasilPemeriksaan(e.target.value)}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/examinations')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Examination'}
          </button>
        </div>
      </form>
    </div>
  );
};