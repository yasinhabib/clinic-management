import { useQuery, useMutation } from '@apollo/client/react';
import { GET_PATIENTS, DELETE_PATIENT } from '../graphql/queries';
import { Link } from 'react-router-dom';

export const PatientList = () => {
  const { loading, error, data, refetch } = useQuery<any>(GET_PATIENTS);
  const [deletePatient] = useMutation(DELETE_PATIENT, {
    onCompleted: () => refetch(),
  });

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await deletePatient({ variables: { id } });
      } catch (error) {
        console.error('Error deleting patient:', error);
        alert('Failed to delete patient');
      }
    }
  };

  if (loading) return <p className="text-center">Loading patients...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">All Patients</h2>
        <Link to="/patients/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Create Patient
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.patients.map((patient: any) => (
              <tr key={patient.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.kode_pasien}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.nama_lengkap}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.umur}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.jenis_kelamin}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.no_telp}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link to={`/patients/edit/${patient.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(patient.id)}
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