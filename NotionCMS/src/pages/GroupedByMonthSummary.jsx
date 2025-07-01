// GroupedByMonthSummary.jsx
import React, { useState, useEffect } from "react";
import Navigation from "../component/Navigation";
import AdvancedFilter from "../component/AdvancedFilter";
import { FaRegHeart, FaHeart, FaTrash } from "react-icons/fa6";

function GroupedByMonthSummary() {
  const [data, setData] = useState([]); // สถานะเก็บข้อมูลดิบทั้งหมดที่ดึงมาจาก API
  const [error, setError] = useState(null); // สถานะเก็บข้อผิดพลาดจากการ fetch data
  const [reactions, setReactions] = useState({}); // สถานะเก็บสถานะการกดถูกใจ (heart) ของแต่ละรายการ
  const [activeFilter, setActiveFilter] = useState("all"); // สถานะสำหรับ Active Filter: 'all' หรือ 'heart'

  // สถานะสำหรับเก็บค่าที่ผู้ใช้เลือกจาก AdvancedFilter
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedStatus, setSelectedStatus] = useState([]); // ใช้ Array เพื่อรองรับ Multiple Select

  const [selectedImage, setSelectedImage] = useState(null); // สถานะสำหรับเก็บ URL รูปภาพที่กำลังแสดงใน Modal

  // สถานะสำหรับเก็บตัวเลือกทั้งหมดสำหรับ dropdowns (เดือน, ปี, แบรนด์, สถานะ)
  const [allMonths, setAllMonths] = useState([]);
  const [allYears, setAllYears] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  const [allStatuses, setAllStatuses] = useState([]);

  // useEffect สำหรับดึงข้อมูลเริ่มต้น (ข้อมูลหลักและสถานะ Reactions)
  useEffect(() => {
    async function fetchInitialData() {
      try {
        // 1. ดึงข้อมูลหลักจาก Notion API ผ่าน Backend
        const response = await fetch("http://192.168.213.190:4000/notion-msum");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        const rawData = result.results || [];
        setData(rawData); // กำหนดข้อมูลดิบให้ state

        // กำหนด Brands ที่อนุญาตและเรียงลำดับ
        const allowedBrands = ["PN", "CK", "CB", "CW"];

        // กำหนดลำดับของเดือน
        const monthsOrder = [
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

        // 2. ดึงข้อมูลสำหรับ Dropdown Filters
        // ดึงและจัดเรียงเดือน
        const monthsRaw = rawData
          .map((item) => item.properties?.["เดือน"]?.select?.name)
          .filter(Boolean); // กรองค่าว่าง/undefined
        const uniqueMonths = [...new Set(monthsRaw)]; // เอาค่าที่ไม่ซ้ำกัน
        const customSortedMonths = uniqueMonths.sort((a, b) => {
          if (a === "นอกแผน") return -1; // ให้ "นอกแผน" มาก่อน
          if (b === "นอกแผน") return 1;
          return monthsOrder.indexOf(a) - monthsOrder.indexOf(b); // เรียงตามลำดับเดือน
        });

        // ดึงและจัดเรียงปี (ย้อนหลัง)
        const years = [
          ...new Set(
            rawData
              .map((item) => item.properties?.["ปี"]?.select?.name)
              .filter(Boolean)
          ),
        ];
        setAllYears(years.sort().reverse()); // เรียงจากปีล่าสุดไปเก่าสุด

        // ดึงและจัดเรียงแบรนด์ (ให้ PN, CK, CB, CW มาก่อน)
        const extractedBrands = rawData
          .map((item) =>
            item.properties?.["รหัสเซต"]?.title[0]?.plain_text
              ?.slice(0, 2) // ตัดเอา 2 ตัวแรก
              ?.toUpperCase()
          )
          .filter(Boolean);
        const brandSet = [...new Set(extractedBrands)];
        const brands = [
          ...allowedBrands.filter((b) => brandSet.includes(b)), // แบรนด์ที่อนุญาตและอยู่ในข้อมูลจริง
          ...brandSet.filter((b) => !allowedBrands.includes(b)), // แบรนด์อื่นๆ ที่เหลือ
        ];
        setAllBrands(brands);

        // ดึงและจัดเรียงสถานะ
        const statuses = [
          ...new Set(
            rawData
              .map((item) => item.properties?.["ติดตามสถานะ"]?.formula?.string)
              .filter(Boolean)
          ),
        ];
        setAllStatuses(statuses.sort()); // เรียงตามตัวอักษร

        setAllMonths(customSortedMonths); // กำหนดตัวเลือกเดือน

        // 3. ดึงสถานะ Reaction (Heart) จาก Backend
        const reactionsResponse = await fetch(
          "http://192.168.213.190:4000/reactions"
        );
        if (!reactionsResponse.ok)
          throw new Error(`HTTP error! status: ${reactionsResponse.status}`);
        const { hearts } = await reactionsResponse.json(); // ดึง array ของ item IDs ที่ถูกใจ

        // แปลง array ของ ID เป็น object เพื่อให้เข้าถึงได้ง่ายขึ้น (key = id, value = { heart: true })
        const initialReactions = {};
        for (const id of hearts) {
          if (!initialReactions[id]) initialReactions[id] = {};
          initialReactions[id]["heart"] = true;
        }
        setReactions(initialReactions); // กำหนดสถานะ Reactions เริ่มต้น
      } catch (err) {
        console.error("Error during initial data fetch:", err);
        setError(err.message); // กำหนดข้อผิดพลาดหากมี
      }
    }

    fetchInitialData(); // เรียกใช้ฟังก์ชันดึงข้อมูลเมื่อ component mount
  }, []); // [] ทำให้ useEffect ทำงานแค่ครั้งเดียวเมื่อ component ถูกโหลด

  // ฟังก์ชันสำหรับจัดการการกด Reaction (Heart)
  const handleReaction = async (id, reactionType) => {
    const currentReactionState = reactions[id]?.[reactionType] || false; // สถานะปัจจุบันของ Reaction
    // อัปเดต UI ทันที (Optimistic Update)
    setReactions((prev) => ({
      ...prev,
      [id]: { ...prev[id], [reactionType]: !currentReactionState },
    }));
    try {
      // ส่งข้อมูลไปยัง Backend เพื่อบันทึกสถานะ Reaction
      await fetch("http://192.168.213.190:4000/react", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: id, reactionType: reactionType }),
      });
    } catch (error) {
      console.error(`Failed to update ${reactionType} status:`, error);
      // หากเกิดข้อผิดพลาด ให้ย้อนสถานะใน UI กลับ
      setReactions((prev) => ({
        ...prev,
        [id]: { ...prev[id], [reactionType]: currentReactionState },
      }));
    }
  };

  // ฟังก์ชันสำหรับล้าง Reactions ทั้งหมด
  const handleClearAllReactions = async () => {
    if (!window.confirm("Are you sure you want to clear ALL reactions?"))
      return; // ยืนยันก่อนลบ
    const previousReactions = reactions; // เก็บสถานะเก่าไว้เผื่อ Rollback
    setReactions({}); // ล้าง Reactions ใน UI ทันที
    try {
      const response = await fetch(
        "http://192.168.213.190:4000/reactions/clear",
        { method: "POST" }
      );
      if (!response.ok) throw new Error("Server failed to clear reactions");
    } catch (error) {
      console.error("Failed to clear all reactions:", error);
      alert("Could not clear reactions. Please try again.");
      setReactions(previousReactions); // Rollback สถานะหากมีข้อผิดพลาด
    }
  };

  // กรองข้อมูลตามที่ผู้ใช้เลือกใน dropdown filters (Month, Year, Brand, Status)
  const filteredByDropdowns = data
    .filter(
      (item) =>
        !selectedMonth || // ถ้าไม่ได้เลือกเดือน หรือเดือนตรงกัน
        item.properties?.["เดือน"]?.select?.name === selectedMonth
    )
    .filter(
      (item) =>
        !selectedYear || // ถ้าไม่ได้เลือกปี หรือปีตรงกัน
        item.properties?.["ปี"]?.select?.name === selectedYear
    )
    .filter((item) => {
      const codePrefix =
        item.properties?.["รหัสเซต"]?.title[0]?.plain_text
          ?.slice(0, 2)
          ?.toUpperCase() || "";
      return !selectedBrand || codePrefix === selectedBrand; // ถ้าไม่ได้เลือกแบรนด์ หรือแบรนด์ตรงกัน
    })
    .filter((item) => {
      const itemStatus = item.properties?.["ติดตามสถานะ"]?.formula?.string;
      return selectedStatus.length === 0 || selectedStatus.includes(itemStatus); // ถ้าไม่ได้เลือกสถานะ หรือสถานะอยู่ในรายการที่เลือก
    });

  // กรองข้อมูลเฉพาะรายการที่ถูกใจ (จากข้อมูลที่ผ่านการกรอง Dropdown แล้ว)
  const heartedData = filteredByDropdowns.filter(
    (item) => reactions[item.id]?.heart
  );

  // กำหนดข้อมูลที่จะแสดงผลจริง (ขึ้นอยู่กับ activeFilter)
  let displayedData = [];
  switch (activeFilter) {
    case "heart":
      displayedData = heartedData; // ถ้าเลือก 'heart' แสดงเฉพาะรายการที่ถูกใจ
      break;
    default:
      displayedData = filteredByDropdowns; // ถ้าเลือก 'all' (ค่าเริ่มต้น) แสดงทั้งหมดที่ผ่านการกรอง dropdown
  }

  // เรียงลำดับข้อมูลที่แสดงผลตาม "รหัสเซต" (ตัวเลข)
  displayedData = displayedData.sort((a, b) => {
    const aCode = a.properties?.["รหัสเซต"]?.title?.[0]?.plain_text || "";
    const bCode = b.properties?.["รหัสเซต"]?.title?.[0]?.plain_text || "";
    return aCode.localeCompare(bCode, "th", { numeric: true }); // เรียงตามตัวอักษรและตัวเลข
  });

  // ฟังก์ชันสำหรับคำนวณผลรวมของแต่ละประเภทและผลรวมทั้งหมด
  // รับ parameter 'dataToCalculate' ซึ่งจะเป็น filteredByDropdowns หรือ heartedData
  const calculateTotals = (dataToCalculate) => {
    const categoryMapping = {
      0: "อุปกรณ์ตกแต่ง",
      1: "แซ็ก",
      2: "กระโปรง",
      3: "เสื้อลำลอง (เบล้าส์)",
      4: "กางเกง",
      5: "สูท/แจ็คเก็ต",
      6: "เสื้อตัวใน",
      7: "นิตแวร์",
      8: "เสื้อคลุมมีตัวใน",
      9: "ผ้ายืด",
      10: "ไม่มีรหัสแพทเทิร์น",
    };

    const categoryTotals = {};
    for (let i = 0; i <= 10; i++) {
      categoryTotals[i.toString()] = 0;
    }

    let overallTotal = 0;

    dataToCalculate.forEach((item) => {
      let foundPattern = false;

      for (const key in categoryMapping) {
        if (key === "10") continue; // ข้าม "ไม่มีรหัสแพทเทิร์น" ไว้ก่อน
        const propertyName = `${key} ${categoryMapping[key]}`;
        const value = item.properties?.[propertyName]?.formula?.string;

        if (value && !isNaN(parseInt(value))) {
          const num = parseInt(value);
          categoryTotals[key] += num;
          overallTotal += num;
          foundPattern = true;
        }
      }

      // ถ้าไม่พบ pattern ใดเลย ให้ใช้ "จำนวนผลิตจริง" ใส่ในหมวด 10
      if (!foundPattern) {
        const fallbackValue = item.properties?.["จำนวนผลิตจริง"]?.number;
        if (fallbackValue && !isNaN(fallbackValue)) {
          categoryTotals["10"] += fallbackValue;
          overallTotal += fallbackValue;
        }
      }
    });

    return { categoryTotals, overallTotal };
  };

  // เรียกใช้ calculateTotals โดยส่งข้อมูลที่เหมาะสมตาม activeFilter
  const { categoryTotals, overallTotal } = calculateTotals(
    activeFilter === "heart" ? heartedData : filteredByDropdowns
  );

  // ฟังก์ชันสำหรับเปิด Modal แสดงรูปภาพขนาดใหญ่
  const openImageModal = (url) => {
    setSelectedImage(url);
  };

  // ฟังก์ชันสำหรับปิด Modal แสดงรูปภาพขนาดใหญ่
  const closeImageModal = () => {
    setSelectedImage(null);
  };

  // console.log(displayedData); // สำหรับ debug

  return (
    <>
      <Navigation />
      {/* Component สำหรับ Advanced Filter */}
      <AdvancedFilter
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        allMonths={allMonths}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        allYears={allYears}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        allBrands={allBrands}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        allStatuses={allStatuses}
        error={error}
      />
      {/* ส่วนควบคุม Favorites Filter และ Clear All Reactions */}
      <div className="p-10 pt-2 pb-2 flex items-center space-x-4">
        <span className="text-sm font-bold">Favorites:</span>
        <button
          onClick={() => setActiveFilter("all")} // ปุ่มสำหรับแสดงข้อมูลทั้งหมด
          className={`px-3 py-1 text-xs rounded-full ${
            activeFilter === "all" ? "bg-black text-white" : "bg-gray-200"
          }`}
        >
          {/* เปลี่ยนตรงนี้เพื่อให้ปุ่ม All แสดงจำนวนเดียวกับ heartedData.length */}
          All ({filteredByDropdowns.length})
        </button>
        <button
          onClick={() => setActiveFilter("heart")} // ปุ่มสำหรับแสดงเฉพาะข้อมูลที่ถูกใจ
          className={`px-3 py-1 text-xs rounded-full flex items-center ${
            activeFilter === "heart" ? "bg-red-500 text-white" : "bg-gray-200"
          }`}
        >
          <FaHeart className="mr-1" /> ({heartedData.length})
        </button>
        <div className="flex-grow"></div> {/* เว้นช่องว่าง */}
        <button
          onClick={handleClearAllReactions} // ปุ่มสำหรับล้าง Reaction ทั้งหมด
          className="px-3 py-1 text-xs rounded-full flex items-center bg-gray-600 text-white hover:bg-red-700"
        >
          <FaTrash className="mr-1" /> Clear All
        </button>
      </div>

      {/* ตารางสรุปผลรวมตาม Category */}
      <div className="p-10">
        <table className="table-auto w-full border border-gray-200 text-center text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">
                0<br />
                อุปกรณ์ตกแต่ง
              </th>
              <th className="border p-2">
                1<br />
                แซ็ก
              </th>
              <th className="border p-2">
                2<br />
                กระโปรง
              </th>
              <th className="border p-2">
                3<br />
                เสื้อลำลอง (เบล้าส์)
              </th>
              <th className="border p-2">
                4<br />
                กางเกง
              </th>
              <th className="border p-2">
                5<br />
                สูท/แจ็คเก็ต
              </th>
              <th className="border p-2">
                6<br />
                เสื้อตัวใน
              </th>
              <th className="border p-2">
                7<br />
                นิตแวร์
              </th>
              <th className="border p-2">
                8<br />
                เสื้อคลุมมีตัวใน
              </th>
              <th className="border p-2">
                9<br />
                ผ้ายืด
              </th>
              <th className="border p-2">
                10
                <br />
                ไม่มีรหัสแพทเทิร์น
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="border p-2">{categoryTotals["0"]}</td>
              <td className="border p-2">{categoryTotals["1"]}</td>
              <td className="border p-2">{categoryTotals["2"]}</td>
              <td className="border p-2">{categoryTotals["3"]}</td>
              <td className="border p-2">{categoryTotals["4"]}</td>
              <td className="border p-2">{categoryTotals["5"]}</td>
              <td className="border p-2">{categoryTotals["6"]}</td>
              <td className="border p-2">{categoryTotals["7"]}</td>
              <td className="border p-2">{categoryTotals["8"]}</td>
              <td className="border p-2">{categoryTotals["9"]}</td>
              <td className="border p-2">{categoryTotals["10"]}</td>
            </tr>
          </tbody>

          <tfoot className="font-bold">
            <tr className="bg-gray-100 text-black">
              <td colSpan={11} className="border p-2 text-right w-full">
                รวมทั้งหมด: <span className="font-bold">{overallTotal}</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Grid แสดงรายการสินค้า */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-5 p-10 pt-4">
        {displayedData.length > 0 ? (
          displayedData.map((item) => {
            const itemReactions = reactions[item.id] || {}; // สถานะ Reaction ของ item นี้
            return (
              <div key={item.id}>
                <li className="border border-gray-300 h-82 grid grid-rows-[60%_40%] text-center p-1">
                  <div
                    className={`grid gap-2 p-2 ${
                      item.properties?.["ตุ๊กตา"]?.files.length === 2
                        ? "grid-cols-2"
                        : item.properties?.["ตุ๊กตา"]?.files.length === 3
                        ? "grid-cols-3"
                        : item.properties?.["ตุ๊กตา"]?.files.length === 4
                        ? "grid-cols-4"
                        : "grid-cols-1"
                    }`}
                  >
                    {item.properties?.["ตุ๊กตา"]?.files.length > 0 ? (
                      item.properties["ตุ๊กตา"].files.map((fileItem, index) => (
                        <div
                          key={index}
                          className="grid content-center justify-center"
                        >
                          <img
                            src={fileItem?.file?.url || fileItem?.external?.url}
                            alt=""
                            className="object-contain rounded h-36 cursor-pointer hover:opacity-80"
                            onClick={() =>
                              openImageModal(
                                fileItem?.file?.url || fileItem?.external?.url
                              )
                            }
                          />
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center w-full h-36 bg-gray-100 text-gray-400 rounded">
                        <p>No Image</p>
                      </div>
                    )}
                  </div>
                  <div className="border w-full border-gray-300 text-start p-1 relative text-xs">
                    {/* ตำแหน่งสถานะ (ซ้ายบน) */}
                    <div className="absolute -top-47 left-0">
                      {item.properties?.["ติดตามสถานะ"]?.formula?.string || ""}
                    </div>
                    {/* รหัสเซต */}
                    <div>
                      <p className="font-bold mt-1">
                        รหัสเชต :{" "}
                        <span className="text-blue-800">
                          {item.properties?.["รหัสเซต"]?.title[0]?.plain_text}
                        </span>
                      </p>
                    </div>
                    {/* วันรับงาน (ขวาบน) */}
                    <p className="mt-1 absolute -top-6">
                      วันรับงาน :{" "}
                      {item.properties?.["กำหนดรับงาน"]?.date?.start
                        ? new Intl.DateTimeFormat("th-TH", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }).format(
                            new Date(item.properties["กำหนดรับงาน"].date.start)
                          )
                        : " ".repeat(25)}
                    </p>
                    {/* จำนวนผลิตจริง */}
                    <p className="mt-1">
                      จำนวนผลิตจริง :{" "}
                      <span>
                        {item.properties?.["จำนวนผลิตจริง"]?.number ?? ""}
                      </span>
                    </p>
                    {/* สถานะสินค้า */}
                    <p className="mt-1">
                      สถานะสินค้า :{" "}
                      <span>
                        {item.properties?.["สถานะสินค้า"]?.multi_select[0]
                          ?.name ?? ""}
                      </span>
                    </p>
                    {/* ปุ่ม Reaction (Heart) */}
                    <div className="absolute bottom-2 right-2 flex space-x-2">
                      <button
                        className="text-xl"
                        onClick={() => handleReaction(item.id, "heart")}
                      >
                        {itemReactions.heart ? (
                          <FaHeart className="text-red-500" /> // แสดง Heart ทึบเมื่อถูกใจ
                        ) : (
                          <FaRegHeart /> // แสดง Heart กรอบเมื่อยังไม่ถูกใจ
                        )}
                      </button>
                    </div>
                  </div>
                </li>
              </div>
            );
          })
        ) : (
          // กรณีไม่มีข้อมูลที่ตรงตาม filter
          <div className="col-span-full text-center text-2xl text-gray-400 mt-10">
            No data matches the current filters.
          </div>
        )}
        {/* Modal สำหรับแสดงรูปภาพขนาดใหญ่ */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center"
            onClick={closeImageModal} // คลิกที่ overlay เพื่อปิด Modal
          >
            <img
              src={selectedImage}
              alt="full view"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()} // ป้องกันปิด modal ตอนคลิกที่รูป
            />
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-red-400"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default GroupedByMonthSummary;
