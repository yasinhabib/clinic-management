import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { client } from './graphql/client';
import { ApolloProvider } from '@apollo/client/react';
import { Layout } from './components/Layout';
import { Login } from './components/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PatientList } from './components/PatientList';
import { CreatePatient } from './components/CreatePatient';
import { EditPatient } from './components/EditPatient';
import { AppointmentList } from './components/AppointmentList';
import { ExaminationList } from './components/ExaminationList';
import { CreateExamination } from './components/CreateExamination';
import { EditExamination } from './components/EditExamination';
import { MedicineList } from './components/MedicineList';
import { CreateMedicine } from './components/CreateMedicine';
import { EditMedicine } from './components/EditMedicine';
import { PaymentList } from './components/PaymentList';
import { CreatePayment } from './components/CreatePayment';
import { EditPayment } from './components/EditPayment';
import { WorkflowList } from './components/WorkflowList';
import { CreateWorkflow } from './components/CreateWorkflow';
import { EditWorkflow } from './components/EditWorkflow';
import { UserList } from './components/UserList';
import { CreateStaff } from './components/CreateStaff';

function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/patients" replace />} />
              <Route path="login" element={<Login />} />
              <Route path="patients" element={<ProtectedRoute><PatientList /></ProtectedRoute>} />
              <Route path="patients/create" element={<ProtectedRoute><CreatePatient /></ProtectedRoute>} />
              <Route path="patients/edit/:id" element={<ProtectedRoute><EditPatient /></ProtectedRoute>} />
              <Route path="appointments" element={<ProtectedRoute><AppointmentList /></ProtectedRoute>} />
              <Route path="examinations" element={<ProtectedRoute><ExaminationList /></ProtectedRoute>} />
              <Route path="examinations/create" element={<ProtectedRoute><CreateExamination /></ProtectedRoute>} />
              <Route path="examinations/edit/:id" element={<ProtectedRoute><EditExamination /></ProtectedRoute>} />
              <Route path="medicines" element={<ProtectedRoute><MedicineList /></ProtectedRoute>} />
              <Route path="medicines/create" element={<ProtectedRoute><CreateMedicine /></ProtectedRoute>} />
              <Route path="medicines/edit/:id" element={<ProtectedRoute><EditMedicine /></ProtectedRoute>} />
              <Route path="payments" element={<ProtectedRoute><PaymentList /></ProtectedRoute>} />
              <Route path="payments/create" element={<ProtectedRoute><CreatePayment /></ProtectedRoute>} />
              <Route path="payments/edit/:id" element={<ProtectedRoute><EditPayment /></ProtectedRoute>} />
              <Route path="workflows" element={<ProtectedRoute><WorkflowList /></ProtectedRoute>} />
              <Route path="workflows/create" element={<ProtectedRoute><CreateWorkflow /></ProtectedRoute>} />
              <Route path="workflows/edit/:id" element={<ProtectedRoute><EditWorkflow /></ProtectedRoute>} />
              <Route path="users" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
              <Route path="users/create" element={<ProtectedRoute><CreateStaff /></ProtectedRoute>} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;