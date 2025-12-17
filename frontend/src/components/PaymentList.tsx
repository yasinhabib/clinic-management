import { useQuery, useMutation } from '@apollo/client/react';
import { GET_PAYMENTS, DELETE_PAYMENT } from '../graphql/queries';
import { Link } from 'react-router-dom';

export const PaymentList = () => {
  const { loading, error, data, refetch } = useQuery<any>(GET_PAYMENTS);
  const [deletePayment] = useMutation(DELETE_PAYMENT, {
    onCompleted: () => refetch(),
  });

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        await deletePayment({ variables: { id } });
      } catch (error) {
        console.error('Error deleting payment:', error);
        alert('Failed to delete payment');
      }
    }
  };

  if (loading) return <p className="text-center">Loading payments...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">All Payments</h2>
        <Link to="/payments/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Create Payment
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Examination</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Fee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicine Fee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.payments.map((payment: any) => (
              <tr key={payment.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Dr. {payment.examination.nama_dokter}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(payment.tanggal).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${payment.biaya_pemeriksaan}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${payment.biaya_obat}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link to={`/payments/edit/${payment.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(payment.id)}
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