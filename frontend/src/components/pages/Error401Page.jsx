import React from "react";
import { Link, useLocation } from "react-router-dom";
import error401 from "../images/401_Error_Unauthorized.png";

const Error401Page = () => {

  const errorBackgroundStyle = {
    backgroundImage: `url(${error401})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    overflow: 'hidden',
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
  };

  return (
    <div style={errorBackgroundStyle} className="min-h-screen">
      <div className="text-center max-w-[200px]  mb-16"> 
        <p className="text-lg mb-2">
        You do not have sufficient privileges to access this page.
        </p>
        <div className="mb-4 max-w-[200px] rounded-md py-2 px-4 bg-purple-400">
          <Link to={"/"} className="text-lg  text-black no-underline">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Error401Page;