import React, { useState, useEffect } from 'react';
import Navigation from '../component/Navigation';
import { FaPrint } from "react-icons/fa6";
import SearchFabricReceipt from '../component/SearchFabricReceipt';
import FabricTableRows from '../component/FabricTableRows';

function FabricReceipt() {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");         // input ที่พิมพ์
    const [searchTerm, setSearchTerm] = useState(""); // input ที่กดค้นหา

    async function fetchFabricInventory() {
        try {
            const response = await fetch('http://192.168.213.9:4000/notion-fabric-inventory');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            setData(result.results);
        } catch (error) {
            console.error('Error fetching Fabric Inventory:', error);
            setError(error.message);
        }
    }

    useEffect(() => {
        fetchFabricInventory();
    }, []);

    const handlePrint = () => {
        window.print();
    };

    const filteredData = data.filter(item => {
        const code = item.properties?.["รหัสสี (Fabric Color Code) Mirror"]?.formula?.string || "";
        return code.toLowerCase().includes(searchTerm.toLowerCase());
    });

    function chunkArray(arr, size) {
        const result = [];
        for (let i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    }
    const sortedData = [...filteredData].sort((a, b) => {
        const aTag = a?.properties?.["Full Fabric Roll Tag"]?.rollup?.array[0]?.formula?.string || "";
        const bTag = b?.properties?.["Full Fabric Roll Tag"]?.rollup?.array[0]?.formula?.string || "";
        return aTag.localeCompare(bTag, 'en', { numeric: true });
    });

    const chunkedData = chunkArray(sortedData, 14);

    // คำนวณยอดรวมตามรหัสผ้า
    const totalByFabricCode = {};

    filteredData.forEach(item => {
        const code = item.properties?.["รหัสสี (Fabric Color Code) Mirror"]?.formula?.string || "";
        const rawAmount = parseFloat(item.properties?.["ยอดคงเหลือ(จำนวนหลา) (Remaining Yardage)"]?.rollup?.array?.[0]?.formula?.number || 0);

        if (!totalByFabricCode[code]) {
            totalByFabricCode[code] = 0;
        }
        totalByFabricCode[code] += rawAmount;
    });

    return (
        <>
            <Navigation />
            <SearchFabricReceipt
                search={search}
                setSearch={setSearch}
                onSearch={() => setSearchTerm(search)} // เมื่อกดค้นหา ค่อย setSearchTerm
            />


            <button
                onClick={handlePrint}
                className='text-4xl fixed right-20 bottom-10 text-blue-400 hover:text-blue-500 print:hidden'
            >
                <FaPrint />
            </button>

            <section style={{ fontFamily: 'IBM Plex Sans Thai, serif' }} className='container max-w-full'>
                {error && <div className="error">{error}</div>}
                {searchTerm && (
                    <div className="">
                        {filteredData.length > 0 ? (
                            <>
                                {chunkedData.map((item, index) => (
                                    <div key={index} className="mx-auto rouded-lg px-6 w-[210mm] h-[297mm] break-after-page border mb-2 flex flex-col">
                                        <FabricTableRows
                                            data={item}
                                            filteredData={filteredData}
                                            totalByFabricCode={totalByFabricCode}
                                        />
                                    </div>
                                ))}
                            </>
                        ) : (
                            <p>ไม่พบข้อมูลที่ตรงกับ "{search}"</p>
                        )}
                    </div>
                )}
            </section>
        </>
    );
}

export default FabricReceipt;

