import React, { useState, useEffect } from 'react'
import { FaPrint } from "react-icons/fa6";
import Navigation from '../component/Navigation';
import ApproveSewingCost from '../component/ApproveSewingCost';

function ApproveSewingCosts() {

    const [data, setData] = useState([]);
    async function fetchDataFromAPIEndpoint() {
        try {
            const response = await fetch('http://localhost:4000/notion-pay-tailor');
            const result = await response.json();
            setData(result.results);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        fetchDataFromAPIEndpoint();
    }, []);

    const printRef = React.useRef(null);

    const handlePrint = () => {
        window.print();  // ฟังก์ชันที่จะทำให้หน้าปัจจุบันถูกพิมพ์
    };

    return (
        <>
            <Navigation />
            <button onClick={handlePrint} className='text-4xl fixed right-30 bottom-10 text-blue-400 hover:text-blue-500 print:hidden'><FaPrint /></button>
            <section style={{ fontFamily: 'IBM Plex Sans Thai, serif' }} className='container max-w-full'>
                {data?.filter(item => item?.properties?.Checkbox?.checkbox !== true)
                    .map((item, index) => (
                        <div key={index} ref={printRef} className='mx-auto rouded-lg px-6 w-[210mm] h-[297mm] break-after-page border mb-2 flex justify-between flex-col'>
                            <ApproveSewingCost {...item} />
                        </div>
                    ))
                }
            </section>
        </>
    )
}

export default ApproveSewingCosts
