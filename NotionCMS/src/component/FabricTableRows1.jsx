import React from "react";

function FabricTableRows1({ data, groupTotals }) {
  const groupedByFabricCode = data.reduce((groups, item) => {
    const code =
      item.properties?.["รหัสสี (Fabric Color Code) Mirror"]?.formula?.string ||
      "ไม่ทราบรหัส";
    if (!groups[code]) {
      groups[code] = [];
    }
    groups[code].push(item);
    return groups;
  }, {});

  const processedData = Object.entries(groupedByFabricCode).map(
    ([code, items]) => {
      return {
        code: code,
        items: items, // ✨ ใช้ items ที่รับมาโดยตรงได้เลย
        total: groupTotals[code] || 0,
        rowCount: items.length, // ✨ ใช้ items.length โดยตรง
      };
    }
  );

  const HEADER_FULL_BORDER_CLASS = "border border-black";
  const CELL_VERTICAL_BORDERS_CLASS = "border-l border-r border-black";
  const GROUP_BOTTOM_BORDER_CLASS = "border-b border-black";
  const NO_INTERNAL_BOTTOM_BORDER_CLASS = "border-b-0";

  const firstItem = data[0];
  const brandCode =
    firstItem?.properties?.["รหัสสี (Fabric Color Code) Mirror"]?.formula
      ?.string || "";
  const supplier =
    firstItem?.properties?.["Supplier (mirror)"]?.rollup?.array?.[0]?.title?.[0]
      ?.plain_text || "";
  const typeOfFabric =
    firstItem?.properties?.["ชนิดผ้า (Type of Fabric)"]?.multi_select?.[0]
      ?.name || "";
  const supplierCode =
    firstItem?.properties?.["รหัสร้านค้า (Supplier Code)"]?.rich_text?.[0]
      ?.plain_text || "ไม่มีข้อมูล";
  const surface =
    firstItem?.properties?.["หน้าผ้า (fabric surface)"]?.rollup?.array?.[0]
      ?.number || null;
  const pricePerYard =
    firstItem?.properties?.["ราคา ต่อ หลา (Price per Yard)"]?.number || 0;
  const receivedDate =
    firstItem?.properties?.["วันที่รับ (Received Date)"]?.date?.start || "";

  function getBrandName(code = "") {
    const prefix = code.substring(0, 2).toUpperCase();
    const brandMap = {
      PN: "PULCINELLA",
      CK: "CLAUDIA KLEID",
      CB: "CLAUDIA KLEID BLACK & WHITE",
      CW: "CLAUDIA KLEID WEEKEND",
      LY: "LIYA",
      BN: "BONITA",
      AL: "ALL",
    };
    return `${prefix} (${brandMap[prefix] || "ไม่ทราบแบรนด์"})`;
  }

  return (
    <React.Fragment>
      {/* ... ส่วน Header และ Table ยังคงเหมือนเดิม ... */}
      <div className="flex flex-col relative h-full pl-14">
        <div className="text-center text-2xl font-bold">ใบรับผ้า</div>
        <div className="flex justify-center mt-4">
          <div className="grid grid-cols-2 w-2xl pl-2">
            <div className="grid gap-1">
              <div>
                ผลิตภัณฑ์:{" "}
                <span className="underline underline-offset-4 text-sm">
                  {getBrandName(brandCode)}
                </span>
              </div>
              <div>
                วันที่รับผ้าเข้า:{" "}
                <span className="underline underline-offset-4">
                  {receivedDate
                    ? new Date(receivedDate).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : ""}
                </span>
              </div>
              <div>
                ชื่อร้าน:{" "}
                <span className="underline underline-offset-4">{supplier}</span>{" "}
                 ชนิดผ้า:{" "}
                <span className="underline underline-offset-4">
                  {typeOfFabric}
                </span>
              </div>
            </div>
            <div className="grid gap-1 ml-8">
              <div>
                รหัสผลิตภัณฑ์:{" "}
                <span className="underline underline-offset-4">
                  {supplierCode}
                </span>
              </div>
              <div>
                หน้าผ้า:{" "}
                <span className="underline underline-offset-4">
                  {surface
                    ? `${surface} นิ้ว (${(surface * 2.54).toFixed(2)} ซ.ม)`
                    : "ไม่มีข้อมูล"}
                </span>
              </div>
              <div>
                ราคาต่อหลา:{" "}
                <span className="underline underline-offset-4">
                  {pricePerYard} บาท
                </span>
              </div>
            </div>
          </div>
        </div>

        <table className="w-full border-collapse mt-10">
          <thead>
            <tr>
              <th
                className={`p-1 w-42 text-center ${HEADER_FULL_BORDER_CLASS}`}
              >
                ตัวอย่างผ้า
              </th>
              <th
                className={`p-1 w-30 text-center ${HEADER_FULL_BORDER_CLASS}`}
              >
                รหัสผ้า
              </th>
              <th className={`p-1 text-center ${HEADER_FULL_BORDER_CLASS}`}>
                รหัสพับ
              </th>
              <th className={`p-1 text-center ${HEADER_FULL_BORDER_CLASS}`}>
                จำนวน หลา/เมตร
              </th>
              <th className={`p-1 text-center ${HEADER_FULL_BORDER_CLASS}`}>
                จำนวนรวม
              </th>
            </tr>
          </thead>
          <tbody>
            {processedData.map((group) => (
              <React.Fragment key={group.code}>
                {group.items.map((item, itemIndex) => {
                  const rollTag =
                    item.properties?.["Full Fabric Roll Tag"]?.rollup
                      ?.array?.[0]?.formula?.string || "ไม่มีรหัสพับ";
                  const amount = parseFloat(
                    item.properties?.[
                      "ยอดคงเหลือ(จำนวนหลา) (Remaining Yardage)"
                    ]?.rollup?.array?.[0]?.formula?.number || 0
                  );
                  const imageUrl =
                    item.properties?.["รูปภาพ (Photo)"]?.files?.[0]?.file
                      ?.url || "";
                  const isLastItemInGroup =
                    itemIndex === group.items.length - 1;

                  const baseTdStyling = `align-middle`;
                  const mergedCellClasses = `${baseTdStyling} p-2 text-center ${CELL_VERTICAL_BORDERS_CLASS} ${GROUP_BOTTOM_BORDER_CLASS}`;
                  const nonMergedCellBottomBorder = isLastItemInGroup
                    ? GROUP_BOTTOM_BORDER_CLASS
                    : NO_INTERNAL_BOTTOM_BORDER_CLASS;
                  const nonMergedCellClasses = `${baseTdStyling} py-3 px-2 text-center ${CELL_VERTICAL_BORDERS_CLASS} ${nonMergedCellBottomBorder}`;

                  const tableCells = [];

                  if (itemIndex === 0) {
                    tableCells.push(
                      <td
                        key={`sample-td-${group.code}`}
                        className={mergedCellClasses}
                        rowSpan={group.rowCount}
                      >
                        <img
                          src={imageUrl || ""}
                          alt={``}
                          className="h-30 object-cover mx-auto"
                        />
                      </td>
                    );
                  }

                  if (itemIndex === 0) {
                    tableCells.push(
                      <td
                        key={`code-td-${group.code}`}
                        className={`${mergedCellClasses} font-bold`}
                        rowSpan={group.rowCount}
                      >
                        {group.code.slice(2)}
                      </td>
                    );
                  }

                  tableCells.push(
                    <td
                      key={`rolltag-td-${item.id}`}
                      className={nonMergedCellClasses}
                    >
                      {rollTag}
                    </td>
                  );

                  tableCells.push(
                    <td
                      key={`amount-td-${item.id}`}
                      className={nonMergedCellClasses}
                    >
                      {`${amount.toFixed(2)}y (${(amount * 0.9144).toFixed(
                        2
                      )}m)`}
                    </td>
                  );

                  if (itemIndex === 0) {
                    tableCells.push(
                      <td
                        key={`total-td-${group.code}`}
                        className={`${mergedCellClasses} font-bold`}
                        rowSpan={group.rowCount}
                      >
                        {`${group.total.toFixed(2)}y`}
                      </td>
                    );
                  }

                  return (
                    <tr key={item.id || `row-${group.code}-${itemIndex}`}>
                      {tableCells}
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
}

export default FabricTableRows1;
