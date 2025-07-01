import React, { useState, useEffect } from "react";
import Navigation from "../component/Navigation";
import { FaPrint } from "react-icons/fa6";
import SearchFabricReceipt from "../component/SearchFabricReceipt";
import FabricTableRows1 from "../component/FabricTableRows1";

function FabricReceipt1() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchFabricInventory() {
      try {
        const response = await fetch(
          "http://192.168.213.9:4000/notion-fabric-inventory"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result.results);
      } catch (error) {
        console.error("Error fetching Fabric Inventory:", error);
        setError(error.message);
      }
    }
    fetchFabricInventory();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const filteredData = data.filter((item) => {
    const code =
      item.properties?.["รหัสสี (Fabric Color Code) Mirror"]?.formula?.string ||
      "";
    return code.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const groupedByCode = filteredData.reduce((acc, item) => {
    const code =
      item.properties?.["รหัสสี (Fabric Color Code) Mirror"]?.formula?.string ||
      "ไม่ทราบรหัส";
    if (!acc[code]) {
      acc[code] = { code, items: [] };
    }
    acc[code].items.push(item);
    return acc;
  }, {});

  const groupTotals = {};
  for (const code in groupedByCode) {
    groupTotals[code] = groupedByCode[code].items.reduce((sum, currentItem) => {
      const amount = parseFloat(
        currentItem.properties?.["ยอดคงเหลือ(จำนวนหลา) (Remaining Yardage)"]
          ?.rollup?.array?.[0]?.formula?.number || 0
      );
      return sum + amount;
    }, 0);
  }

  // ทำการเรียงลำดับ items (รหัสพับ) ภายในแต่ละกลุ่มก่อนที่จะนำไปแบ่งหน้า
  for (const code in groupedByCode) {
    groupedByCode[code].items.sort((a, b) => {
      const rollTagA =
        a.properties?.["Full Fabric Roll Tag"]?.rollup?.array?.[0]?.formula
          ?.string || "";
      const rollTagB =
        b.properties?.["Full Fabric Roll Tag"]?.rollup?.array?.[0]?.formula
          ?.string || "";
      // ใช้ localeCompare พร้อม option numeric:true เพื่อให้เรียงเลขในข้อความได้ถูกต้อง (เช่น 'PB4645' มาก่อน 'PB4650')
      return rollTagA.localeCompare(rollTagB, undefined, { numeric: true });
    });
  }

  const allGroups = Object.values(groupedByCode).sort((a, b) => {
    // Get the smallest roll tag for group 'a'
    const smallestRollTagA =
      a.items.length > 0
        ? a.items[0].properties?.["Full Fabric Roll Tag"]?.rollup?.array?.[0]
            ?.formula?.string || ""
        : "";

    // Get the smallest roll tag for group 'b'
    const smallestRollTagB =
      b.items.length > 0
        ? b.items[0].properties?.["Full Fabric Roll Tag"]?.rollup?.array?.[0]
            ?.formula?.string || ""
        : "";

    // Compare based on the smallest roll tags numerically
    return smallestRollTagA.localeCompare(smallestRollTagB, undefined, {
      numeric: true,
    });
  });

  // ✨ --- START: แก้ไขโค้ดส่วนนี้ --- ✨
  const pages = [];
  let currentPageData = []; // จะเป็น array ของ item แต่ละรายการที่อยู่บนหน้าปัจจุบัน (flat list)
  let currentTotalVisualRows = 0; // จำนวนแถวรวมที่ใช้ไปแล้วบนหน้าปัจจุบัน (รวม header, detail, total)

  // ประมาณค่าจำนวนแถวทั้งหมดที่หน้ากระดาษสามารถรองรับได้
  // โดยพิจารณาจาก: 16 แถวรายละเอียด (จากเงื่อนไข group.items.length > 16)
  // + 2 แถวสำหรับ Header และ Total (สำหรับ 1 กลุ่มใหญ่) = 18 แถว
  // เพื่อให้มีความยืดหยุ่นมากขึ้นสำหรับหลายกลุ่ม ให้ประมาณ 20-22 แถว
  const MAX_TOTAL_VISUAL_ROWS_PER_PAGE = 22;
  const MAX_DETAIL_ROWS_FOR_CHUNK = 16; // จำนวนแถวรายละเอียดสูงสุดเมื่อตัดกลุ่มใหญ่

  allGroups.forEach((group) => {
    // คำนวณจำนวนแถวที่มองเห็น (visual rows) สำหรับกลุ่มนี้: 1 (header) + จำนวนรายการ (items) + 1 (total)
    const groupVisualRows = group.items.length + 2;

    if (group.items.length === 0) {
      // ข้ามกลุ่มที่ไม่มีรายการ
      return;
    }

    // กรณีที่ 1: กลุ่มนี้มีขนาดใหญ่มาก (เกินกว่า MAX_DETAIL_ROWS_FOR_CHUNK รายการ)
    // จำเป็นต้องแบ่งกลุ่มนี้ออกเป็นหลายส่วนในหน้ากระดาษ
    if (group.items.length > MAX_DETAIL_ROWS_FOR_CHUNK) {
      // หากมีรายการสะสมในหน้าปัจจุบัน ให้ดันหน้านั้นเข้าไปใน pages ก่อน
      if (currentPageData.length > 0) {
        pages.push(currentPageData);
        currentPageData = [];
        currentTotalVisualRows = 0;
      }

      // แบ่งกลุ่มใหญ่เป็นส่วนๆ (chunks) และแต่ละส่วนจะถือว่าเป็นหน้าใหม่
      for (let i = 0; i < group.items.length; i += MAX_DETAIL_ROWS_FOR_CHUNK) {
        const chunk = group.items.slice(i, i + MAX_DETAIL_ROWS_FOR_CHUNK);
        pages.push(chunk); // แต่ละ chunk คือหน้าหนึ่ง FabricTableRows1 จะจัดกลุ่มอีกครั้ง
      }
      // รีเซ็ตสำหรับกลุ่มถัดไปหลังจากจัดการกลุ่มใหญ่แล้ว
      currentPageData = [];
      currentTotalVisualRows = 0;
    } else {
      // กรณีที่ 2: กลุ่มนี้มีขนาดไม่ใหญ่มาก (น้อยกว่าหรือเท่ากับ MAX_DETAIL_ROWS_FOR_CHUNK รายการ)
      // ตรวจสอบว่าหากเพิ่มกลุ่มนี้เข้าไปในหน้าปัจจุบัน จะเกินขีดจำกัดจำนวนแถวรวมหรือไม่
      if (
        currentPageData.length > 0 && // ตรวจสอบว่าหน้าปัจจุบันไม่ว่างเปล่า
        currentTotalVisualRows + groupVisualRows >
          MAX_TOTAL_VISUAL_ROWS_PER_PAGE
      ) {
        // ถ้าเกิน ให้ดันหน้าปัจจุบันเข้า pages แล้วเริ่มหน้าใหม่ด้วยกลุ่มนี้
        pages.push(currentPageData);
        currentPageData = group.items; // เริ่มหน้าใหม่ด้วยรายการของกลุ่มนี้
        currentTotalVisualRows = groupVisualRows;
      } else {
        // ถ้าไม่เกิน ให้เพิ่มรายการของกลุ่มนี้เข้าไปในหน้าปัจจุบัน
        currentPageData.push(...group.items);
        currentTotalVisualRows += groupVisualRows;
      }
    }
  });

  // เพิ่มรายการที่เหลืออยู่ในหน้าสุดท้าย (ถ้ามี)
  if (currentPageData.length > 0) {
    pages.push(currentPageData);
  }
  // ✨ --- END: แก้ไขโค้ดส่วนนี้ --- ✨

  return (
    <>
      <Navigation className="print:hidden" />
      <SearchFabricReceipt
        search={search}
        setSearch={setSearch}
        onSearch={() => setSearchTerm(search)}
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
        {searchTerm && (
          <div>
            {filteredData.length > 0 ? (
              <>
                {pages.map((pageData, index) => (
                  <div
                    key={index}
                    className="mx-auto w-[210mm] h-[297mm] mb-2 bg-white shadow-lg p-8 break-after-page flex flex-col relative"
                  >
                    <FabricTableRows1
                      data={pageData}
                      groupTotals={groupTotals}
                    />
                    <div className="flex justify-center absolute bottom-6 left-16">
                      <div className="flex justify-between w-2xl">
                        <div>
                          พนักงานคลังวัตถุดิบ :{" "}
                          <span className="underline decoration-dotted underline-offset-5 decoration-1.5">
                            ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ
                          </span>
                        </div>
                        <div>
                          วันที่ :{" "}
                          <span className="underline decoration-dotted underline-offset-5 decoration-1.5">
                            ㅤㅤㅤ/ㅤㅤㅤㅤ/ㅤㅤㅤ
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center text-2xl font-semibold">
                ไม่พบข้อมูลที่ตรงกับ "{search}"
              </div>
            )}
          </div>
        )}
      </section>
    </>
  );
}

export default FabricReceipt1;
