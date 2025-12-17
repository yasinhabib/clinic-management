import { useQuery } from '@apollo/client/react';
import { GET_APPOINTMENTS, GET_WORKFLOWS } from '../graphql/queries';
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';
import { registrationStatus } from '../enum';

export const Registrasi = () => {
  const { loading, error, data, refetch } = useQuery<any>(GET_APPOINTMENTS);
  const { data: workflowsData } = useQuery<any>(GET_WORKFLOWS);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    refetch()
  },[])

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

  // Get dates with appointments
  const appointmentDates = data.appointments.map((appointment: any) =>
    new Date(appointment.tanggal).toDateString()
  );

  const tileClassName = ({ date, view }: any) => {
    if (view === 'month') {
      const dateString = date.toDateString();
      if (appointmentDates.includes(dateString)) {
        return 'highlight';
      }
    }
    return null;
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddRegistration = () => {
    if (workflowsData?.workflows && workflowsData.workflows.length > 0) {
      const firstWorkflow = workflowsData.workflows.find((w: any) => w.workflow_order === 1);
      if (firstWorkflow) {
        navigate(firstWorkflow.url_path, { state: { selectedDate } });
      }
    }
  };

  const selectedDateAppointments = selectedDate
    ? data.appointments.filter((appointment: any) =>
        new Date(appointment.tanggal).toDateString() === selectedDate.toDateString()
      )
    : [];

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Registrasi Calendar</h2>
      <div className="flex flex-row items-start gap-4">
        <div className="">
          <Calendar
            onClickDay={handleDateClick}
            tileClassName={tileClassName}
            className="react-calendar w-full text-lg"
          />
          <div className='flex flex-row justify-between mx-8'>
            <div className='flex items-center gap-2'>
              <div className='size-4 rounded-full bg-amber-200' />
              <span>Tanggal hari ini</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='size-4 rounded-full bg-blue-500' />
              <span>Ada janji pasien</span>
            </div>
          </div>
         
        </div>
        {selectedDate && (
          <div className="w-full max-w-4xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                Appointments on {selectedDate.toLocaleDateString()}
              </h3>
              <button
                onClick={handleAddRegistration}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Tambah Registrasi Baru
              </button>
            </div>
            {selectedDateAppointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedDateAppointments.map((appointment: any) => (
                  <div key={appointment.id} className="bg-gray-500 text-white p-4 rounded-lg shadow">
                    <p><strong>Patient:</strong> {appointment.patient.nama_lengkap}</p>
                    <p><strong>Time:</strong> {appointment.waktu}</p>
                    <p><strong>Status:</strong> {registrationStatus[appointment.status as keyof typeof registrationStatus]}</p>
                    {appointment.status === "P" && (
                      <button
                        onClick={() => navigate('/workflow/examination', { state: { appointmentId: appointment.id } })}
                        className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                      >
                        Periksa
                      </button>
                    )}
                    {appointment.status === "S" && (
                      <button
                        onClick={() => navigate('/workflow/medicine', { state: { appointmentId: appointment.id } })}
                        className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
                      >
                        Input Obat
                      </button>
                    )}
                    {appointment.status === "C" && (
                      <button
                        onClick={() => navigate('/workflow/payment', { state: { appointmentId: appointment.id } })}
                        className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                      >
                        Bayar
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No appointments on this date.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};