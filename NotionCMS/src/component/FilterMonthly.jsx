import React from "react";
import { IoMdRefreshCircle } from "react-icons/io";

function FilterMonthly({
  selectedMonth,
  setSelectedMonth,
  allMonths,
  selectedBrand,
  setSelectedBrand,
  selectedStatusColor,
  setSelectedStatusColor,
  selectedYear,
  setSelectedYear,
  allYears,
  error,
}) {
  const refreshCache = async (key) => {
    const res = await fetch("http://192.168.213.9:4000/refresh-cache", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cacheKey: key }),
    });

    const result = await res.json();
    alert(result.message);
  };

  return (
    <div className="print:hidden mb-10">
      <form className="max-w-lg mx-auto">
        {/* Month/Year */}
        <div className="flex justify-end gap-2">
          <p className="font-semibold">Refresh Data</p>
          <button
            type="button"
            className="text-2xl text-gray-400 hover:text-sky-500"
            onClick={() => refreshCache("msum")}
          >
            <IoMdRefreshCircle />
          </button>
        </div>
        <label
          htmlFor="month-select"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Select Month :
        </label>
        <select
          id="month-select"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
        >
          <option value="">Please select</option>
          {allMonths?.map((month, index) => (
            <option key={index} value={month}>
              {month}
            </option>
          ))}
        </select>

        {/* Year */}
        <label
          htmlFor="year-select"
          className="block mt-4 mb-2 text-sm font-medium text-gray-900"
        >
          Select Year :
        </label>
        <select
          id="year-select"
          value={selectedYear || ""}
          onChange={(e) => setSelectedYear(e.target.value || null)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
        >
          <option value="">ทั้งหมด</option>
          {allYears?.map((year, index) => (
            <option key={index} value={year}>
              {year}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-2">
          <div>
            {/* Brand */}
            <label className="block my-2 text-sm font-medium text-gray-900">
              Select Brand :
            </label>
            <div className="flex flex-wrap gap-2">
              {["PN", "CK", "CB", "CW"].map((brand) => (
                <button
                  key={brand}
                  type="button"
                  className={`px-3 py-1 rounded cursor-pointer bg-gray-400 border border-gray-300 text-white ${
                    selectedBrand === brand
                      ? "bg-sky-300"
                      : "bg-gray-300 text-black"
                  }`}
                  onClick={() =>
                    setSelectedBrand(brand === selectedBrand ? null : brand)
                  }
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
          <div>
            {/* Status */}
            <label className="block my-2 text-sm font-medium text-gray-900">
              Select Status :
            </label>
            <div className="flex flex-wrap gap-2">
              {["🟩🟩🟩🟩", "🟨🟨🟨🟨", "🟥🟥🟥🟥", "🟦🟦🟦🟦"].map(
                (status) => (
                  <button
                    key={status}
                    type="button"
                    className={`px-3 py-1 rounded border cursor-pointer ${
                      selectedStatusColor === status
                        ? "bg-gray-800 text-white border-gray-700"
                        : "bg-gray-100 text-black border-gray-400"
                    }`}
                    onClick={() =>
                      setSelectedStatusColor(
                        status === selectedStatusColor ? null : status
                      )
                    }
                  >
                    {status}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default FilterMonthly;
