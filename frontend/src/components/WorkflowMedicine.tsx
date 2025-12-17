import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { CREATE_MEDICINE, UPDATE_APPOINTMENT, GET_APPOINTMENT } from '../graphql/queries';
import { useLocation, useNavigate } from 'react-router-dom';

interface Medicine {
  nama: string;
  harga: number;
  jumlah: number;
}

export const WorkflowMedicine = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const appointmentId = location.state?.appointmentId;

  const { data: appointmentData } = useQuery<any>(GET_APPOINTMENT, {
    variables: { id: Number(appointmentId) },
    skip: !appointmentId,
  });

  const [medicines, setMedicines] = useState<Medicine[]>([{ nama: '', harga: 0, jumlah: 0 }]);

  const [createMedicine] = useMutation(CREATE_MEDICINE);
  const [updateAppointment] = useMutation(UPDATE_APPOINTMENT);

  const examinationId = appointmentData?.appointment?.examination?.id;

  const addMedicine = () => {
    setMedicines([...medicines, { nama: '', harga: 0, jumlah: 0 }]);
  };

  const removeMedicine = (index: number) => {
    if (medicines.length > 1) {
      setMedicines(medicines.filter((_, i) => i !== index));
    }
  };

  const updateMedicine = (index: number, field: keyof Medicine, value: string | number) => {
    const newMedicines = [...medicines];
    newMedicines[index] = { ...newMedicines[index], [field]: value };
    setMedicines(newMedicines);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examinationId) {
      alert('No examination selected');
      return;
    }

    try {
      // Create all medicines
      for (const medicine of medicines) {
        if (medicine.nama && medicine.harga > 0 && medicine.jumlah > 0) {
          await createMedicine({
            variables: {
              createMedicineInput: {
                examinationId: Number(examinationId),
                nama: medicine.nama,
                harga: medicine.harga,
                jumlah: medicine.jumlah,
              },
            },
          });
        }
      }

      // Update appointment status to "C" (3)
      await updateAppointment({
        variables: {
          id: Number(appointmentId),
          updateAppointmentInput: {
            status: "C",
          },
        },
      });

      navigate('/registrasi');
    } catch (error) {
      console.error('Error creating medicines:', error);
      alert('Failed to create medicines');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create Medicines</h2>
      <form onSubmit={handleSubmit}>
        {medicines.map((medicine, index) => (
          <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Medicine {index + 1}</h3>
              {medicines.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMedicine(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Medicine Name</label>
                <input
                  type="text"
                  value={medicine.nama}
                  onChange={(e) => updateMedicine(index, 'nama', e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={medicine.harga || ''}
                  onChange={(e) => updateMedicine(index, 'harga', parseFloat(e.target.value) || 0)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Quantity</label>
                <input
                  type="number"
                  value={medicine.jumlah || ''}
                  onChange={(e) => updateMedicine(index, 'jumlah', parseInt(e.target.value) || 0)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
            </div>
          </div>
        ))}

        <div className="mb-4">
          <button
            type="button"
            onClick={addMedicine}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Another Medicine
          </button>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Input Medicine
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