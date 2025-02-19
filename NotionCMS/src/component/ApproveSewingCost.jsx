import React, { useState, useEffect } from 'react'
import Signature from './Signature';

function ApproveSewingCost({ properties }) {

    const [contents, setContents] = useState({
        patternCode: "",
        lotNumber: "",
        unitPrice: "",
        productionQuantity: "",
        passedQuantity: "",
        technicianName: "",
        comment: ""
    });

    const [data, setData] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!properties) return;

        setContents({
            patternCode: properties?.["รหัสแพทเทิร์น"]?.rich_text?.[0]?.text?.content || "",
            lotNumber: properties?.["เลขล็อต"]?.rich_text?.[0]?.text?.content || "",
            unitPrice: properties?.["ราคาจ้างต่อตัว"]?.rich_text?.[0]?.text?.content || "",
            productionQuantity: properties?.["จำนวนผลิต"]?.rich_text?.[0]?.text?.content || "",
            passedQuantity: properties?.["จำนวนตัวที่ ตรวจผ่าน"]?.rich_text?.[0]?.text?.content || "",
            technicianName: properties?.["ชื่อช่าง"]?.rich_text?.[0]?.text?.content || "",
            comment: properties?.["หมายเหตุ"]?.rich_text?.[0]?.text?.content || ""
        });
    }, [properties]);

    function splitContent(content) {
        return content ? content.split("\n").map(item => item.trim()).filter(item => item) : [];
    }

    useEffect(() => {
        const keys = Object.keys(contents);
        const results = keys.reduce((acc, key) => {
            acc[key] = splitContent(contents[key]);
            return acc;
        }, {});

        const maxLength = Math.max(...keys.map(key => results[key].length));

        if (maxLength === 0) {
            setErrorMessage("กรุณากรอกข้อมูลให้ครบทุกช่อง");
            setData([]);
            return;
        }

        const isValid = keys.every(key => results[key].length === maxLength);
        if (!isValid) {
            setErrorMessage("ข้อมูลบางส่วนไม่ครบหรือจำนวนไม่ตรงกัน");
            setData([]);
            return;
        }

        setErrorMessage("");
        setData(Array.from({ length: maxLength }, (_, i) => ({
            id: i + 1,
            patternCode: results.patternCode[i] || "ไม่มีข้อมูล",
            lotNumber: results.lotNumber[i] || "ไม่มีข้อมูล",
            unitPrice: results.unitPrice[i] || "ไม่มีข้อมูล",
            productionQuantity: results.productionQuantity[i] || "ไม่มีข้อมูล",
            passedQuantity: results.passedQuantity[i] || "ไม่มีข้อมูล",
            technicianName: results.technicianName[i] || "ไม่มีข้อมูล",
            comment: results.comment[i] || "ไม่มีข้อมูล"
        })));

    }, [contents]);

    return (
        <>
            <div>
                <div className='flex justify-center'>
                    <div className='grid content-center mt-10'>
                        <h3 className='font-bold text-4xl'>ใบขออนุมัติจ่ายค่าจ้างตัดเย็บสินค้าช่างนอก</h3>
                    </div>
                </div>
                <div className='mt-10 flex justify-end mr-2'>
                    <p className='relative'>วันที่ : ....<span className='absolute -top-1'>{properties?.["วันที่"]?.date?.start}</span>............................</p>
                </div>
                <div>
                    <table className="min-w-full border-collapse border mt-10">
                        <thead>
                            <tr className="colorGreen">
                                <th className="border p-2">ลำดับ</th>
                                <th className="border p-2">รหัส<br />แพทเทิร์น</th>
                                <th className="border p-2">เลขล็อต</th>
                                <th className="border p-2">ราคาจ้าง<br />ต่อตัว</th>
                                <th className="border p-2">จำนวน<br />ผลิต</th>
                                <th className="border p-2">จำนวนตัวที่<br />ตรวจผ่าน</th>
                                <th className="border p-2">ชื่อช่าง</th>
                                <th className="border p-2">หมายเหตุ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: Math.max(10, data.length) }).map((_, index) => {
                                const item = data[index]; // ดึงข้อมูลจาก data ตาม index
                                return (
                                    <tr key={index}>
                                        <td className="border px-4 p-2 text-center">{item ? index + 1 : "ㅤ"}</td>
                                        <td className="border px-4 p-2">{item?.patternCode || ""}</td>
                                        <td className="border px-4 p-2">{item?.lotNumber || ""}</td>
                                        <td className="border px-4 p-2 text-center">{item?.unitPrice || ""}</td>
                                        <td className="border px-4 p-2 text-center">{item?.productionQuantity || ""}</td>
                                        <td className="border px-4 p-2 text-center">{item?.passedQuantity || ""}</td>
                                        <td className="border px-4 p-2">{item?.technicianName || ""}</td>
                                        <td className="border px-4 p-2">{item?.comment || ""}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {errorMessage && <span className="text-red-500 text-md mt-10 block">{errorMessage}</span>}
            </div>
            <div className='mb-20'>
                <Signature
                    requesterTitle="ผู้ทบทวน"
                    requesterId={properties?.["ลายเซ็นผู้ทบทวน"]?.files[0]?.external?.url || ""}
                    namerequesterId={properties?.["ชื่อผู้ทบทวน"]?.rich_text?.[0]?.text?.content || "\u00A0".repeat(40)}
                    altrequesterId={properties?.["ลายเซ็นผู้ทบทวน"]?.files[0]?.name}
                    daterequesterId={properties?.["วันที่เซ็นชื่อผู้ทบทวน"]?.date?.start}
                    approverTitle="ผู้อนุมัติ"
                    approverId={properties?.["ลายเซ็นผู้อนุมัติ"]?.files[0]?.external?.url || ""}
                    nameapproverId={properties?.["ชื่อผู้อนุมัติ"]?.rich_text?.[0]?.text?.content || "\u00A0".repeat(40)}
                    altapproverId={properties?.["ลายเซ็นผู้อนุมัติ"]?.files[0]?.name}
                    dateapproverId={properties?.["วันที่เซ็นชื่อผู้อนุมัติ"]?.date?.start}
                />
            </div>
        </>
    )
}

export default ApproveSewingCost

