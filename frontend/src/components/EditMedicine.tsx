import { useState, useEffect } from 'react';
import { GET_MEDICINE, UPDATE_MEDICINE, GET_MEDICINES, GET_EXAMINATIONS } from '../graphql/queries';
import { useAuth } from '../contexts/AuthContext';
import { useMutation, useQuery } from '@apollo/client/react';
import { useNavigate, useParams } from 'react-router-dom';

export const EditMedicine = () => {
  const { id } = useParams<{ id: string }>();
  const [examinationId, setExaminationId] = useState('');
  const [nama, setNama] = useState('');
  const [harga, setHarga] = useState('');
  const [jumlah, setJumlah] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { loading: queryLoading, error: queryError, data } = useQuery<any>(GET_MEDICINE, {
    variables: { id: parseInt(id!) },
    skip: !id,
  });

  const { data: examinationsData } = useQuery<any>(GET_EXAMINATIONS);

  const [updateMedicine, { loading: mutationLoading }] = useMutation(UPDATE_MEDICINE, {
    refetchQueries: [{ query: GET_MEDICINES }],
  });

  useEffect(() => {
    if (data?.medicine) {
      const medicine = data.medicine;
      setExaminationId(medicine.examination.id.toString());
      setNama(medicine.nama);
      setHarga(medicine.harga.toString());
      setJumlah(medicine.jumlah.toString());
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMedicine({
        variables: {
          id: parseInt(id!),
          updateMedicineInput: {
            examinationId: parseInt(examinationId),
            nama,
            harga: parseFloat(harga),
            jumlah: parseInt(jumlah),
          },
        },
      });
      navigate('/medicines');
    } catch (error) {
      console.error('Error updating medicine:', error);
      alert('Failed to update medicine');
    }
  };

  if (!isAuthenticated) {
    return <p className="text-center text-red-500">Please login to edit medicines</p>;
  }

  if (queryLoading) return <p className="text-center">Loading medicine...</p>;
  if (queryError) return <p className="text-center text-red-500">Error: {queryError.message}</p>;

  return (
    <div className="container mx-auto px-4 max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Medicine</h2>
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
          <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-2">
            Medicine Name
          </label>
          <input
            id="nama"
            type="text"
            placeholder="Enter medicine name"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="harga" className="block text-sm font-medium text-gray-700 mb-2">
            Price
          </label>
          <input
            id="harga"
            type="number"
            step="0.01"
            placeholder="Enter price"
            value={harga}
            onChange={(e) => setHarga(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="jumlah" className="block text-sm font-medium text-gray-700 mb-2">
            Quantity
          </label>
          <input
            id="jumlah"
            type="number"
            placeholder="Enter quantity"
            value={jumlah}
            onChange={(e) => setJumlah(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/medicines')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutationLoading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {mutationLoading ? 'Updating...' : 'Update Medicine'}
          </button>
        </div>
      </form>
    </div>
  );
};