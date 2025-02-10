import React, { useState, useEffect } from 'react'
import { FaArrowAltCircleUp } from "react-icons/fa";

function ScrollToTopBtn() {
  const [ scrollToTopBtn, setScrollToTopBtn ] = useState(false)

  useEffect(() => {
    window.addEventListener("scroll", () =>{
        if (window.scrollY > 200) {
            setScrollToTopBtn(true)
        }else{
            setScrollToTopBtn(false)
        }
    })
  }, [])

  const scrollUp = () => {
    window.scrollTo(
        {
            top: 0,
            behavior: "smooth"
        }
    )
  }

  return (
    <div>
        {scrollToTopBtn && (
            <button onClick={scrollUp} className='fixed bottom-9 right-6 p-2 bg-white z-30 transition duration-300 ease-in-out text-blue-400 hover:text-blue-500 text-3xl'><FaArrowAltCircleUp /></button>
        )}
    </div>
  )
}

export default ScrollToTopBtn