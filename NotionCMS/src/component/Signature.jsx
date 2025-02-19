import React from 'react'

function Signature({ requesterTitle, requesterId, namerequesterId, altrequesterId, daterequesterId, approverTitle, approverId, nameapproverId, altapproverId, dateapproverId }) {


    return (
        <div className='flex justify-between px-5'>
            <div className='text-center grid gap-2'>
                <p className='relative'>{requesterTitle} : ............................................<img className='absolute -top-12 h-24 left-18' src={requesterId} alt={altrequesterId} /></p>
                <p>( {namerequesterId} )</p>
                <p>วันที่ :
                    <span className="font-medium underline decoration-dotted underline-offset-4 decoration-1.5">
                        ㅤ
                        {daterequesterId
                            ? new Intl.DateTimeFormat("th-TH", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                            }).format(new Date(daterequesterId))
                            : "\u00A0".repeat(25)}
                        ㅤ
                    </span>
                </p>
            </div>
            <div className='text-center grid gap-2'>
                <p className='relative'>{approverTitle} : ............................................<img className='absolute -top-12 h-24 left-18' src={approverId} alt={altapproverId} /></p>
                <p>( {nameapproverId} )</p>
                <p>วันที่ :
                    <span className="font-medium underline decoration-dotted underline-offset-4 decoration-1.5">
                        ㅤ
                        {dateapproverId
                            ? new Intl.DateTimeFormat("th-TH", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                            }).format(new Date(dateapproverId))
                            : "\u00A0".repeat(25)}
                        ㅤ
                    </span>
                </p>
            </div>
        </div>
    )
}

export default Signature
