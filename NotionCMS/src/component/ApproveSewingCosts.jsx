import React from 'react'
import { FaPrint } from "react-icons/fa6";
import Navigation from './Navigation';

function ApproveSewingCosts() {

    const printRef = React.useRef(null);

    const handlePrint = () => {
        window.print();  // ฟังก์ชันที่จะทำให้หน้าปัจจุบันถูกพิมพ์
    };

    const data = [
        {
            patternCode: "1BXYX",
            orderNumber: "63967",
            pricePerPiece: 50,
            productionAmount: 100,
            passedAmount: 75,
            seamstressName: "อริสลา",
            notes: "ตัด QC",
            date: "2025-01-10"
        },
        {
            patternCode: "X2JA",
            orderNumber: "27445",
            pricePerPiece: 125,
            productionAmount: 25,
            passedAmount: 45,
            seamstressName: "สมชัย",
            notes: "งานซ่อม",
            date: "2025-01-10"
        },
        {
            patternCode: "M2X1",
            orderNumber: "24195",
            pricePerPiece: 299,
            productionAmount: 25,
            passedAmount: 25,
            seamstressName: "สมปอง",
            notes: "งานซ่อม",
            date: "2025-01-10"
        },
        {
            patternCode: "XOK1",
            orderNumber: "21551",
            pricePerPiece: 287,
            productionAmount: 25,
            passedAmount: 21,
            seamstressName: "ปราการณ์",
            notes: "งานซ่อม",
            date: "2025-01-10"
        },
        {
            patternCode: "IOK2",
            orderNumber: "23115",
            pricePerPiece: 127,
            productionAmount: 15,
            passedAmount: 26,
            seamstressName: "เดชรัฐ",
            notes: "งานซ่อม",
            date: "2025-01-10"
        },
        {
            patternCode: "ZZA1",
            orderNumber: "23958",
            pricePerPiece: 324,
            productionAmount: 85,
            passedAmount: 55,
            seamstressName: "บุญชัย",
            notes: "งานซ่อม",
            date: "2025-01-10"
        },
    ];

    return (
        <>
            <Navigation />
            <button onClick={handlePrint} className='text-4xl fixed right-30 bottom-10 text-blue-400 hover:text-blue-500 print:hidden'><FaPrint /></button>
            <section style={{ fontFamily: 'IBM Plex Sans Thai, serif' }} className='container max-w-full'>
                <div ref={printRef} className='mx-auto rouded-lg w-[210mm] h-[297mm] px-6 border flex flex-col justify-between'>
                    <div>
                        <div className='flex justify-center'>
                            <div className='grid content-center mt-10'>
                                <h3 className='font-bold text-4xl'>ใบขออนุมัติจ่ายค่าจ้างตัดเย็บสินค้าช่างนอก</h3>
                            </div>
                        </div>
                        <div className='mt-10 flex justify-end mr-2'>
                            <p className='relative'>วันที่ : ....<span className='absolute -top-1'>{data[0].date}</span>............................</p>
                        </div>
                        <div>
                            <table className="min-w-full border-collapse border mt-10">
                                <thead>
                                    <tr className="colorGreen">
                                        <th className="border p-2">ลำดับ</th>
                                        <th className="border p-2">รหัส<br />แพทเทิร์น</th>
                                        <th className="border p-2">เลขล๊อต</th>
                                        <th className="border p-2">ราคาจ้าง<br />ต่อตัว</th>
                                        <th className="border p-2">จำนวน<br />ผลิต</th>
                                        <th className="border p-2">จำนวนตัวที่<br />ตรวจผ่าน</th>
                                        <th className="border p-2">ชื่อช่าง</th>
                                        <th className="border p-2">หมายเหตุ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item, index) => (
                                        <tr key={index}>
                                            <td className="border px-4 p-2 text-center">{index + 1}</td>
                                            <td className="border px-4 p-2">{item.patternCode}</td>
                                            <td className="border px-4 p-2">{item.orderNumber}</td>
                                            <td className="border px-4 p-2 text-center">{item.pricePerPiece}</td>
                                            <td className="border px-4 p-2 text-center">{item.productionAmount}</td>
                                            <td className="border px-4 p-2 text-center">{item.passedAmount}</td>
                                            <td className="border px-4 p-2">{item.seamstressName}</td>
                                            <td className="border px-4 p-2">{item.notes}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 text-center mb-20'>
                        <div>
                            <p>ผู้ทบทวน : ................................</p>
                            <p className='relative'>วันที่ : ....<span className='absolute -top-1'>{data[0].date}</span>............................</p>
                        </div>
                        <div>
                            <p>ผู้อนุมัติ : ................................</p>
                            <p className='relative'>วันที่ : ....<span className='absolute -top-1'>{data[0].date}</span>............................</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default ApproveSewingCosts
