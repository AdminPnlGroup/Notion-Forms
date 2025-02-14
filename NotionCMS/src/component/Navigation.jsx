import React, { useState, useEffect } from 'react'
import LinkComponent from './LinkComponent';
import { IoIosArrowDown } from "react-icons/io";

function Navigation() {
  const [isExpenseHovered, setIsExpenseHovered] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.expense-dropdown')) {
        setIsExpenseHovered(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="container max-w-full h-18 border-slate-200 border-solid bg-white sticky top-0 z-50 shadow-sm mb-10 print:hidden">
        <div className="max-w-7xl mx-auto py-4 px-10">
          <div className="flex justify-center">
            <ul className="flex gap-5 text-xl [&>li:not(child)]:content-center">
              <LinkComponent to="/"></LinkComponent>
              <LinkComponent to="/quotations">ใบเสนอราคา</LinkComponent>
              <div className="relative expense-dropdown">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpenseHovered((prev) => !prev);
                  }}
                  className="p-2 flex items-center">ใบขอเบิกค่าใช้จ่าย<span className={`p-1 transition duration-400 ${isExpenseHovered ? "rotate-180" : ""}`}><IoIosArrowDown /></span>
                </button>
                <div
                  className={`absolute left-0 mt-2 bg-white shadow-lg transition-all duration-400 top-14 ${isExpenseHovered ? "opacity-100 visible scale-100" : "opacity-0 invisible scale-95"}`}>
                  <LinkComponent to="/expprod" className="block px-4 py-2 hover:bg-gray-100">ใบขอเบิกค่าใช้จ่าย (ผลิต)</LinkComponent>
                  <LinkComponent to="/expacc" className="block px-4 py-2 hover:bg-gray-100">ใบขอเบิกค่าใช้จ่าย (บัญชี)</LinkComponent>
                  <LinkComponent to="/expdetail" className="block px-4 py-2 hover:bg-gray-100">ใบขอเบิกค่าใช้จ่าย (ดีเทล)</LinkComponent>
                </div>
              </div>
              <LinkComponent to="/sewingorderforms">ใบจ่ายงานค่าตัดเย็บ</LinkComponent>
              <LinkComponent to="/approvesewingcosts">ใบขออนุมัติจ่ายค่าจ้างตัดเย็บ</LinkComponent>
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navigation
