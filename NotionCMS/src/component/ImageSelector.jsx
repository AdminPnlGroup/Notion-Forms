import React, { useState, useEffect } from 'react'
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoMdCloseCircleOutline } from "react-icons/io";

function ImageSelector({ data }) {

  return (
    <div className='grid grid-cols-3 w-full h-full content-center justify-items-center gap-6'>
      {data.map((item, index) => {
        return (
          <div className='grid gap-2' key={index}>
            <div className='flex justify-center'>
              <img className='w-42' src={item.properties?.["Pic"]?.files[0]?.file?.url} alt={item.properties?.["Pic"]?.files[0]?.name} />
            </div>
            <div className='gap-1 flex justify-center'>
              <div className='flex justify-center text-lg'>
                {item.properties?.Check?.checkbox
                  ? <IoMdCheckmarkCircleOutline className="text-green-500" />
                  : <IoMdCloseCircleOutline className="text-red-500" />}
              </div>
              <div className=''>
                <p className='text-sm'>{item.properties?.Code?.title[0]?.plain_text}</p>
              </div>
            </div>
            <div className='text-center'>
              {item.properties?.More?.rich_text[0]?.plain_text || "ㅤ"}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ImageSelector
