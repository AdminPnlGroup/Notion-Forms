import React, { useState, useEffect } from "react";
import Navigation from "../component/Navigation";
import { FaPrint } from "react-icons/fa6";
import CardComponent from "../component/CardComponent";
import FilterMonthly from "../component/FilterMonthly";

function MonthlySummary() {
  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("ธันวาคม/67");
  const [allMonths, setAllMonths] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedStatusColor, setSelectedStatusColor] = useState(null);
  const [error, setError] = useState(null);
  const [allYears, setAllYears] = useState([]);

  async function fetchDataFromAPIEndpoint() {
    try {
      const response = await fetch("http://192.168.213.190:4000/notion-msum");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      // ===== เรียงเดือนตามลำดับที่ต้องการ =====
      const desiredOrder = [
        "นอกแผน",
        "มกราคม",
        "กุมภาพันธ์",
        "มีนาคม",
        "เมษายน",
        "พฤษภาคม",
        "มิถุนายน",
        "กรกฎาคม",
        "สิงหาคม",
        "กันยายน",
        "ตุลาคม",
        "พฤศจิกายน",
        "ธันวาคม",
      ];

      const monthsSet = new Set(
        result.results
          .map((item) => item?.properties?.["เดือน"]?.select?.name)
          .filter(Boolean)
      );

      const allUniqueMonths = [...monthsSet];
      const orderedMonths = [
        ...desiredOrder.filter((month) => monthsSet.has(month)),
        ...allUniqueMonths.filter((m) => !desiredOrder.includes(m)),
      ];
      setAllMonths(orderedMonths);

      const years = [
        ...new Set(
          result.results
            .map((item) => item?.properties?.["ปี"]?.select?.name)
            .filter(Boolean)
        ),
      ];
      setAllYears(years);

      const filteredData = result.results
        .map((item) => {
          const title = item?.properties?.["รหัสเซต"]?.title;
          const code = title && title.length > 0 ? title[0].plain_text : "";
          const month = item?.properties?.["เดือน"]?.select?.name;
          const year = item?.properties?.["ปี"]?.select?.name;
          const checkbox = item?.properties?.Checkbox?.checkbox;
          return { item, code, month, year, checkbox };
        })
        .filter(
          ({ code, month, year, checkbox }) =>
            code &&
            month === selectedMonth &&
            (selectedYear ? year === selectedYear : true) &&
            checkbox === true
        )
        .map(({ item, code }) => ({
          ...item,
          codePrefix: code.slice(0, 2).toUpperCase(),
        }));

      const sortedData = filteredData.sort((a, b) => {
        const setCodeA =
          a.properties?.["รหัสเซต"]?.title?.[0]?.plain_text || "";
        const setCodeB =
          b.properties?.["รหัสเซต"]?.title?.[0]?.plain_text || "";
        const setCompare = setCodeA.localeCompare(setCodeB, "th", {
          numeric: true,
        });
        if (setCompare !== 0) return setCompare;

        const lotA =
          a.properties?.["รหัสล็อต"]?.rich_text?.[0]?.plain_text || "";
        const lotB =
          b.properties?.["รหัสล็อต"]?.rich_text?.[0]?.plain_text || "";
        return lotA.localeCompare(lotB, "th", { numeric: true });
      });

      const groupedData = groupByCode(sortedData);
      const chunkedData = chunkArray(groupedData, 9);
      setData(chunkedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    }
  }

  function groupByCode(data) {
    const groupMap = {};
    data.forEach((item) => {
      const title = item?.properties?.["รหัสเซต"]?.title;
      const code = title && title.length > 0 ? title[0].plain_text : "";
      if (!groupMap[code]) {
        groupMap[code] = [];
      }
      groupMap[code].push(item);
    });
    return Object.values(groupMap).flat();
  }

  function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  useEffect(() => {
    fetchDataFromAPIEndpoint();
  }, [selectedMonth, selectedBrand, selectedColor, selectedYear]);

  const printRef = React.useRef(null);

  const handlePrint = () => {
    window.print();
  };

  const filteredByBrand = selectedBrand
    ? data.filter((item) => item.codePrefix === selectedBrand)
    : data;
  const filteredByColor = selectedColor
    ? filteredByBrand.filter((item) => item.color === selectedColor)
    : filteredByBrand;
  const filteredByStatus = selectedStatusColor
    ? filteredByColor.filter(
        (item) =>
          item.properties?.["ติดตามสถานะ"]?.formula?.string ===
          selectedStatusColor
      )
    : filteredByColor;

  return (
    <>
      <Navigation />
      <FilterMonthly
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        allMonths={allMonths}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        selectedStatusColor={selectedStatusColor}
        setSelectedStatusColor={setSelectedStatusColor}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        allYears={allYears}
        error={error}
      />
      <button
        onClick={handlePrint}
        className="text-4xl fixed right-20 bottom-10 text-blue-400 hover:text-blue-500 print:hidden"
      >
        <FaPrint />
      </button>
      <section
        style={{ fontFamily: "IBM Plex Sans Thai, serif" }}
        className="container max-w-full bg-gray-100 py-4 print:pt-0 print:pb-0"
      >
        {error && <div className="error">{error}</div>}
        {(() => {
          const filteredData = data.flat().filter((item) => {
            const brandMatch = selectedBrand
              ? item.codePrefix === selectedBrand
              : true;
            const colorMatch = selectedColor
              ? item.color === selectedColor
              : true;
            const statusMatch = selectedStatusColor
              ? item.properties?.["ติดตามสถานะ"]?.formula?.string ===
                selectedStatusColor
              : true;
            return brandMatch && colorMatch && statusMatch;
          });

          if (filteredData.length === 0) {
            return (
              <div className="text-center text-2xl text-gray-400 mt-10">
                ไม่พบข้อมูล
              </div>
            );
          }

          return chunkArray(filteredData, 9).map((chunk, index) => (
            <div
              ref={printRef}
              key={index}
              className="mx-auto px-8 w-[210mm] h-[297mm] bg-white mb-2 flex justify-between flex-col"
            >
              <CardComponent
                data={chunk}
                index={index + 1}
                setSelectedMonth={selectedMonth}
                selectedBrand={selectedBrand}
              />
            </div>
          ));
        })()}
      </section>
    </>
  );
}

export default MonthlySummary;
