import { useState, useEffect } from 'react';
import { GET_PAYMENT, UPDATE_PAYMENT, GET_PAYMENTS, GET_EXAMINATIONS } from '../graphql/queries';
import { useAuth } from '../contexts/AuthContext';
import { useMutation, useQuery } from '@apollo/client/react';
import { useNavigate, useParams } from 'react-router-dom';

export const EditPayment = () => {
  const { id } = useParams<{ id: string }>();
  const [examinationId, setExaminationId] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [biayaPemeriksaan, setBiayaPemeriksaan] = useState('');
  const [biayaObat, setBiayaObat] = useState('');
  const [status, setStatus] = useState<'P' | 'S'>('P');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { loading: queryLoading, error: queryError, data } = useQuery<any>(GET_PAYMENT, {
    variables: { id: parseInt(id!) },
    skip: !id,
  });

  const { data: examinationsData } = useQuery<any>(GET_EXAMINATIONS);

  const [updatePayment, { loading: mutationLoading }] = useMutation(UPDATE_PAYMENT, {
    refetchQueries: [{ query: GET_PAYMENTS }],
  });

  useEffect(() => {
    if (data?.payment) {
      const payment = data.payment;
      setExaminationId(payment.examination.id.toString());
      setTanggal(payment.tanggal.split('T')[0]); // Format date for input
      setBiayaPemeriksaan(payment.biaya_pemeriksaan.toString());
      setBiayaObat(payment.biaya_obat.toString());
      setStatus(payment.status);
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePayment({
        variables: {
          id: parseInt(id!),
          updatePaymentInput: {
            examinationId: parseInt(examinationId),
            tanggal,
            biaya_pemeriksaan: parseFloat(biayaPemeriksaan),
            biaya_obat: parseFloat(biayaObat),
            status,
          },
        },
      });
      navigate('/payments');
    } catch (error) {
      console.error('Error updating payment:', error);
      alert('Failed to update payment');
    }
  };

  if (!isAuthenticated) {
    return <p className="text-center text-red-500">Please login to edit payments</p>;
  }

  if (queryLoading) return <p className="text-center">Loading payment...</p>;
  if (queryError) return <p className="text-center text-red-500">Error: {queryError.message}</p>;

  return (
    <div className="container mx-auto px-4 max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Payment</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label htmlFor="examinationId" className="block text-sm font-medium text-gray-700 mb-2">
            Examination
          </label>
          <select
            id="examinationId"
            value={examinationId}
            onChange={(e) => setExaminationId(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select an examination</option>
            {examinationsData?.examinations?.map((examination: any) => (
              <option key={examination.id} value={examination.id}>
                {examination.appointment.patient.nama_lengkap} - Dr. {examination.nama_dokter}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            id="tanggal"
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="biayaPemeriksaan" className="block text-sm font-medium text-gray-700 mb-2">
            Examination Fee
          </label>
          <input
            id="biayaPemeriksaan"
            type="number"
            step="0.01"
            placeholder="Enter examination fee"
            value={biayaPemeriksaan}
            onChange={(e) => setBiayaPemeriksaan(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="biayaObat" className="block text-sm font-medium text-gray-700 mb-2">
            Medicine Fee
          </label>
          <input
            id="biayaObat"
            type="number"
            step="0.01"
            placeholder="Enter medicine fee"
            value={biayaObat}
            onChange={(e) => setBiayaObat(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'P' | 'S')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="P">Pending</option>
            <option value="S">Settled</option>
          </select>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/payments')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutationLoading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {mutationLoading ? 'Updating...' : 'Update Payment'}
          </button>
        </div>
      </form>
    </div>
  );
};