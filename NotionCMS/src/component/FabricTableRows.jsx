import React from 'react';

function FabricTableRows({ data, filteredData, totalByFabricCode }) {
    // รวมจำนวนหลา ตามรหัสผ้า
    const totalByCode = data.reduce((acc, item) => {
        const code = item?.properties?.["รหัสสี (Fabric Color Code) Mirror"]?.formula?.string || "";
        const yard = item?.properties?.["ยอดคงเหลือ(จำนวนหลา) (Remaining Yardage)"]?.rollup?.array[0]?.formula?.number || 0;
        if (!acc[code]) {
            acc[code] = { yard: 0 };
        }
        acc[code].yard += yard;
        return acc;
    }, {});

    const shownCodes = new Set();

    function getBrandName(code = "") {
        const prefix = code.substring(0, 2).toUpperCase(); // ดึง 2 ตัวแรก
        const brandMap = {
            PN: "PULCINELLA",
            CK: "CLAUDIA KLEID",
            CB: "CLAUDIA KLEID B&W",
            CW: "CLAUDIA KLEID WEEKEND",
            LY: "LIYA",
            BN: "BONITA",
            AL: "ALL",
        };
        return `${prefix} (${brandMap[prefix] || "ไม่ทราบแบรนด์"})`;
    }

    return (
        <>
            <div className='text-center text-2xl font-bold my-2 mt-10'>
                ใบรับผ้า
            </div>

            <div className='flex justify-center mt-4'>
                <div className='grid grid-cols-2 w-2xl pl-2'>
                    <div className='grid gap-1'>
                        <div>
                            ผลิตภัณฑ์:{" "}
                            <span className="underline underline-offset-4">
                                {getBrandName(
                                    filteredData[0]?.properties?.["รหัสสี (Fabric Color Code) Mirror"]?.formula?.string || ""
                                )}
                            </span>
                        </div>
                        <div>
                            วันที่รับผ้าเข้า:{" "}
                            <span className="underline underline-offset-4">
                                {new Date(filteredData[0]?.properties?.["วันที่รับ (Received Date)"]?.date?.start)
                                    .toLocaleDateString("th-TH", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                            </span>
                        </div>
                        <div>ชื่อร้าน: <span className='underline underline-offset-4'>{data[0]?.properties?.["Supplier (mirror)"]?.rollup?.array[0]?.title[0]?.plain_text}</span>ㅤชนิดผ้า: <span className='underline underline-offset-4'>{filteredData[0]?.properties?.["ชนิดผ้า (Type of Fabric)"]?.multi_select[0]?.name}</span></div>
                    </div>
                    {/* {data[0]?.properties?.test1?.type} */}

                    <div className='grid gap-1'>
                        <div>
                            รหัสผลิตภัณฑ์:{" "}
                            <span className={filteredData[0]?.properties?.["รหัสร้านค้า (Supplier Code)"]?.rich_text?.[0]?.plain_text
                                ? 'underline underline-offset-4'
                                : ''}>
                                {filteredData[0]?.properties?.["รหัสร้านค้า (Supplier Code)"]?.rich_text?.[0]?.plain_text
                                    || "ไม่มีข้อมูล"}
                            </span>
                        </div>
                        <div>หน้าผ้า: <span className={filteredData[0]?.properties?.["หน้าผ้า (fabric surface)"]?.rollup?.array[0]?.number
                            ? 'underline underline-offset-4'
                            : ''}>
                            {filteredData[0]?.properties?.["หน้าผ้า (fabric surface)"]?.rollup?.array[0]?.number
                                ? `${filteredData[0].properties["หน้าผ้า (fabric surface)"].rollup.array[0].number} นิ้ว\n(${(filteredData[0].properties["หน้าผ้า (fabric surface)"].rollup.array[0].number * 2.54).toFixed(2)} ซ.ม)`
                                : "ไม่มีข้อมูล"}
                        </span>
                        </div>
                        <div>ราคาต่อหลา: <span className='underline underline-offset-4'>{filteredData[0]?.properties?.["ราคา ต่อ หลา (Price per Yard)"]?.number} บาท</span></div>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto mt-4">
                <table className="table-auto border-collapse w-full border border-black text-sm">
                    <thead>
                        <tr className="">
                            <th className="border border-black px-2 py-1">ตัวอย่างผ้า</th>
                            <th className="border border-black px-2 py-1">รหัสผ้า</th>
                            <th className="border border-black px-2 py-1">รหัสพับ</th>
                            <th className="border border-black px-2 py-1">จำนวน หลา / เมตร</th>
                            <th className="border border-black px-2 py-1">จำนวนรวม</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(() => {
                            const shownCodes = new Set();
                            const renderedRows = [];
                            const codeRowMap = {}; // เพื่อ track rowSpan

                            for (let i = 0; i < data.length; i++) {
                                const item = data[i];
                                const code = item?.properties?.["รหัสสี (Fabric Color Code) Mirror"]?.formula?.string || "";
                                const yard = item?.properties?.["ยอดคงเหลือ(จำนวนหลา) (Remaining Yardage)"]?.rollup?.array[0]?.formula?.number || 0;

                                const showRow = !shownCodes.has(code);
                                if (showRow) shownCodes.add(code);

                                const rowSpan = data.filter(d =>
                                    d?.properties?.["รหัสสี (Fabric Color Code) Mirror"]?.formula?.string === code
                                ).length;

                                renderedRows.push(
                                    <tr key={i}>
                                        {showRow ? (
                                            <td className="border border-black px-2 py-2 w-34 h-14 text-center" rowSpan={rowSpan}>
                                                {/* ตัวอย่างผ้า (คุณสามารถใส่ <img> หรือสไตล์ background ตรงนี้ได้) */}
                                            </td>
                                        ) : null}

                                        {/* รหัสผ้า */}
                                        {showRow ? (
                                            <td
                                                className="border border-black text-center align-middle px-2 py-2"
                                                rowSpan={rowSpan}
                                            >
                                                {code?.replace(/^(PN|CK|CB|CW|LY|BN)/, '')}
                                            </td>
                                        ) : null}

                                        {/* รหัสพับ */}
                                        <td className="border border-black px-2 py-2 text-center">
                                            {item?.properties?.["Full Fabric Roll Tag"]?.rollup?.array[0]?.formula?.string || ""}
                                        </td>

                                        {/* จำนวน หลา / เมตร */}
                                        <td className="border border-black px-2 py-2 w-39 text-center">
                                            {yard > 0 && (
                                                <>
                                                    {yard.toFixed(2)} หลา<br />
                                                    ({(yard * 0.9144).toFixed(2)} เมตร)
                                                </>
                                            )}
                                        </td>

                                        {/* จำนวนรวม */}
                                        {showRow ? (
                                            <td
                                                className="border border-black px-2 py-2 w-32 text-center align-middle"
                                                rowSpan={rowSpan}
                                            >
                                                {totalByFabricCode[code] > 0 && (
                                                    <div className="flex flex-col justify-center items-center w-full">
                                                        <span>{totalByFabricCode[code].toFixed(2)} หลา</span>
                                                        <span>({(totalByFabricCode[code] * 0.9144).toFixed(2)} เมตร)</span>
                                                    </div>
                                                )}
                                            </td>
                                        ) : null}
                                    </tr>

                                );
                            }

                            // ✅ เติมแถวว่างจนกว่าจะครบ 6 แถว
                            while (renderedRows.length < 14) {
                                renderedRows.push(
                                    <tr key={`empty-${renderedRows.length}`}>
                                        <td className="border border-black px-2 py-2 text-center h-14"></td>
                                        <td className="border border-black px-2 py-2 text-center"></td>
                                        <td className="border border-black px-2 py-2 text-center"></td>
                                        <td className="border border-black px-2 py-2 text-center"></td>
                                        <td className="border border-black px-2 py-2 text-center"></td>
                                    </tr>
                                );
                            }

                            return renderedRows;
                        })()}
                    </tbody>
                </table>
            </div>

            <div className='flex justify-center'>
                <div className='flex mt-10 justify-between w-2xl'>
                    <div>พนักงานคลังวัตถุดิบ : <span className='underline decoration-dotted underline-offset-5 decoration-1.5'>ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ</span></div>
                    <div>วันที่ : <span className='underline decoration-dotted underline-offset-5 decoration-1.5'>ㅤㅤㅤ/ㅤㅤㅤㅤ/ㅤㅤㅤ</span></div>
                </div>
            </div>
        </>
    );
}

export default FabricTableRows;
