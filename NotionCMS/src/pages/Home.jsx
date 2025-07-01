import React from "react";
import Navigation from "../component/Navigation";
import { useAuth } from "../context/AuthContext";
import pnl from "../assets/images/PNL.png"; // <-- นำเข้าภาพ PNL

function Home() {
  const { currentUser } = useAuth(); // <-- ดึงชื่อผู้ใช้

  return (
    <div>
      <Navigation />
      <div className="w-full mx-auto">
        <img
          alt="PNL group"
          src={pnl}
          className="mx-auto h-48 w-auto"
          loading="lazy"
        />
      </div>
      <h1 className="text-4xl font-bold text-center mt-10">
        Welcome to PNL Group{currentUser ? ` K. ${currentUser.user}` : ""}
      </h1>
      {/* <div className="flex justify-center mt-4">
        <img
          src="https://media.tenor.com/DvToYQWpuY8AAAAM/cat-angry.gif"
          alt="Angry Cat"
          className="w-82 h-auto"
        />
      </div>
      <div className="flex justify-center mt-4">
        <img
          src="https://cdn.readawrite.com/articles/2965/2964579/thumbnail/small.gif?1"
          alt="Angry Cat1"
          className="w-82 h-auto"
        />
      </div> */}
    </div>
  );
}

export default Home;
