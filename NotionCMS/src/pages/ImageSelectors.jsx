import React, { useState, useEffect } from 'react'
import Navigation from '../component/Navigation';
import ImageSelector from '../component/ImageSelector';
import { FaPrint } from "react-icons/fa6";

function ImageSelectors() {

    const [data, setData] = useState([]);
    const [chunkedData, setChunkedData] = useState([]);
    const [error, setError] = useState(null);

    async function fetchDataFromAPIEndpoint() {
        try {
            const response = await fetch('http://192.168.213.9:4000/notion-imgselectors');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            console.log('Fetched result:', result);

            setData(result.results); // ดึงแค่ results
            setChunkedData(chunkArray(result.results, 9)); // ดึงแค่ results
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error.message);
        }
    }

    function chunkArray(array, size) {
        const chunked = [];
        for (let i = 0; i < array.length; i += size) {
            chunked.push(array.slice(i, i + size));
        }
        return chunked;
    }

    useEffect(() => {
        fetchDataFromAPIEndpoint();
    }, []);

    const printRef = React.useRef(null);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div>
            <Navigation />
            <button onClick={handlePrint} className='text-4xl fixed right-20 bottom-10 text-blue-400 hover:text-blue-500 print:hidden'><FaPrint /></button>
            <section style={{ fontFamily: 'IBM Plex Sans Thai, serif' }} className='container max-w-full'>
                {error && <div className="error">{error}</div>}
                {chunkedData.map((item, index) => {
                    return (
                        <div key={index} ref={printRef} className='mx-auto px-8 w-[210mm] h-[297mm] border mb-2 flex justify-between flex-col'>
                            <ImageSelector data={item} />
                        </div>
                    )
                })}
            </section>
        </div>
    )
}

export default ImageSelectors
