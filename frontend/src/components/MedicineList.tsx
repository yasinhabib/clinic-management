import { useQuery, useMutation } from '@apollo/client/react';
import { GET_MEDICINES, DELETE_MEDICINE } from '../graphql/queries';
import { Link } from 'react-router-dom';

export const MedicineList = () => {
  const { loading, error, data, refetch } = useQuery<any>(GET_MEDICINES);
  const [deleteMedicine] = useMutation(DELETE_MEDICINE, {
    onCompleted: () => refetch(),
  });

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        await deleteMedicine({ variables: { id } });
      } catch (error) {
        console.error('Error deleting medicine:', error);
        alert('Failed to delete medicine');
      }
    }
  };

  if (loading) return <p className="text-center">Loading medicines...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">All Medicines</h2>
        <Link to="/medicines/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Create Medicine
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Examination</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.medicines.map((medicine: any) => (
              <tr key={medicine.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{medicine.nama}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${medicine.harga}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{medicine.jumlah}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{medicine.examination.nama_dokter}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(medicine.created_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link to={`/medicines/edit/${medicine.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(medicine.id)}
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