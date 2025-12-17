import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { CREATE_APPOINTMENT, GET_PATIENTS } from '../graphql/queries';
import { useLocation, useNavigate } from 'react-router-dom';
import { PatientModal } from './PatientModal';

export const WorkflowAppointment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedDate = location.state?.selectedDate || new Date();

  const [patientId, setPatientId] = useState<number | null>(null);
  const [patientName, setPatientName] = useState<string>('');
  const [waktu, setWaktu] = useState('09:00');
  const [showPatientModal, setShowPatientModal] = useState(false);

  useEffect(() => {
    if (location.state?.showModal) {
      setShowPatientModal(true);
    }
  }, [location.state]);

  const [createAppointment] = useMutation(CREATE_APPOINTMENT);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) {
      alert('Please select a patient');
      return;
    }

    try {
      await createAppointment({
        variables: {
          createAppointmentInput: {
            patientId: Number(patientId),
            tanggal: selectedDate.toISOString().split('T')[0], // YYYY-MM-DD
            waktu,
            status: "P",
          },
        },
      });
      navigate('/registrasi');
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Failed to create appointment');
    }
  };

  const timeOptions = [];
  for (let hour = 9; hour <= 21; hour++) {
    const time = `${hour.toString().padStart(2, '0')}:00`;
    timeOptions.push(time);
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create Appointment</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Date</label>
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            readOnly
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight bg-gray-100"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Patient</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={patientName || ''}
              readOnly
              placeholder="Select patient"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight bg-gray-100"
            />
            <button
              type="button"
              onClick={() => setShowPatientModal(true)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Select
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Time</label>
          <select
            value={waktu}
            onChange={(e) => setWaktu(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create Appointment
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

      {showPatientModal && (
        <PatientModal
          onSelect={(id, name) => {
            setPatientId(id);
            setPatientName(name);
            setShowPatientModal(false);
          }}
          onClose={() => setShowPatientModal(false)}
        />
      )}
    </div>
  );
};