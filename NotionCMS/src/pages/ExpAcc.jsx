import React, { useState, useEffect } from 'react'
import Navigation from '../component/Navigation'
import ExpenseRequest from '../component/ExpenseRequest'
import { FaPrint } from "react-icons/fa6";

function ExpAcc() {

    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    async function fetchDataFromAPIEndpoint() {
        try {
            const response = await fetch('http://192.168.213.190:4000/notion-exp-acc');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            setData(result.results);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error.message);
        }
    }

    useEffect(() => {
        fetchDataFromAPIEndpoint();
    }, []);

    const printRef = React.useRef(null);

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <Navigation />
            <button onClick={handlePrint} className='text-4xl fixed right-20 bottom-10 text-blue-400 hover:text-blue-500 print:hidden'><FaPrint /></button>
            <section style={{ fontFamily: 'IBM Plex Sans Thai, serif' }} className='container max-w-full bg-gray-100 py-4 print:pt-0 print:pb-0'>
                {error && <div className="error">{error}</div>}
                {data?.filter(item => item?.properties?.Checkbox?.checkbox !== true).map((item, index) => (
                    <div key={index} ref={printRef} className='mx-auto px-8 w-[210mm] h-[297mm] bg-white mb-2 flex justify-between flex-col'>
                        <ExpenseRequest {...item} title="ใบขอเบิกค่าใช้จ่าย" left={'left-18'} width={"w-50"} top={`-top-10`}/>
                    </div>
                ))}
            </section>
        </>
    )
}

export default ExpAcc
