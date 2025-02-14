import React, { useState, useEffect } from 'react'
import toThaiBahtText from "thai-baht-text";

function ExpenseRequest({ properties, title }) {

  const [listContent, setListContent] = useState("");
  const [list, setList] = useState();
  const [unitPriceContent, setUnitPriceContent] = useState("");
  const [unitPrice, setUnitPrice] = useState();
  const [quantityContent, setQuantityContent] = useState("");
  const [quantity, setQuantity] = useState();
  const [expenses, setExpenses] = useState([]);
  const [sumTotal, setSumTotal] = useState(0);
  const [thaiNumber, setThaiNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setListContent(properties?.["รายการ"]?.rich_text[0]?.text?.content);
    setUnitPriceContent(properties?.["ราคา/หน่วย"]?.rich_text[0]?.text?.content);
    setQuantityContent(properties?.["จำนวน"]?.rich_text[0]?.text?.content);
  }, [properties])

  function splitContentToArray(content) {
    if (!content) return [];
    return content.split(",").map(item => item.trim()).filter(item => item !== "");
  }

  splitContentToArray(listContent, unitPriceContent, quantityContent);

  function splitAndConvertToNumber(content) {
    if (!content) return [];
    return content
      .split(",")
      .map(item => parseFloat(item.trim()))
      .filter(item => !isNaN(item));
  }

  splitAndConvertToNumber(unitPriceContent, quantityContent);

  useEffect(() => {
    const listResult = splitContentToArray(listContent) ?? [];
    const unitPriceResult = splitAndConvertToNumber(unitPriceContent) ?? [];
    const quantityResult = splitAndConvertToNumber(quantityContent) ?? [];

    const maxLength = Math.max(listResult.length, unitPriceResult.length, quantityResult.length);

    if (maxLength === 0) {
      setErrorMessage("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      setList([]);
      setUnitPrice([]);
      setQuantity([]);
      return;
    }

    if (listResult.length !== maxLength || unitPriceResult.length !== maxLength || quantityResult.length !== maxLength) {
      setErrorMessage("ข้อมูลบางส่วนไม่ครบหรือจำนวนไม่ตรงกัน");
      setList([]);
      setUnitPrice([]);
      setQuantity([]);
      return;
    }

    setErrorMessage(""); // เคลียร์ข้อความ error ถ้าข้อมูลถูกต้อง

    const normalizedList = Array.from({ length: maxLength }, (_, i) => listResult[i] ?? "ไม่มีข้อมูล");
    const normalizedUnitPrice = Array.from({ length: maxLength }, (_, i) => unitPriceResult[i] ?? 0);
    const normalizedQuantity = Array.from({ length: maxLength }, (_, i) => quantityResult[i] ?? 0);

    setList(normalizedList);
    setUnitPrice(normalizedUnitPrice);
    setQuantity(normalizedQuantity);

  }, [listContent, unitPriceContent, quantityContent]);

  useEffect(() => {
    try {
      if (!list?.length || !quantity?.length || !unitPrice?.length) {
        setExpenses([]);
        setSumTotal(0);
        setThaiNumber("");
        return;
      }

      const combinedArray = list.map((item, index) => {
        const qty = quantity[index] ?? 0;
        const price = unitPrice[index] ?? 0;
        const total = qty * price;

        return {
          id: index + 1,
          item,
          quantity: qty,
          price: price,
          total,
        };
      });

      setExpenses(combinedArray);

      const totalSum = combinedArray.reduce((sum, entry) => sum + entry.total, 0);
      setSumTotal(totalSum);

      setThaiNumber(toThaiBahtText(totalSum));

    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการคำนวณ", error);
    }
  }, [list, quantity, unitPrice]);

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
            {expenses?.map((expense) => (
              <tr key={expense.id} className="border custom-border">
                <td className="border custom-border p-2 text-center">{expense?.id}</td>
                <td className="border custom-border p-2">{expense?.item}</td>
                <td className="border custom-border p-2 text-center">{expense?.quantity}</td>
                <td className="border custom-border p-2 text-center">{expense?.price.toLocaleString()}</td>
                <td className="border custom-border p-2 text-right">{expense?.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {errorMessage && <span className="text-red-500 text-md mt-10 block">{errorMessage}</span>}
        <div className="mt-14 text-right grid gap-2">
          <p className="text-lg font-bold">รวมทั้งสิ้น: {sumTotal.toLocaleString()} บาท</p>
          <p className="text-lg">{thaiNumber}</p>
        </div>
        <div className='mt-4 flex gap-2'>
          หมายเหตุ : <p>{properties?.["หมายเหตุ"]?.rich_text[0]?.text?.content}</p>
        </div>
      </div>
      <div className='flex justify-between px-5 mb-20'>
        <div className='text-center grid gap-2'>
          <p className='relative'>ผู้ขอเบิก : ............................................<img className='absolute -top-12 h-24 left-18' src={properties?.["ผู้ขอเบิก"]?.files[0]?.external?.url} alt={properties?.["ผู้ขอเบิก"]?.files[0]?.name} /></p>
          <p>( {properties?.["ชื่อผู้ขอเบิก"]?.rich_text[0]?.text?.content} )</p>
          <p>วันที่ :
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
        </div>
        <div className='text-center grid gap-2'>
          <p className='relative'>ผู้อนุมัติ : ............................................<img className='absolute -top-12 h-24 left-18' src={properties?.["ผู้อนุมัติ"]?.files[0]?.external?.url} alt={properties?.["ผู้อนุมัติ"]?.files[0]?.name} /></p>
          <p>( {properties?.["ชื่อผู้อนุมัติ"]?.rich_text[0]?.text?.content} )</p>
          <p>วันที่ :
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
        </div>
      </div>
    </>
  )
}

export default ExpenseRequest
