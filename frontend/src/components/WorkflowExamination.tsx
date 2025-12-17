import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { CREATE_EXAMINATION, UPDATE_APPOINTMENT } from '../graphql/queries';
import { useLocation, useNavigate } from 'react-router-dom';

export const WorkflowExamination = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const appointmentId = location.state?.appointmentId;

  const [namaDokter, setNamaDokter] = useState('');
  const [hasilPemeriksaan, setHasilPemeriksaan] = useState('');

  const [createExamination] = useMutation(CREATE_EXAMINATION);
  const [updateAppointment] = useMutation(UPDATE_APPOINTMENT);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentId) {
      alert('No appointment selected');
      return;
    }

    try {
      await createExamination({
        variables: {
          createExaminationInput: {
            appointmentId: Number(appointmentId),
            nama_dokter: namaDokter,
            hasil_pemeriksaan: hasilPemeriksaan,
          },
        },
      });

      // Update appointment status to "S" (2)
      await updateAppointment({
        variables: {
          id: Number(appointmentId),
          updateAppointmentInput: {
            status: "S",
          },
        },
      });

      navigate('/registrasi');
    } catch (error) {
      console.error('Error creating examination:', error);
      alert('Failed to create examination');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create Examination</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Doctor Name</label>
          <input
            type="text"
            value={namaDokter}
            onChange={(e) => setNamaDokter(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Examination Result</label>
          <textarea
            value={hasilPemeriksaan}
            onChange={(e) => setHasilPemeriksaan(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={4}
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create Examination
          </button>
          <button
            type="button"
            onClick={() => navigate('/registrasi')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};