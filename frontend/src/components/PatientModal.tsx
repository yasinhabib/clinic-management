import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_PATIENTS } from '../graphql/queries';
import { Link } from 'react-router-dom';

interface PatientModalProps {
  onSelect: (id: number, name: string) => void;
  onClose: () => void;
}

export const PatientModal = ({ onSelect, onClose }: PatientModalProps) => {
  const { loading, error, data } = useQuery<any>(GET_PATIENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]);

  useEffect(() => {
    if (data?.patients) {
      const filtered = data.patients.filter((patient: any) =>
        patient.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  }, [data, searchTerm]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Select Patient</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by patient name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <Link
              to="/patients/create"
              state={{ fromModal: true }}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={onClose}
            >
              Add New Patient
            </Link>
          </div>

          <div className="overflow-y-auto max-h-96">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.map((patient: any) => (
                  <tr key={patient.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.kode_pasien}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.nama_lengkap}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.umur}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.no_telp}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => onSelect(patient.id, patient.nama_lengkap)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};