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

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/quotations' element={<Quotations />} />
        <Route path='/approvesewingcosts' element={<ApproveSewingCosts />} />
        <Route path='/expprod' element={<ExpProd />} />
        <Route path='/expacc' element={<ExpAcc />} />
        <Route path='/expdetail' element={<ExpDetail />} />
        <Route path='/sewingorderforms' element={<SewingOrderForms />} />
      </Routes>
    </>
  )
}

export default App
