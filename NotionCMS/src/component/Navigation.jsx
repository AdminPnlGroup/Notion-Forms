import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LinkComponent from "./LinkComponent";
import { IoIosArrowDown } from "react-icons/io";

function Navigation() {
  const [isExpenseHovered, setIsExpenseHovered] = useState(false);
  const [isMonthlyHovered, setIsMonthlyHovered] = useState(false);

  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown")) {
        setIsExpenseHovered(false);
        setIsMonthlyHovered(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="container max-w-full h-18 border-slate-200 bg-white border-solid sticky top-0 z-50 shadow-sm mb-10 print:hidden">
        <div className="max-w-full mx-auto py-4 px-10 flex justify-center items-center relative">
          <div className="flex justify-center">
            <ul className="flex gap-5 md:text-sm lg:text-lg xl:text-xl 2xl:text-2xl [&>li:not(child)]:content-center">
              <LinkComponent
                to="/"
                className="md:text-base lg:text-lg xl:text-xl"
              >
                หน้าแรก
              </LinkComponent>
              <LinkComponent
                to="/pnl/quotations"
                className="md:text-base lg:text-lg xl:text-xl  "
              >
                ใบเสนอราคา
              </LinkComponent>

              {/* ใบขอเบิกค่าใช้จ่าย */}
              <div className="relative dropdown content-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpenseHovered((prev) => !prev);
                    setIsMonthlyHovered(false);
                  }}
                  className="flex items-center md:text-base lg:text-lg xl:text-xl mt-1"
                >
                  ใบขอเบิกค่าใช้จ่าย
                  <span
                    className={`p-1 transition duration-400 ${
                      isExpenseHovered ? "rotate-180" : ""
                    }`}
                  >
                    <IoIosArrowDown />
                  </span>
                </button>
                <div
                  className={`absolute left-0 mt-2 bg-white shadow-lg transition-all duration-400 top-14 ${
                    isExpenseHovered
                      ? "opacity-100 visible scale-100"
                      : "opacity-0 invisible scale-95"
                  }`}
                >
                  <LinkComponent
                    to="/pnl/expprod"
                    className="block px-4 py-2 md:text-base lg:text-lg xl:text-xl hover:bg-gray-100"
                  >
                    ใบขอเบิกค่าใช้จ่าย (ผลิต)
                  </LinkComponent>
                  <LinkComponent
                    to="/pnl/expacc"
                    className="block px-4 py-2 md:text-base lg:text-lg xl:text-xl hover:bg-gray-100"
                  >
                    ใบขอเบิกค่าใช้จ่าย (บัญชี)
                  </LinkComponent>
                  <LinkComponent
                    to="/pnl/expdetail"
                    className="block px-4 py-2 md:text-base lg:text-lg xl:text-xl hover:bg-gray-100"
                  >
                    ใบขอเบิกค่าใช้จ่าย (ดีเทล)
                  </LinkComponent>
                  <LinkComponent
                    to="/pnl/exppim"
                    className="block px-4 py-2 md:text-base lg:text-lg xl:text-xl hover:bg-gray-100"
                  >
                    ใบขอเบิกค่าใช้จ่าย (พิม)
                  </LinkComponent>
                  <LinkComponent
                    to="/pnl/approvesewingcosts"
                    className="block px-4 py-2 md:text-base lg:text-lg xl:text-xl hover:bg-gray-100"
                  >
                    ใบขออนุมัติจ่ายค่าจ้างตัดเย็บ
                  </LinkComponent>
                </div>
              </div>

              {/* แบบประจำเดือน */}
              <div className="relative dropdown content-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMonthlyHovered((prev) => !prev);
                    setIsExpenseHovered(false);
                  }}
                  className="flex items-center md:text-base lg:text-lg xl:text-xl mt-1"
                >
                  แบบประจำเดือน
                  <span
                    className={`p-1 transition duration-400 ${
                      isMonthlyHovered ? "rotate-180" : ""
                    }`}
                  >
                    <IoIosArrowDown />
                  </span>
                </button>
                <div
                  className={`absolute left-0 mt-2 bg-white shadow-lg transition-all duration-400 top-14 ${
                    isMonthlyHovered
                      ? "opacity-100 visible scale-100"
                      : "opacity-0 invisible scale-95"
                  }`}
                >
                  <LinkComponent
                    to="/pnl/monthlysummary"
                    className="block px-4 py-2 md:text-base lg:text-lg xl:text-xl hover:bg-gray-100"
                  >
                    ใบสรุปแบบประจำเดือน
                  </LinkComponent>
                  <LinkComponent
                    to="/pnl/groupedbymonthsummary"
                    className="block px-4 py-2 md:text-base lg:text-lg xl:text-xl hover:bg-gray-100"
                  >
                    กรุ๊ปงานแบบประจำเดือน
                  </LinkComponent>
                </div>
              </div>

              <LinkComponent
                to="/pnl/sewingorderforms"
                className="md:text-base lg:text-lg xl:text-xl"
              >
                ใบจ่ายงานค่าตัดเย็บ
              </LinkComponent>

              <LinkComponent
                to="/pnl/fabricreceipt1"
                className="md:text-base lg:text-lg xl:text-xl"
              >
                ใบรับผ้า
              </LinkComponent>
              {/* <LinkComponent to="/pnl/imgselectors">แกลเลอรี่ที่เลือก</LinkComponent> */}
            </ul>
          </div>

          {/* ปุ่มออกจากระบบ */}
          <div className="absolute right-5">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="text-sm font-semibold bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                ออกจากระบบ
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navigation;
