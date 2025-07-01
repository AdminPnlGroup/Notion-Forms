import React, { useState, useEffect } from 'react';
import Signature from './Signature';

function Quotation({ properties }) {
  const [isCheckedType, setIsCheckedType] = useState("");
  const [isTools, setTools] = useState("");
  const [files, setFiles] = useState([]);
  const [fabric, setFabric] = useState([]);

  const handleChangeTools = () => {
    setTools(isTools);
  };

  const handleChangeType = () => {
    setIsCheckedType(isCheckedType)
  };

  useEffect(() => {
    setIsCheckedType(properties?.["ประเภท"].multi_select[0]?.name);
    setTools(properties?.["อุปกรณ์"].multi_select[0]?.name);

    if (properties?.["ลายผ้า"]?.files) {
      setFiles(properties["ลายผ้า"].files);
    }

    if (properties?.["ตุ๊กตาและลายผ้า"]?.files) {
      setFabric(properties["ตุ๊กตาและลายผ้า"].files);
    }

  }, [properties])

  return (
    <>
      <div>
        <div className='flex justify-center'>
          <div className='max-w-xs mt-10 p-3 grid content-center'>
            <h3 className='font-bold text-4xl'>ใบเสนอราคา</h3>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-2 mt-10'>
          <div className='border'>
            <h4 className='font-bold border border-x-0 border-t-0 text-center'>รูปแบบแพทเทิร์น</h4>
            <div className={`p-4 grid gap-2 justify-items-center content-center mt-4 ${files.length === 1 ? 'grid-cols-1' : files.length <= 2 ? 'grid-cols-2' : files.length <= 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
              {files.length > 0 ? (
                files.map((file, index) => (
                  <img
                    key={index}
                    className={`h-48`} /* object-contain */
                    src={file.external?.url ?? file.file?.url}
                    alt={file.name}
                  />
                ))
              ) : (
                <p>ไม่มีรูปภาพ</p>
              )}
            </div>
          </div>
          <div className='grid ml-3 gap-4'>
            <div className='text-center'>
              <h4 className='font-bold mt-2 underline'>รายละเอียด</h4>
            </div>
            <div className='grid content-center mt-2'>
              <p>วันที่ :
                <span className='inline-flex w-[30ch] border-b border-black font-medium'>ㅤ
                  {new Intl.DateTimeFormat('th-TH',
                    {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    }
                  ).format(new Date(properties?.Date?.date?.start || "\u00A0"))}
                </span>
              </p>
            </div>
            <div className='grid content-center'>
              <p>เลขที่ล๊อต : <span className='inline-flex w-[26ch] border-b border-black font-medium'>ㅤ{properties?.["เลขที่ล็อต"]?.rich_text[0]?.plain_text || "\u00A0"}</span></p>
            </div>
            <div className='grid content-center'>
              <p>รหัสแพทเทิร์น : <span className='inline-flex w-[23ch] border-b border-black font-medium'>ㅤ{properties?.["รหัสแพทเทิร์น"]?.rich_text[0]?.plain_text || "\u00A0"}</span></p>
            </div>
            <div className='grid content-center'>
              <p>ชื่อ/บริษัท : <span className='inline-flex w-[26ch] border-b border-black font-medium'>ㅤ{properties?.["ชื่อ/บริษัท"]?.rich_text[0]?.plain_text || "\u00A0"}</span></p>
            </div>
            <div className='grid content-center'>
              <p>สรุปราคาตัวอย่าง : <span className='inline-flex w-[17ch] border-b border-black font-medium'>ㅤ{properties?.["สรุปราคาตัวอย่าง"]?.rich_text[0]?.plain_text || "\u00A0"}</span> บาท</p>
            </div>
            <div className='grid content-center'>
              <p>สรุปราคาผลิต : <span className='inline-flex w-[20ch] border-b border-black font-medium'>ㅤ{properties?.["สรุปราคาผลิต"]?.rich_text[0]?.plain_text || "\u00A0"}</span> บาท</p>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-2'>
          <div className='text-center border border-t-0'>
            <h4 className='font-bold border border-t-0 border-x-0'>รูปแบบ</h4>
            <div className='h-54 flex justify-center my-2'>
              {/* <img className='object-scale-down' src={properties?.["Clothing Styles And Fabric Pattern"]?.files[0]?.external?.url} alt={properties?.["Clothing Styles And Fabric Pattern"]?.files[0]?.name} /> */}
              {fabric.length > 0 ? (
                fabric.map((file, index) => (
                  <img
                    key={index}
                    className={`${files.length === 1 ? 'w-full h-44 mt-5' : 'w-48 h-38 mt-5'} object-contain`}
                    src={file.external?.url ?? file.file?.url}
                    alt={file.name}
                  />
                ))
              ) : (
                <p>ไม่มีรูปภาพ</p>
              )}
            </div>
          </div>
          <div className='text-center'>
            <h4 className='font-bold mt-6 underline'>แผนก SubContract</h4>
            <div className='mt-6'>
              <div className='grid grid-cols-5'>
                <h4>ประเภท</h4>
                <input type="checkbox" checked={isCheckedType === "รายตัว" ? true : false} onChange={handleChangeType} />
                <p>รายตัว</p>
                <input type="checkbox" checked={isCheckedType === "ปัก" ? true : false} onChange={handleChangeType} />
                <p>ปัก</p>
              </div>
              <div className='grid grid-cols-5 mt-5'>
                <h4>อุปกรณ์</h4>
                <input type="checkbox" checked={isTools === "บริษัท" ? true : false} onChange={handleChangeTools} />
                <p>บริษัท</p>
                <input type="checkbox" checked={isTools === "ข้างนอก" ? true : false} onChange={handleChangeTools} />
                <p>ข้างนอก</p>
              </div>
            </div>
            <div className='flex mt-5 ml-5'>
              <div className='justify-items-start grid gap-4'>
                <p>จำนวน <span className='underline underline-offset-4'>ㅤㅤㅤㅤㅤ<span className='font-medium'>{properties?.["จำนวน"]?.rich_text[0]?.plain_text}</span>ㅤㅤㅤㅤㅤㅤㅤ</span> ตัว</p>
                <p>เสนอราคาตัวอย่าง <span className='underline underline-offset-4'>ㅤㅤㅤ<span className='font-medium'>{properties?.["เสนอราคาตัวอย่าง"]?.rich_text[0]?.plain_text}</span>ㅤㅤㅤㅤㅤㅤ</span> บาท</p>
                <p>เสนอราคาผลิต <span className='underline underline-offset-4'>ㅤㅤㅤㅤ<span className='font-medium'>{properties?.["เสนอราคาผลิต"]?.rich_text[0]?.plain_text}</span>ㅤㅤㅤㅤㅤㅤ</span> บาท</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="mt-10 flex gap-2">
            <p className="font-bold">ความคิดเห็นเพิ่มเติม : <span className='font-normal'>{properties?.["ความคิดเห็นเพิ่มเติม"]?.rich_text[0]?.plain_text || "\u00A0"}</span></p> 
          </div>
        </div>
      </div>
      <div className='mb-20'>
        <Signature
          requesterTitle="ผู้ทบทวน"
          requesterId={properties?.["ผู้ทบทวน"]?.files[0]?.external?.url || properties?.["ผู้ทบทวน"]?.files[0]?.file?.url || ""}
          namerequesterId={properties?.["ชื่อผู้ทบทวน"]?.rich_text?.[0]?.text?.content || "\u00A0".repeat(40)}
          altrequesterId={properties?.["ผู้ทบทวน"]?.files[0]?.name}
          daterequesterId={properties?.["วันที่เซ็นผู้ทบทวน"]?.date?.start}
          approverTitle="ผู้อนุมัติ"
          approverId={properties?.["ผู้อนุมัติ"]?.files[0]?.external?.url || properties?.["ผู้อนุมัติ"]?.files[0]?.file?.url || ""}
          nameapproverId={properties?.["ชื่อผู้อนุมัติ"]?.rich_text?.[0]?.text?.content || "\u00A0".repeat(40)}
          altapproverId={properties?.["ผู้อนุมัติ"]?.files[0]?.name}
          dateapproverId={properties?.["วันที่เซ็นผู้อนุมัติ"]?.date?.start}
          left={"left-20"}
          width={"w-36"}
          top={`-top-18`}
        />
      </div>
    </>
  )
}

export default Quotation


