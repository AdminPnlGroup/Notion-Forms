import React, { useState, useEffect } from 'react'
import Signature from './Signature';

function SewingOrderForm({ properties }) {

    const [isCheckedTypeOfWork, setIsCheckedTypeOfWork] = useState("");
    const [isCheckedType, setIsCheckedType] = useState("");
    const [files, setFiles] = useState([]);

    const handleChangeTypeOfWork = () => {
        setIsCheckedTypeOfWork(isCheckedTypeOfWork)
    };
    const handleChangeType = () => {
        setIsCheckedType(isCheckedType)
    };

    useEffect(() => {
        setIsCheckedTypeOfWork(properties?.["ชนิดงาน"]?.multi_select[0]?.name);
        setIsCheckedType(properties?.["ประเภท"]?.multi_select[0]?.name);

        if (properties?.["รูปแบบ(ตุ๊กตา)"]?.files) {
            setFiles(properties["รูปแบบ(ตุ๊กตา)"].files);
        }

    }, [properties])

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
                            <input className='w-4 h-4 border' type="checkbox" checked={isCheckedTypeOfWork === "กางเกง" ? true : false} onChange={handleChangeTypeOfWork} /> กางเกง
                            <input className='w-4 h-4 border' type="checkbox" checked={isCheckedTypeOfWork === "ปัก" ? true : false} onChange={handleChangeTypeOfWork} /> ปัก
                            <input className='w-4 h-4 border' type="checkbox" checked={isCheckedTypeOfWork === "เสื้อ/แซ็ก/กระโปรง" ? true : false} onChange={handleChangeTypeOfWork} /> เสื้อ/แจ็ก/กระโปรง</div>
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
                <div className='grid grid-cols-[40%_60%] mt-5'>
                    <div className='border w-full flex justify-center'>
                        <h2>รูปแบบ</h2>
                    </div>
                    <div className='border w-full flex justify-center'>
                        <h2>รายละเอียด</h2>
                    </div>
                </div>
                <div className='mt-5'>
                    <div className='grid grid-cols-[40%_60%]'>
                        <div className={`w-full grid gap-2 justify-items-center ${files.length === 1 ? 'grid-cols-1' : files.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                            {files.length > 0 ? (
                                files.map((file, index) => (
                                    <img
                                        key={index}
                                        className="w-56 h-34 object-contain"
                                        src={file.external?.url ?? file.file?.url}
                                        alt={file.name}
                                    />
                                ))
                            ) : (
                                <p>ไม่มีรูปภาพ</p>
                            )}
                        </div>
                        <div className='px-5 flex flex-col gap-5'>
                            <div className='flex justify-center'>
                                <div className='flex gap-2'>ประเภท
                                    <input className='w-4 h-4 border' type="checkbox" checked={isCheckedType === "ล็อต" ? true : false} onChange={handleChangeType} /> ล็อต
                                    <input className='w-4 h-4 border' type="checkbox" checked={isCheckedType === "ออเดอร์" ? true : false} onChange={handleChangeType} /> ออเดอร์
                                    <input className='w-4 h-4 border' type="checkbox" checked={isCheckedType === "ตัวอย่าง" ? true : false} onChange={handleChangeType} /> ตัวอย่าง
                                    <input className='w-4 h-4 border' type="checkbox" checked={isCheckedType === "รายตัว" ? true : false} onChange={handleChangeType} /> รายตัว
                                </div>
                            </div>
                            <div className='flex flex-col gap-2 px-5'>
                                <div className='flex gap-4'>
                                    <div>ชนิดผ้า <span className='underline underline-offset-4 font-medium'>ㅤ{properties?.["ชนิดผ้า"]?.rich_text[0]?.text?.content}ㅤ</span></div>
                                    <div>ห้าง <span className='underline font-medium underline-offset-4'>ㅤ{properties?.["ห้าง"]?.rich_text[0]?.text?.content}ㅤ</span></div>
                                </div>
                                <div className='flex gap-4'>
                                    <div>ไซต์/ตัว <span className='underline font-medium underline-offset-4'>ㅤㅤ{properties?.["ไซส์/ตัว (2)"]?.rich_text[0]?.text?.content}ㅤㅤ</span></div>
                                    <div>สี <span className='underline font-medium underline-offset-4'>ㅤ{properties?.["สี"]?.rich_text[0]?.text?.content}ㅤ</span></div>
                                </div>
                                <div className='flex gap-4'>
                                    <div>ไซต์/ตัว <span className='underline font-medium underline-offset-4'>ㅤㅤ{properties?.["ไซส์/ตัว (3)"]?.rich_text[0]?.text?.content}ㅤㅤ</span></div>
                                    <div>สี <span className='underline font-medium underline-offset-4'>ㅤㅤ{properties?.["สี (1)"]?.rich_text[0]?.text?.content}ㅤㅤ</span></div>
                                </div>
                                <div className='flex gap-4'>
                                    <div>อื่นๆ <span className='underline font-medium underline-offset-4'>ㅤㅤ{properties?.["อื่นๆ"]?.rich_text[0]?.text?.content}ㅤㅤ</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mt-5'>
                    <table className="w-full border-collapse border">
                        <thead>
                            <tr className="colorGreen text-sm">
                                <th className="border px-4 py-2">วัน/เดือน/ปี ส่ง</th>
                                <th className="border px-4 py-2">รายละเอียด</th>
                                <th className="border px-4 py-2">จำนวนส่ง</th>
                                <th className="border px-4 py-2">ซ่อม</th>
                                <th className="border px-4 py-2">ผ่าน</th>
                                <th className="border px-4 py-2">คงค้าง</th>
                                <th className="border px-4 py-2">เซ็นต์ส่งงาน</th>
                                <th className="border px-4 py-2">เซ็นต์รับงาน</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(4)].map((_, index) => (
                                <tr key={index}>
                                    <td className="border px-4 py-2 text-center">&nbsp;</td>
                                    <td className="border px-4 py-2">&nbsp;</td>
                                    <td className="border px-4 py-2 text-right">&nbsp;</td>
                                    <td className="border px-4 py-2 text-right">&nbsp;</td>
                                    <td className="border px-4 py-2 text-right">&nbsp;</td>
                                    <td className="border px-4 py-2 text-right">&nbsp;</td>
                                    <td className="border px-4 py-2">&nbsp;</td>
                                    <td className="border px-4 py-2">&nbsp;</td>
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
                />
                <div>
                    หมายเหตุ: <span>ทางบริษัทจะชำระเงินให้กับช่างในกรณีที่มีการส่งมอบสินค้าเรียบร้อยครบตามใบจ่ายงานช่างเย็บ</span>
                </div>
            </div>
        </>
    )
}

export default SewingOrderForm