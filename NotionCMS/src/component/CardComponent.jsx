import React from "react";

function CardComponent({ data, setSelectedMonth, selectedBrand, index }) {
  return (
    <div className="grid grid-rows-[5%_90%_5%] h-full text-center">
      <div className="mt-5 relative">
        <p className="text-xl font-bold">
          {" "}
          สรุปแบบประจำเดือน{" "}
          <span className="text-red-500">{selectedBrand}</span>{" "}
          <span className="text-red-500">{setSelectedMonth}</span>
        </p>
        <p className="absolute top-0 right-0">{index}</p>
      </div>
      <div className="flex flex-col">
        <div className="grid grid-cols-3 gap-2">
          {data.map((item, index) => {
            return (
              <div key={index}>
                <li className="border border-gray-300 h-82 grid grid-rows-[60%_40%]  text-center p-1">
                  <div
                    className={`grid gap-2 p-2 ${
                      item.properties?.["ตุ๊กตา"]?.files.length === 2
                        ? "grid-cols-2"
                        : item.properties?.["ตุ๊กตา"]?.files.length === 3
                        ? "grid-cols-3"
                        : item.properties?.["ตุ๊กตา"]?.files.length === 4
                        ? "grid-cols-4"
                        : "grid-cols-1"
                    }`}
                  >
                    {item.properties?.["ตุ๊กตา"]?.files.length > 0 ? (
                      item.properties?.["ตุ๊กตา"]?.files.map(
                        (fileItem, index) => {
                          const fileUrl =
                            fileItem?.file?.url || fileItem?.external?.url;
                          const fileName = fileItem?.name;
                          return (
                            <div
                              key={index}
                              className="grid content-center justify-center"
                            >
                              {fileUrl ? (
                                <img
                                  src={fileUrl}
                                  alt={fileName}
                                  className="object-contain rounded h-36"
                                />
                              ) : (
                                <div className="flex items-center justify-center w-36 h-36 bg-gray-100 text-gray-400 rounded">
                                  No Image
                                </div>
                              )}
                            </div>
                          );
                        }
                      )
                    ) : (
                      <div className="flex items-center justify-center w-36 h-36 bg-gray-100 text-gray-400 rounded">
                        <p>No Image</p>
                      </div>
                    )}
                  </div>
                  <div className="border w-full border-gray-300 text-start p-1 relative text-xs ">
                    <div className="absolute -top-5 right-0">
                      {item.properties?.["ติดตามสถานะ"]?.formula?.string || ""}
                    </div>
                    <div>
                      <p className="font-bold mt-1">
                        รหัสเชต :{" "}
                        <span className="text-blue-800">
                          {item.properties?.["รหัสเซต"]?.title[0]?.plain_text}
                        </span>
                      </p>
                      <p className="font-bold mt-1 absolute top-1 left-28">
                        รหัสล๊อต :{" "}
                        <span className="text-blue-800">
                          {item.properties?.["รหัสล็อต"]?.rich_text[0]
                            ?.plain_text || "\u00A0".repeat(9)}
                        </span>
                      </p>
                    </div>
                    <p className="mt-1">
                      จำนวนประมาณ :{" "}
                      <span>
                        {item?.properties?.["จำนวนประมาณ"]?.rich_text[0]
                          ?.plain_text ?? ""}
                      </span>
                    </p>
                    <p className="mt-1 absolute -top-6">
                      วันรับงาน :{" "}
                      {item.properties?.["กำหนดรับงาน"]?.date?.start
                        ? new Intl.DateTimeFormat("th-TH", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }).format(
                            new Date(item.properties["กำหนดรับงาน"].date.start)
                          )
                        : "\u00A0".repeat(25)}
                    </p>
                    <p className="mt-1">
                      จำนวนผลิตจริง :{" "}
                      <span>
                        {item.properties?.["จำนวนผลิตจริง"]?.number ?? ""}
                      </span>
                    </p>
                    <div className="absolute bottom-1 left-1 right-0">
                      <div className="relative flex">
                        <p className="mt-1">
                          ทีมเย็บ :{" "}
                          <span className="underline">ㅤㅤㅤㅤㅤ</span>
                        </p>
                        <p className="mt-1 absolute right-2">
                          สถานะ : <span className="underline">ㅤㅤㅤㅤㅤ</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-2">
        <p className="text-sm">
          หมายเหตุ: 🟩สินค้าเข้าคลัง 🟦ยังไม่ถึงกำหนดวันรับ 🟨ล่าช้าเกิน3วัน
          🟥ล่าช้าเกิน7วัน
        </p>
      </div>
    </div>
  );
}

export default CardComponent;

// {item.properties?.["ติดตามสถานะ"]?.formula?.string || ""}
{
  /* <div className='text-start text-sm'>Note:</div> */
}

// ${array.length === 2 ? 'w-auto h-30' : array.length === 3 ? 'w-auto h-20' : array.length === 4 ? 'w-auto h-32' : "w-auto h-40"}
