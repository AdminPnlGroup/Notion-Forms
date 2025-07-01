import React from "react";
import { IoMdRefreshCircle } from "react-icons/io";

// Component นี้รับ props ที่จำเป็นทั้งหมดเพื่อควบคุมฟิลเตอร์
function AdvancedFilter({
  // Props for Month Filter
  selectedMonth,
  setSelectedMonth,
  allMonths,

  // Props for Year Filter
  selectedYear,
  setSelectedYear,
  allYears,

  // Props for Brand Filter
  selectedBrand,
  setSelectedBrand,
  allBrands,

  // Props for Status Filter
  selectedStatus,
  setSelectedStatus,
  allStatuses,

  // General Props
  error,
}) {
  const refreshCache = async (key) => {
    try {
      const res = await fetch("http://192.168.213.190:4000/refresh-cache", {
        // โปรดตรวจสอบ IP Address ให้ถูกต้อง
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cacheKey: key }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with status: ${res.status}`);
      }

      const result = await res.json();
      alert(result.message);
      // โหลดหน้าเว็บใหม่เพื่อให้ข้อมูลที่เพิ่ง Refresh แสดงผล
      window.location.reload();
    } catch (err) {
      console.error("Failed to refresh cache:", err);
      alert("Error: Could not refresh data. See console for details.");
    }
  };

  return (
    <div className="print:hidden p-10 pb-4 pt-4 bg-gray-50 border-b">
      <div className="flex justify-end gap-2 items-center mb-4 max-w-5xl mx-auto">
        <p className="font-semibold text-sm text-gray-600">Refresh Data</p>
        <button
          type="button"
          title="Refresh Notion Data"
          className="text-2xl text-gray-400 hover:text-sky-500 transition-transform duration-300 hover:rotate-180"
          onClick={() => refreshCache("msum")}
        >
          <IoMdRefreshCircle />
        </button>
      </div>

      <form className="max-w-5xl mx-auto">
        {/* จัดเรียงฟิลเตอร์เป็น 4 คอลัมน์บนจอใหญ่ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Month Filter */}
          <div>
            <label
              htmlFor="month-select"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Select Month:
            </label>
            <select
              id="month-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option value="">All Months</option>
              {allMonths?.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <label
              htmlFor="year-select"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Select Year:
            </label>
            <select
              id="year-select"
              value={selectedYear || ""}
              onChange={(e) => setSelectedYear(e.target.value || "")}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option value="">All Years</option>
              {allYears?.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Select Brand:
            </label>
            <div className="flex flex-wrap gap-2">
              {allBrands?.map((brand) => (
                <button
                  key={brand}
                  type="button"
                  className={`px-3 py-1 text-sm rounded cursor-pointer border ${
                    selectedBrand === brand
                      ? "bg-sky-500 text-white border-sky-600"
                      : "bg-white hover:bg-gray-100 text-black border-gray-300"
                  }`}
                  onClick={() =>
                    setSelectedBrand(brand === selectedBrand ? "" : brand)
                  }
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Select Status:
            </label>
            <div className="flex flex-wrap gap-2 ">
              {allStatuses?.map((status) => {
                const isActive = selectedStatus.includes(status);
                return (
                  <button
                    key={status}
                    type="button"
                    className={`px-3 py-1 text-sm rounded border cursor-pointer ${
                      isActive
                        ? "bg-gray-800 text-white border-gray-900"
                        : "bg-white hover:bg-gray-100 text-black border-gray-300"
                    }`}
                    onClick={() => {
                      if (isActive) {
                        setSelectedStatus(
                          selectedStatus.filter((s) => s !== status)
                        );
                      } else {
                        setSelectedStatus([...selectedStatus, status]);
                      }
                    }}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </form>
      {error && <p className="mt-4 text-center text-red-500">{error}</p>}
    </div>
  );
}

export default AdvancedFilter;
