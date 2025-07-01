import React from 'react';
import { Route, Routes } from "react-router-dom";
import './App.css';

import Home from "./pages/Home";
import Login from './pages/Login';
import Quotations from './pages/Quotations';
import SewingOrderForms from './pages/SewingOrderForms';
import ApproveSewingCosts from './pages/ApproveSewingCosts';
import ExpProd from './pages/ExpProd';
import ExpAcc from './pages/ExpAcc';
import ExpDetail from './pages/ExpDetail';
import ExpPim from './pages/ExpPim';
import MonthlySummary from './pages/MonthlySummary';
import GroupedByMonthSummary from './pages/GroupedByMonthSummary';
import ImageSelectors from './pages/ImageSelectors';
import FabricReceipt from './pages/FabricReceipt';
import FabricReceipt1 from './pages/FabricReceipt1'; 

import ScrollToTop from './component/ScrollToTop';
import ScrollToTopBtn from './component/ScrollToTopBtn';

import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext'; // ✅ import useAuth

function AppContent() {
  const { authLoaded } = useAuth();

  if (!authLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ScrollToTop />
      <ScrollToTopBtn />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/pnl/quotations" element={<ProtectedRoute><Quotations /></ProtectedRoute>} />
        <Route path="/pnl/approvesewingcosts" element={<ProtectedRoute><ApproveSewingCosts /></ProtectedRoute>} />
        <Route path="/pnl/expprod" element={<ProtectedRoute><ExpProd /></ProtectedRoute>} />
        <Route path="/pnl/expacc" element={<ProtectedRoute><ExpAcc /></ProtectedRoute>} />
        <Route path="/pnl/expdetail" element={<ProtectedRoute><ExpDetail /></ProtectedRoute>} />
        <Route path="/pnl/exppim" element={<ProtectedRoute><ExpPim /></ProtectedRoute>} />
        <Route path="/pnl/sewingorderforms" element={<ProtectedRoute><SewingOrderForms /></ProtectedRoute>} />
        <Route path="/pnl/monthlysummary" element={<ProtectedRoute><MonthlySummary /></ProtectedRoute>} />
        <Route path="/pnl/groupedbymonthsummary" element={<ProtectedRoute><GroupedByMonthSummary /></ProtectedRoute>} />
        <Route path="/pnl/imgselectors" element={<ProtectedRoute><ImageSelectors /></ProtectedRoute>} />
        <Route path="/pnl/fabricreceipt" element={<ProtectedRoute><FabricReceipt /></ProtectedRoute>} />
        <Route path="/pnl/fabricreceipt1" element={<ProtectedRoute><FabricReceipt1 /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
