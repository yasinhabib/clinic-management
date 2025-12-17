import { gql } from '@apollo/client';

// Patients
export const GET_PATIENTS = gql`
  query GetPatients {
    patients {
      id
      kode_pasien
      nama_lengkap
      umur
      jenis_kelamin
      no_telp
      created_date
    }
  }
`;

export const GET_PATIENT = gql`
  query GetPatient($id: Int!) {
    patient(id: $id) {
      id
      kode_pasien
      nama_lengkap
      umur
      jenis_kelamin
      no_telp
      created_date
    }
  }
`;

export const CREATE_PATIENT = gql`
  mutation CreatePatient($createPatientInput: CreatePatientInput!) {
    createPatient(createPatientInput: $createPatientInput) {
      id
      kode_pasien
      nama_lengkap
      umur
      jenis_kelamin
      no_telp
    }
  }
`;

export const UPDATE_PATIENT = gql`
  mutation UpdatePatient($id: Int!, $updatePatientInput: CreatePatientInput!) {
    updatePatient(id: $id, updatePatientInput: $updatePatientInput) {
      id
      kode_pasien
      nama_lengkap
      umur
      jenis_kelamin
      no_telp
    }
  }
`;

export const DELETE_PATIENT = gql`
  mutation DeletePatient($id: Int!) {
    deletePatient(id: $id)
  }
`;

// Appointments
export const GET_APPOINTMENTS = gql`
  query GetAppointments {
    appointments {
      id
      patient {
        id
        nama_lengkap
      }
      tanggal
      waktu
      status
      created_date
    }
  }
`;

export const GET_APPOINTMENT = gql`
  query GetAppointment($id: Int!) {
    appointment(id: $id) {
      id
      patient {
        id
        nama_lengkap
      }
      tanggal
      waktu
      status
      created_date
    }
  }
`;

export const CREATE_APPOINTMENT = gql`
  mutation CreateAppointment($createAppointmentInput: CreateAppointmentInput!) {
    createAppointment(createAppointmentInput: $createAppointmentInput) {
      id
      tanggal
      waktu
      status
    }
  }
`;

export const UPDATE_APPOINTMENT = gql`
  mutation UpdateAppointment($id: Int!, $updateAppointmentInput: CreateAppointmentInput!) {
    updateAppointment(id: $id, updateAppointmentInput: $updateAppointmentInput) {
      id
      tanggal
      waktu
      status
    }
  }
`;

export const DELETE_APPOINTMENT = gql`
  mutation DeleteAppointment($id: Int!) {
    deleteAppointment(id: $id)
  }
`;

// Examinations
export const GET_EXAMINATIONS = gql`
  query GetExaminations {
    examinations {
      id
      appointment {
        id
        patient {
          nama_lengkap
        }
      }
      nama_dokter
      hasil_pemeriksaan
      created_date
    }
  }
`;

export const GET_EXAMINATION = gql`
  query GetExamination($id: Int!) {
    examination(id: $id) {
      id
      appointment {
        id
        patient {
          nama_lengkap
        }
      }
      nama_dokter
      hasil_pemeriksaan
      created_date
    }
  }
`;

export const CREATE_EXAMINATION = gql`
  mutation CreateExamination($createExaminationInput: CreateExaminationInput!) {
    createExamination(createExaminationInput: $createExaminationInput) {
      id
      nama_dokter
      hasil_pemeriksaan
    }
  }
`;

export const UPDATE_EXAMINATION = gql`
  mutation UpdateExamination($id: Int!, $updateExaminationInput: CreateExaminationInput!) {
    updateExamination(id: $id, updateExaminationInput: $updateExaminationInput) {
      id
      nama_dokter
      hasil_pemeriksaan
    }
  }
`;

export const DELETE_EXAMINATION = gql`
  mutation DeleteExamination($id: Int!) {
    deleteExamination(id: $id)
  }
`;

// Medicines
export const GET_MEDICINES = gql`
  query GetMedicines {
    medicines {
      id
      examination {
        id
        nama_dokter
      }
      nama
      harga
      jumlah
      created_date
    }
  }
`;

export const GET_MEDICINE = gql`
  query GetMedicine($id: Int!) {
    medicine(id: $id) {
      id
      examination {
        id
        nama_dokter
      }
      nama
      harga
      jumlah
      created_date
    }
  }
`;

export const CREATE_MEDICINE = gql`
  mutation CreateMedicine($createMedicineInput: CreateMedicineInput!) {
    createMedicine(createMedicineInput: $createMedicineInput) {
      id
      nama
      harga
      jumlah
    }
  }
`;

export const UPDATE_MEDICINE = gql`
  mutation UpdateMedicine($id: Int!, $updateMedicineInput: CreateMedicineInput!) {
    updateMedicine(id: $id, updateMedicineInput: $updateMedicineInput) {
      id
      nama
      harga
      jumlah
    }
  }
`;

export const DELETE_MEDICINE = gql`
  mutation DeleteMedicine($id: Int!) {
    deleteMedicine(id: $id)
  }
`;

// Payments
export const GET_PAYMENTS = gql`
  query GetPayments {
    payments {
      id
      examination {
        id
        nama_dokter
      }
      tanggal
      biaya_pemeriksaan
      biaya_obat
      status
      created_date
    }
  }
`;

export const GET_PAYMENT = gql`
  query GetPayment($id: Int!) {
    payment(id: $id) {
      id
      examination {
        id
        nama_dokter
      }
      tanggal
      biaya_pemeriksaan
      biaya_obat
      status
      created_date
    }
  }
`;

export const CREATE_PAYMENT = gql`
  mutation CreatePayment($createPaymentInput: CreatePaymentInput!) {
    createPayment(createPaymentInput: $createPaymentInput) {
      id
      tanggal
      biaya_pemeriksaan
      biaya_obat
      status
    }
  }
`;

export const UPDATE_PAYMENT = gql`
  mutation UpdatePayment($id: Int!, $updatePaymentInput: CreatePaymentInput!) {
    updatePayment(id: $id, updatePaymentInput: $updatePaymentInput) {
      id
      tanggal
      biaya_pemeriksaan
      biaya_obat
      status
    }
  }
`;

export const DELETE_PAYMENT = gql`
  mutation DeletePayment($id: Int!) {
    deletePayment(id: $id)
  }
`;

// Workflows
export const GET_WORKFLOWS = gql`
  query GetWorkflows {
    workflows {
      id
      label
      url_path
      workflow_order
      created_date
    }
  }
`;

export const GET_WORKFLOW = gql`
  query GetWorkflow($id: Int!) {
    workflow(id: $id) {
      id
      label
      url_path
      workflow_order
      created_date
    }
  }
`;

export const CREATE_WORKFLOW = gql`
  mutation CreateWorkflow($createWorkflowInput: CreateWorkflowInput!) {
    createWorkflow(createWorkflowInput: $createWorkflowInput) {
      id
      label
      url_path
      workflow_order
    }
  }
`;

export const UPDATE_WORKFLOW = gql`
  mutation UpdateWorkflow($id: Int!, $updateWorkflowInput: CreateWorkflowInput!) {
    updateWorkflow(id: $id, updateWorkflowInput: $updateWorkflowInput) {
      id
      label
      url_path
      workflow_order
    }
  }
`;

export const DELETE_WORKFLOW = gql`
  mutation DeleteWorkflow($id: Int!) {
    deleteWorkflow(id: $id)
  }
`;