import React from 'react'
import { Route, Routes } from "react-router-dom";
import './App.css'

import Home from "./pages/Home";
import Quotations from './pages/Quotations';
import SewingOrderForms from './pages/SewingOrderForms';
import ApproveSewingCosts from './component/ApproveSewingCosts';
import ExpProd from './pages/ExpProd';
import ExpAcc from './pages/ExpAcc';
import ExpDetail from './pages/ExpDetail';
import ScrollToTop from './component/ScrollToTop';
import ScrollToTopBtn from './component/ScrollToTopBtn';

function App() {

  return (
    <>
      <ScrollToTop/>
      <ScrollToTopBtn/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/pnl/quotations' element={<Quotations />} />
        <Route path='/pnl/approvesewingcosts' element={<ApproveSewingCosts />} />
        <Route path='/pnl/expprod' element={<ExpProd />} />
        <Route path='/pnl/expacc' element={<ExpAcc />} />
        <Route path='/pnl/expdetail' element={<ExpDetail />} />
        <Route path='/pnl/sewingorderforms' element={<SewingOrderForms />} />
      </Routes>
    </>
  )
}

export default App
