import { useQuery, useMutation } from '@apollo/client/react';
import { GET_EXAMINATIONS, DELETE_EXAMINATION } from '../graphql/queries';
import { Link } from 'react-router-dom';

export const ExaminationList = () => {
  const { loading, error, data, refetch } = useQuery<any>(GET_EXAMINATIONS);
  const [deleteExamination] = useMutation(DELETE_EXAMINATION, {
    onCompleted: () => refetch(),
  });

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this examination?')) {
      try {
        await deleteExamination({ variables: { id } });
      } catch (error) {
        console.error('Error deleting examination:', error);
        alert('Failed to delete examination');
      }
    }
  };

  if (loading) return <p className="text-center">Loading examinations...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">All Examinations</h2>
        <Link to="/examinations/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Create Examination
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Examination Result</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.examinations.map((examination: any) => (
              <tr key={examination.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {examination.appointment.patient.nama_lengkap}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{examination.nama_dokter}</td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{examination.hasil_pemeriksaan}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(examination.created_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link to={`/examinations/edit/${examination.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(examination.id)}
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