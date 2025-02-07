import React, { useState, useEffect } from 'react'

function ExpenseRequest({ properties, title }) {

  const [listContent, setListContent] = useState("");
  const [list, setList] = useState();
  const [amountContent, setAmountContent] = useState("");
  const [amount, setAmount] = useState();
  const [unitPriceContent, setUnitPriceContent] = useState("");
  const [unitPrice, setUnitPrice] = useState();
  const [quantityContent, setQuantityContent] = useState("");
  const [quantity, setQuantity] = useState();
  const [expenses, setExpenses] = useState();

  useEffect(() => {
    setListContent(properties?.["รายการ"]?.rich_text[0]?.text?.content);
    setAmountContent(properties?.["จำนวนเงิน"]?.rich_text[0]?.text?.content);
    setUnitPriceContent(properties?.["ราคา/หน่วย"]?.rich_text[0]?.text?.content);
    setQuantityContent(properties?.["จำนวน"]?.rich_text[0]?.text?.content);
  }, [properties])

  function splitContentToArray(content) {
    if (!content) return [];
    return content.split(",").map(item => item.trim()).filter(item => item !== "");
  }

  splitContentToArray(listContent, amountContent, unitPriceContent, quantityContent);

  function splitAndConvertToNumber(content) {
    if (!content) return [];
    return content
      .split(",")
      .map(item => parseFloat(item.trim()))
      .filter(item => !isNaN(item));
  }

  splitAndConvertToNumber(amountContent, unitPriceContent, quantityContent);

  useEffect(() => {
    const listResult = splitContentToArray(listContent);
    setList(listResult);

    const amountResult = splitAndConvertToNumber(amountContent);
    setAmount(amountResult);

    const unitPriceResult = splitAndConvertToNumber(unitPriceContent);
    setUnitPrice(unitPriceResult);

    const quantityResult = splitAndConvertToNumber(quantityContent);
    setQuantity(quantityResult);

  }, [listContent, amountContent, unitPriceContent, quantityContent]);

  useEffect(() => {
    if (list && quantity && unitPrice && amount) {
      const combinedArray = list.map((item, index) => ({
        id: index + 1,
        item,
        quantity: quantity[index],
        price: unitPrice[index],
        amount: amount[index]
      }));

      setExpenses(combinedArray);
    } else {
      console.log('Some data is missing');
    }
  }, [list, quantity, unitPrice, amount]);

  const test = [
    {
      name: 'อำภา สง่าศักดิ์กำพล',
      Approver: 'สรวิศ สง่าศักดิ์กำพล'
    }
  ];

  return (
    <>
      <div>
        <div className='text-center mt-10'>
          <h2 className="font-bold text-4xl">{title}</h2>
        </div>
        <p className="my-10">วันที่: 4 พฤศจิกายน 2567</p>
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
                <td className="border custom-border p-2 text-center">{expense?.price}</td>
                <td className="border custom-border p-2 text-right">{expense?.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-14 text-right grid gap-2">
          <p className="text-lg font-bold">รวมทั้งสิ้น: {properties?.["รวมเป็นเงิน(ตัวเลข)"]?.rich_text[0]?.text?.content} บาท</p>
          <p className="text-lg">{properties?.["รวมเป็นเงิน(ตัวอักษร)"]?.rich_text[0]?.text?.content}</p>
        </div>
      </div>
      <div className='flex justify-between px-5 mb-20'>
        <div className='text-center grid gap-2'>
          <p className="font-bold">ผู้ขอเบิก: <span className='font-medium underline decoration-dotted underline-offset-4 decoration-1.5'>ㅤ{test[0]?.name}ㅤ</span></p>
          <p>(ลงวันที่ 4 พฤศจิกายน 2567)</p>
        </div>
        <div className='text-center grid gap-2'>
          <p className="font-bold">ผู้อนุมัติ: <span className='font-medium underline decoration-dotted underline-offset-4 decoration-1.5'>ㅤ{test[0]?.Approver}ㅤ</span></p>
          <p>(ลงวันที่ 4 พฤศจิกายน 2567)</p>
        </div>
      </div>
    </>
  )
}

export default ExpenseRequest
