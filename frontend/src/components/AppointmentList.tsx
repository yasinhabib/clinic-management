import { useQuery, useMutation } from '@apollo/client/react';
import { GET_APPOINTMENTS, DELETE_APPOINTMENT } from '../graphql/queries';
import { Link } from 'react-router-dom';

export const AppointmentList = () => {
  const { loading, error, data, refetch } = useQuery<any>(GET_APPOINTMENTS);
  const [deleteAppointment] = useMutation(DELETE_APPOINTMENT, {
    onCompleted: () => refetch(),
  });

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await deleteAppointment({ variables: { id } });
      } catch (error) {
        console.error('Error deleting appointment:', error);
        alert('Failed to delete appointment');
      }
    }
  };

  if (loading) return <p className="text-center">Loading appointments...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">All Appointments</h2>
        <Link to="/appointments/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Create Appointment
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.appointments.map((appointment: any) => (
              <tr key={appointment.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appointment.patient.nama_lengkap}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.tanggal}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.waktu}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link to={`/appointments/edit/${appointment.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(appointment.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};