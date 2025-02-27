import React, { useState, useEffect, useMemo } from 'react'
import Signature from './Signature';

function SewingOrderForm({ properties }) {

    const [isCheckedTypeOfWork, setIsCheckedTypeOfWork] = useState("");
    const [isCheckedType, setIsCheckedType] = useState("");
    const [files, setFiles] = useState([]);
    const [tableInputs, setTableInputs] = useState([]);
    const [tableData, setTableData] = useState([]);

    // ดึงข้อมูลจาก properties และตั้งค่า state
    useEffect(() => {
        setIsCheckedTypeOfWork(properties?.["ชนิดงาน"]?.multi_select[0]?.name || "");
        setIsCheckedType(properties?.["ประเภท"]?.multi_select[0]?.name || "");

        // หาข้อมูลที่เกี่ยวข้องกับรหัสสี
        const newTableInputs = [];
        for (let i = 1; i <= 5; i++) {
            const colorKey = `รหัสสี${i > 1 ? ` (${i})` : ""}`;
            const sizeKey = `ไซส์${i > 1 ? ` (${i})` : ""}`;
            const quantityKey = `จำนวน(ไซต์)${i > 1 ? ` (${i})` : ""}`;

            if (properties?.[colorKey]?.rich_text?.[0]?.plain_text) {
                newTableInputs.push({
                    colorCode: properties[colorKey].rich_text[0].plain_text || "",
                    sizes: properties[sizeKey]?.rich_text?.[0]?.plain_text || "",
                    sizeQuantities: properties[quantityKey]?.rich_text?.[0]?.plain_text || "",
                });
            }
        }

        setTableInputs(newTableInputs);

        if (properties?.["รูปแบบ(ตุ๊กตา)"]?.files) {
            setFiles(properties["รูปแบบ(ตุ๊กตา)"].files);
        }
    }, [properties]);

    // คำนวณ tableData เมื่อ tableInputs เปลี่ยน
    useEffect(() => {
        setTableData(generateTableData());
    }, [tableInputs]);

    // ใช้ useMemo เพื่อลดการคำนวณ maxRows ที่ไม่จำเป็น
    const maxRows = useMemo(() => Math.max(...tableData.map(data => data.sizes.length), 0), [tableData]);

    const generateTableData = () => {
        const parseSizes = (sizes, quantities) => {
            const sizeArray = sizes.split("\n").map(Number).filter(n => !isNaN(n));
            const quantityArray = quantities.split("\n").map(Number).filter(n => !isNaN(n));

            return sizeArray.map((size, index) => [size, quantityArray[index] || 0]);
        };

        return tableInputs.map(input => ({
            code: input.colorCode.trim(),
            sizes: parseSizes(input.sizes, input.sizeQuantities),
        }));
    };

    return (
        <>
            <div>
                <h2 className="text-center text-4xl font-bold mt-10">ใบจ่ายงานช่างตัดเย็บ</h2>
                <div className='mt-8'>
                    <div className="flex gap-2 text-md justify-center mb-2">
                        <div>วันที่ :
                            <span className='underline underline-offset-4 font-medium'>ㅤ
                                {new Intl.DateTimeFormat('th-TH',
                                    {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    }
                                ).format(new Date(properties?.Date?.date?.start))}ㅤ
                            </span>
                        </div>
                        <div>ชื่อ/บริษัท : <span className='underline underline-offset-4 font-medium'>ㅤ{properties?.["ชื่อ/บริษัท"]?.title?.[0]?.text?.content}ㅤ</span></div>
                        <div className='flex gap-2'>ชนิดงาน :
                            <input className='w-4 h-4 border' type="checkbox" checked={isCheckedTypeOfWork === "กางเกง"} readOnly /> กางเกง
                            <input className='w-4 h-4 border' type="checkbox" checked={isCheckedTypeOfWork === "ปัก"} readOnly /> ปัก
                            <input className='w-4 h-4 border' type="checkbox" checked={isCheckedTypeOfWork === "เสื้อ/แซ็ก/กระโปรง"} readOnly /> เสื้อ/แซ็ก/กระโปรง
                        </div>
                    </div>
                    <div className="flex gap-2 text-md justify-center mb-2">
                        <div className='flex gap-2'>รหัสเช็ต : <span className='underline underline-offset-4 font-medium'> {properties?.["รหัสเซ็ต"]?.rich_text[0]?.text?.content}</span></div>
                        <div className='flex gap-2'>รหัสแพทเทิร์น : <span className='underline underline-offset-4 font-medium'>{properties?.["รหัสแพทเทิร์น"]?.rich_text[0]?.text?.content}</span></div>
                        <div className='flex gap-2'>รหัสสินค้า : <span className='underline underline-offset-4 font-medium'>{properties?.["รหัสสินค้า"]?.rich_text[0]?.text?.content}</span></div>
                        <div className='flex gap-2'>เลขล็อต : <span className='underline underline-offset-4 font-medium'>{properties?.["เลขล็อต"]?.rich_text[0]?.text?.content}</span></div>
                        <div className='flex gap-2'>จำนวน : <span className='underline underline-offset-4 font-medium'>{properties?.["จำนวน"]?.rich_text[0]?.text?.content}</span></div>
                    </div>
                    <div className="flex gap-2 text-md justify-center mb-2">
                        <div className='flex gap-2'>วันที่รับงาน :
                            <span className='underline underline-offset-4 font-medium'>
                                {new Intl.DateTimeFormat('th-TH',
                                    {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    }
                                ).format(new Date(properties?.["วันที่รับงาน"]?.date?.start))}
                            </span>
                        </div>
                        <div className='flex gap-2'>วันที่นัดส่งงาน :
                            <span className='underline underline-offset-4 font-medium'>
                                {new Intl.DateTimeFormat('th-TH',
                                    {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    }
                                ).format(new Date(properties?.["วันที่นัดส่งงาน"]?.date?.start))}
                            </span>
                        </div>
                        <div className='flex gap-2'>แยกบิลที่ : <span className='underline underline-offset-4 font-medium'>{properties?.["แยกบิลที่"]?.rich_text[0]?.text?.content}</span></div>
                        <div className='flex gap-2'>ผู้เขียนบิล : <span className='underline underline-offset-4 font-medium'>{properties?.["ผู้เขียนบิล"]?.rich_text[0]?.text?.content}</span></div>
                    </div>
                </div>
                <div className='mt-5'>
                    <div className='border w-full flex justify-center font-bold'>
                        <h2>รูปแบบ</h2>
                    </div>
                </div>
                <div>
                    <div className='grid'>
                        <div className={`w-full grid gap-4 justify-items-center content-center border p-4 border-t-0 ${files.length === 1 ? 'grid-cols-1' : files.length <= 2 ? 'grid-cols-2' : files.length <= 3 ? 'grid-cols-3' : files.length <= 4 ? 'grid-cols-4' : 'grid-cols-5'}`}>
                            {files.length > 0 ? (
                                files.map((file, index) => (
                                    <img
                                        key={index}
                                        className={`${files.length === 1 ? 'w-full h-44' : 'w-56 h-38'} object-contain`}
                                        src={file.external?.url ?? file.file?.url}
                                        alt={file.name}
                                    />
                                ))
                            ) : (
                                <p>ไม่มีรูปภาพ</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className='border w-full flex justify-center border-t-0 font-bold'>
                    <h2>รายละเอียด</h2>
                </div>
                <div className='p-2 border border-y-0 text-[14.5px] grid gap-2'>
                    <div className='flex gap-2 justify-center mt-2'>ประเภท
                        <input className='w-4 h-4 border' type="checkbox" checked={isCheckedType === "ล็อต" ? true : false} readOnly /> ล็อต
                        <input className='w-4 h-4 border' type="checkbox" checked={isCheckedType === "ออเดอร์" ? true : false} readOnly /> ออเดอร์
                        <input className='w-4 h-4 border' type="checkbox" checked={isCheckedType === "ตัวอย่าง" ? true : false} readOnly /> ตัวอย่าง
                        <input className='w-4 h-4 border' type="checkbox" checked={isCheckedType === "รายตัว" ? true : false} readOnly /> รายตัว
                        <div>ชนิดผ้า : <span className='underline underline-offset-4 font-medium'>ㅤㅤ{properties?.["ชนิดผ้า"]?.rich_text[0]?.text?.content}ㅤㅤ</span></div>
                        <div>ห้าง : <span className='underline font-medium underline-offset-4'>ㅤㅤ{properties?.["ห้าง"]?.rich_text[0]?.text?.content}ㅤㅤ</span></div>
                    </div>
                    <div>
                        <div className='flex gap-4 justify-center mb-4 '>
                            <div>ซ่อม : <span className="inline-flex justify-center items-center w-[4ch] border-b border-black font-medium text-center">{properties?.["ซ่อม"]?.rich_text[0]?.text?.content || "\u00A0"}</span> ตัว</div>
                            <div>ผ่าน : <span className="inline-flex justify-center items-center w-[4ch] border-b border-black font-medium text-center">{properties?.["ผ่าน"]?.rich_text[0]?.text?.content || "\u00A0"}</span> ตัว</div>
                            <div>คงค้าง : <span className="inline-flex justify-center items-center w-[4ch] border-b border-black font-medium text-center">{properties?.["คงค้าง"]?.rich_text[0]?.text?.content || "\u00A0"}</span> ตัว</div>
                            <p className='relative'>เซ็นต์ส่งงาน : <span className='border-b border-black'>ㅤㅤㅤㅤㅤ</span><img className='absolute -top-2 left-20 h-14' src={properties?.["เซ็นต์ส่งงาน"]?.files[0]?.external?.url || ""} alt={properties?.["เซ็นต์ส่งงาน"]?.files[0]?.name || ""} /></p>
                            <p className='relative'>เซ็นต์รับงาน : <span className='border-b border-black'>ㅤㅤㅤㅤㅤ</span><img className='absolute -top-2 left-20 h-14' src={properties?.["เซ็นต์รับงาน"]?.files[0]?.external?.url || ""} alt={properties?.["เซ็นต์รับงาน"]?.files[0]?.name || ""} /></p>
                        </div>
                    </div>
                </div>
                <div>
                    <table className="border-collapse border text-center w-full text-[12px]">
                        <thead>
                            <tr>
                                {tableData.map((data, index) => (
                                    <React.Fragment key={index}>
                                        <th className="border p-2" colSpan="3">รหัสสีที่ ({index + 1})</th>
                                    </React.Fragment>
                                ))}
                            </tr>
                            <tr>
                                {tableData.map((_, index) => (
                                    <React.Fragment key={index}>
                                        <th className="border p-2">รหัสสี</th>
                                        <th className="border p-2">ไซส์</th>
                                        <th className="border p-2">จำนวน</th>
                                    </React.Fragment>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: maxRows }).map((_, rowIndex) => (
                                <tr key={rowIndex}>
                                    {tableData.map((data, colIndex) => (
                                        <React.Fragment key={colIndex}>
                                            {/* แสดงรหัสสีแค่ครั้งเดียวใน row แรกของแต่ละ column */}
                                            {rowIndex === 0 ? (
                                                <td className="border p-2" rowSpan={maxRows}>
                                                    {data.code}
                                                </td>
                                            ) : null}
                                            {/* ถ้า rowIndex มีข้อมูลให้แสดง ถ้าไม่มีให้เว้นช่องว่าง */}
                                            <td className="border p-2">{data.sizes[rowIndex]?.[0] ?? ""}</td>
                                            <td className="border p-2">{data.sizes[rowIndex]?.[1] ?? ""}</td>
                                        </React.Fragment>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className='justify-center mt-5'>
                    <div>รายละเอียดราคา : <span className='underline font-medium underline-offset-4'>ㅤㅤㅤ{properties?.["รายละเอียดราคา"]?.rich_text[0]?.text?.content}ㅤㅤㅤ</span></div>
                    <div className="mt-2 flex gap-2">
                        <div>การชำระเงิน: ราคา/ตัว <span className='underline font-medium underline-offset-4'>ㅤ{properties?.["การชำระเงิน(ราคา/ตัว)"]?.rich_text[0]?.text?.content}ㅤ</span> </div>
                        <div>ตัว รวมจำนวน <span className='underline font-medium underline-offset-4'>ㅤ{properties?.["รวมจำนวน(ตัว)"]?.rich_text[0]?.text?.content}ㅤ</span> </div>
                        <div>ตัว ยอดเงินรวม <span className='underline font-medium underline-offset-4'>ㅤ{properties?.["ยอดเงินรวม"]?.rich_text[0]?.text?.content}ㅤ</span></div>
                    </div>
                    <div className="mt-2 flex gap-2">
                        <div>วันที่วางบิล:
                            <span className='underline font-medium underline-offset-4'>ㅤ
                                {new Intl.DateTimeFormat('th-TH',
                                    {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    }
                                ).format(new Date(properties?.["วันที่วางบิล"]?.date?.start))}ㅤ
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="text-center flex flex-col gap-5 mb-6">
                <Signature
                    requesterTitle="ผู้อนุมัติ(จ่ายงาน)"
                    requesterId={properties?.["ผู้อนุมัติ(จ่ายงาน)"]?.files?.[0]?.external?.url || ""}
                    namerequesterId={properties?.["ชื่อผู้อนุมัติ(จ่ายงาน)"]?.rich_text?.[0]?.text?.content || "\u00A0".repeat(40)}
                    altrequesterId={properties?.["ผู้อนุมัติ(จ่ายงาน)"]?.files[0]?.name}
                    daterequesterId={properties?.["วันที่เซ็นอนุมัติ(จ่ายงาน)"]?.date?.start}
                    approverTitle="ผู้อนุมัติ(จ่ายเงิน)"
                    approverId={properties?.["ผู้อนุมัติ(จ่ายเงิน)"]?.files[0]?.external?.url || ""}
                    nameapproverId={properties?.["ชื่อผู้อนุมัติ(จ่ายเงิน)"]?.rich_text?.[0]?.text?.content || "\u00A0".repeat(40)}
                    altapproverId={properties?.["ผู้อนุมัติ(จ่ายเงิน)"]?.files[0]?.name}
                    dateapproverId={properties["วันที่เซ็นอนุมัติ(จ่ายเงิน)"]?.date?.start}
                    left={"left-32"}
                />
                <div>
                    หมายเหตุ: <span>ทางบริษัทจะชำระเงินให้กับช่างในกรณีที่มีการส่งมอบสินค้าเรียบร้อยครบตามใบจ่ายงานช่างเย็บ</span>
                </div>
            </div>
        </>
    )
}

export default SewingOrderForm
