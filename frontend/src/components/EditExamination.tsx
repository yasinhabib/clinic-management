import { useState, useEffect } from 'react';
import { GET_EXAMINATION, UPDATE_EXAMINATION, GET_EXAMINATIONS, GET_APPOINTMENTS } from '../graphql/queries';
import { useAuth } from '../contexts/AuthContext';
import { useMutation, useQuery } from '@apollo/client/react';
import { useNavigate, useParams } from 'react-router-dom';

export const EditExamination = () => {
  const { id } = useParams<{ id: string }>();
  const [appointmentId, setAppointmentId] = useState('');
  const [namaDokter, setNamaDokter] = useState('');
  const [hasilPemeriksaan, setHasilPemeriksaan] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { loading: queryLoading, error: queryError, data } = useQuery<any>(GET_EXAMINATION, {
    variables: { id: parseInt(id!) },
    skip: !id,
  });

  const { data: appointmentsData } = useQuery<any>(GET_APPOINTMENTS);

  const [updateExamination, { loading: mutationLoading }] = useMutation(UPDATE_EXAMINATION, {
    refetchQueries: [{ query: GET_EXAMINATIONS }],
  });

  useEffect(() => {
    if (data?.examination) {
      const examination = data.examination;
      setAppointmentId(examination.appointment.id.toString());
      setNamaDokter(examination.nama_dokter);
      setHasilPemeriksaan(examination.hasil_pemeriksaan);
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateExamination({
        variables: {
          id: parseInt(id!),
          updateExaminationInput: {
            appointmentId: parseInt(appointmentId),
            nama_dokter: namaDokter,
            hasil_pemeriksaan: hasilPemeriksaan,
          },
        },
      });
      navigate('/examinations');
    } catch (error) {
      console.error('Error updating examination:', error);
      alert('Failed to update examination');
    }
  };

  if (!isAuthenticated) {
    return <p className="text-center text-red-500">Please login to edit examinations</p>;
  }

  if (queryLoading) return <p className="text-center">Loading examination...</p>;
  if (queryError) return <p className="text-center text-red-500">Error: {queryError.message}</p>;

  return (
    <div className="container mx-auto px-4 max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Examination</h2>
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
            disabled={mutationLoading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {mutationLoading ? 'Updating...' : 'Update Examination'}
          </button>
        </div>
      </form>
    </div>
  );
};