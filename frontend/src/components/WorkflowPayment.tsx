import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { CREATE_PAYMENT, UPDATE_APPOINTMENT, GET_APPOINTMENT, GET_MEDICINES } from '../graphql/queries';
import { useLocation, useNavigate } from 'react-router-dom';

export const WorkflowPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const appointmentId = location.state?.appointmentId;

  const { data: appointmentData } = useQuery<any>(GET_APPOINTMENT, {
    variables: { id: Number(appointmentId) },
    skip: !appointmentId,
  });

  const { data: medicinesData } = useQuery<any>(GET_MEDICINES);

  const [biayaPemeriksaan, setBiayaPemeriksaan] = useState('');
  const [biayaObat, setBiayaObat] = useState('');
  const tanggal = new Date().toISOString().split('T')[0];

  const [createPayment] = useMutation(CREATE_PAYMENT);
  const [updateAppointment] = useMutation(UPDATE_APPOINTMENT);

  const examinationId = appointmentData?.appointment?.examination?.id;

  // Calculate total medicine cost
  const totalMedicineCost = medicinesData?.medicines
    ?.filter((medicine: any) => medicine.examination?.id === examinationId)
    ?.reduce((total: number, medicine: any) => total + (medicine.harga * medicine.jumlah), 0) || 0;

  useEffect(() => {
    if (totalMedicineCost > 0) {
      setBiayaObat(totalMedicineCost.toString());
    }
  }, [totalMedicineCost]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examinationId) {
      alert('No examination selected');
      return;
    }

    try {
      await createPayment({
        variables: {
          createPaymentInput: {
            examinationId: Number(examinationId),
            biaya_pemeriksaan: parseFloat(biayaPemeriksaan),
            biaya_obat: parseFloat(biayaObat),
            tanggal,
            status: "S", // Assuming payment status
          },
        },
      });

      // Update appointment status to "E" (5)
      await updateAppointment({
        variables: {
          id: Number(appointmentId),
          updateAppointmentInput: {
            status: "E",
          },
        },
      });

      navigate('/registrasi');
    } catch (error) {
      console.error('Error creating payment:', error);
      alert('Failed to create payment');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create Payment</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Examination Cost</label>
          <input
            type="number"
            step="0.01"
            value={biayaPemeriksaan}
            onChange={(e) => setBiayaPemeriksaan(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Medicine Cost</label>
          <input
            type="number"
            step="0.01"
            value={biayaObat}
            disabled
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight bg-gray-100"
          />
        </div>


        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create Payment
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