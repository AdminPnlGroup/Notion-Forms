import React, { useState, useEffect } from 'react'
import toThaiBahtText from "thai-baht-text";
import Signature from './Signature';

function ExpenseRequest({ properties, title }) {

  const [contents, setContents] = useState({
    list: "",
    unitPrice: "",
    quantity: ""
  });

  const [data, setData] = useState([]);
  const [sumTotal, setSumTotal] = useState(0);
  const [thaiNumber, setThaiNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!properties) return;

    setContents({
      list: properties?.["รายการ"]?.rich_text?.[0]?.text?.content || "",
      unitPrice: properties?.["ราคา/หน่วย"]?.rich_text?.[0]?.text?.content || "",
      quantity: properties?.["จำนวน"]?.rich_text?.[0]?.text?.content || ""
    });
  }, [properties]);

  function splitContent(content, toNumber = false) {
    if (!content) return [];
    return content
      .split("\n")
      .map(item => toNumber ? parseFloat(item.trim()) : item.trim())
      .filter(item => toNumber ? !isNaN(item) : item);
  }

  useEffect(() => {
    const keys = Object.keys(contents);
    const results = keys.reduce((acc, key) => {
      acc[key] = splitContent(contents[key], key !== "list");
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
      item: results.list[i] || "ไม่มีข้อมูล",
      quantity: results.quantity[i] || 0,
      price: results.unitPrice[i] || 0,
      total: (results.quantity[i] || 0) * (results.unitPrice[i] || 0)
    })));

  }, [contents]);

  useEffect(() => {
    try {
      if (data.length === 0) {
        setSumTotal(0);
        setThaiNumber("");
        return;
      }

      const totalSum = data.reduce((sum, entry) => sum + entry.total, 0);
      setSumTotal(totalSum);
      setThaiNumber(toThaiBahtText(totalSum));

    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการคำนวณ", error);
    }
  }, [data]);

  return (
    <>
      <div>
        <div className='text-center mt-10'>
          <h2 className="font-bold text-4xl">{title}</h2>
        </div>
        <p className="my-10">วันที่:
          <span className='font-medium underline decoration-dotted underline-offset-4 decoration-1.5'>ㅤ
            {new Intl.DateTimeFormat('th-TH',
              {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              }
            ).format(new Date(properties?.Date?.date?.start))}ㅤ
          </span>
        </p>
        <table className="w-full border-collapse border custom-border">
          <thead>
            <tr className="colorGreen">
              <th className="border custom-border p-2">ลำดับ</th>
              <th className="border custom-border p-2">รายการ</th>
              <th className="border custom-border p-2">จำนวน</th>
              <th className="border custom-border p-2">ราคา/หน่วย</th>
              <th className="border custom-border p-2">จำนวนเงิน</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: Math.max(7, data?.length || 0) }).map((_, index) => {
              const item = data?.[index]; // ดึงข้อมูลจาก data ตาม index
              return (
                <tr key={index} className="border custom-border">
                  <td className="border custom-border p-2 text-center">{item ? item.id : "ㅤ"}</td>
                  <td className="border custom-border p-2">{item?.item || ""}</td>
                  <td className="border custom-border p-2 text-center">{item?.quantity || ""}</td>
                  <td className="border custom-border p-2 text-center">
                    {item?.price ? item.price.toLocaleString() : ""}
                  </td>
                  <td className="border custom-border p-2 text-right">
                    {item?.total ? item.total.toLocaleString() : ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {errorMessage && <span className="text-red-500 text-md mt-10 block">{errorMessage}</span>}
        <div className="mt-14 text-right grid gap-2">
          <p className="text-lg font-bold">รวมทั้งสิ้น: {sumTotal.toLocaleString()} บาท</p>
          <p className="text-lg font-bold">{thaiNumber}</p>
        </div>
        <div className='mt-4 flex gap-2'>
          <p className='font-bold'>หมายเหตุ : </p>
          <p>{properties?.["หมายเหตุ"]?.rich_text[0]?.text?.content}</p>
        </div>
      </div>
      <div className='mb-20'>
        <Signature
          requesterTitle="ผู้ขอเบิก"
          requesterId={properties?.["ผู้ขอเบิก"]?.files[0]?.external?.url || ""}
          namerequesterId={properties?.["ชื่อผู้ขอเบิก"]?.rich_text?.[0]?.text?.content || "\u00A0".repeat(40)}
          altrequesterId={properties?.["ผู้ขอเบิก"]?.files[0]?.name}
          daterequesterId={properties?.["วันที่เซ็นผู้ขอเบิก"]?.date?.start}
          approverTitle="ผู้อนุมัติ"
          approverId={properties?.["ผู้อนุมัติ"]?.files[0]?.external?.url || ""}
          nameapproverId={properties?.["ชื่อผู้อนุมัติ"]?.rich_text?.[0]?.text?.content || "\u00A0".repeat(40)}
          altapproverId={properties?.["ผู้อนุมัติ"]?.files[0]?.name}
          dateapproverId={properties?.["วันที่เซ็นผู้อนุมัติ"]?.date?.start}
          left={"left-18"}
        />
      </div>
    </>
  )
}

export default ExpenseRequest
