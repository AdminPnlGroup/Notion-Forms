import React, { useState, useEffect } from 'react';
import toThaiBahtText from 'thai-baht-text';
import Signature from './Signature';

function ExpenseRequest({ properties, title, left, width, top }) {
  const [contents, setContents] = useState({
    list: '',
    quantity: '',
    unitPrice: '',
    amount: '',
  });

  const [data, setData] = useState([]);
  const [sumTotal, setSumTotal] = useState(0);
  const [thaiNumber, setThaiNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!properties) return;

    setContents({
      list: properties?.['รายการ']?.rich_text?.[0]?.text?.content || '',
      unitPrice: properties?.['ราคา/หน่วย']?.rich_text?.[0]?.text?.content || '',
      quantity: properties?.['จำนวน']?.rich_text?.[0]?.text?.content || '',
      amount: properties?.['จำนวนเงิน']?.rich_text?.[0]?.text?.content || '',
    });
  }, [properties]);

  useEffect(() => {
    if (!contents.list) return;

    const listArray = contents.list.split('\n').filter((item) => item.trim() !== '');
    const quantityArray = contents.quantity.split('\n').filter((item) => item.trim() !== '');
    const unitPriceArray = contents.unitPrice.split('\n').filter((item) => item.trim() !== '');
    const amountArray = contents.amount.split('\n').filter((item) => item.trim() !== '');

    const newData = listArray.map((item, index) => ({
      list: item,
      quantity: quantityArray[index] || '0',
      unitPrice: unitPriceArray[index] === "-" ? "-" : isNaN(parseFloat(unitPriceArray[index])) ? "-" : parseFloat(unitPriceArray[index]),
      amount: amountArray[index] === "-" ? "-" : isNaN(parseFloat(amountArray[index])) ? "-" : parseFloat(amountArray[index]),
    }));

    setData(newData);

    // คำนวณผลรวมของ amount
    const total = newData.reduce((sum, item) => {
      const amount = item.amount === "-" ? 0 : isNaN(item.amount) ? 0 : item.amount;
      return sum + amount;
    }, 0);
    setSumTotal(total);
    setThaiNumber(toThaiBahtText(total));
  }, [contents]);

  return (
    <>
      <div>
        <div className="text-center mt-10">
          <h2 className="font-bold text-4xl">{title}</h2>
        </div>
        <p className="my-10">
          วันที่:
          <span className="font-medium underline decoration-dotted underline-offset-4 decoration-1.5">
            ㅤ
            {properties?.Date?.date?.start
              ? new Intl.DateTimeFormat('th-TH', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              }).format(new Date(properties.Date.date.start))
              : 'ไม่ระบุวันที่'}
            ㅤ
          </span>
        </p>
        <table className="w-full border-collapse border custom-border">
          <thead>
            <tr className="colorGreen">
              <th className="border custom-border p-2">ลำดับ</th>
              <th className="border custom-border p-2">รายการ</th>
              <th className="border custom-border p-2">จำนวน</th>
              <th className="border custom-border p-2 w-30">ราคา/หน่วย</th>
              <th className="border custom-border p-2">จำนวนเงิน</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: Math.max(7, data?.length || 0) }).map((_, index) => {
              const item = data?.[index]; // ดึงข้อมูลจาก data ตาม index
              return (
                <tr key={index} className="border custom-border">
                  {/* แสดงลำดับที่ เริ่มจาก 1 */}
                  <td className="border custom-border p-2 text-center">{item ? index + 1 : 'ㅤ'}</td>
                  <td className="border custom-border p-2">{item?.list || ''}</td>
                  <td className="border custom-border p-2 text-center">{item?.quantity || ''}</td>
                  <td className="border custom-border p-2 text-center w-30">
                    {item?.unitPrice !== undefined && item?.unitPrice !== null
                      ? item.unitPrice.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                      : ''}
                  </td>
                  <td className="border custom-border p-2 text-right">
                    {item?.amount !== undefined && item?.amount !== null
                      ? item.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                      : ''}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {errorMessage && <span className="text-red-500 text-md mt-10 block">{errorMessage}</span>}
        <div className="mt-14 text-right grid gap-2">
          <p className="text-lg font-bold">
            รวมทั้งสิ้น: {sumTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท
          </p>
          <p className="text-lg font-bold">{thaiNumber}</p>
        </div>
        <div className="mt-4 flex gap-2">
          <p className="font-bold">หมายเหตุ : </p>
          <p>{properties?.['หมายเหตุ']?.rich_text[0]?.text?.content}</p>
        </div>
      </div>
      <div className="mb-20">
        <Signature
          requesterTitle="ผู้ขอเบิก"
          requesterId={properties?.["ผู้ขอเบิก"]?.files?.[0]?.external?.url || properties?.["ผู้ขอเบิก"]?.files[0]?.file?.url || ""}
          namerequesterId={properties?.['ชื่อผู้ขอเบิก']?.rich_text?.[0]?.text?.content || '\u00A0'.repeat(40)}
          altrequesterId={properties?.['ผู้ขอเบิก']?.files[0]?.name}
          daterequesterId={properties?.['วันที่เซ็นผู้ขอเบิก']?.date?.start}
          approverTitle="ผู้อนุมัติ"
          approverId={properties?.["ผู้อนุมัติ"]?.files[0]?.external?.url || properties?.["ผู้อนุมัติ"]?.files[0]?.file?.url || ""}
          nameapproverId={properties?.['ชื่อผู้อนุมัติ']?.rich_text?.[0]?.text?.content || '\u00A0'.repeat(40)}
          altapproverId={properties?.['ผู้อนุมัติ']?.files[0]?.name}
          dateapproverId={properties?.['วันที่เซ็นผู้อนุมัติ']?.date?.start}
          left={left}
          width={width}
          top={top}
        />
      </div>
    </>
  );
}

export default ExpenseRequest;