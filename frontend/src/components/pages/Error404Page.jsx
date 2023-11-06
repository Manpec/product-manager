import React from "react";
import { Link} from "react-router-dom";
import error404 from "../images/404_Error.png";

const Error404Page = () => {

  const errorBackgroundStyle = {
    backgroundImage: `url(${error404})`,
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
        Page not found
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

export default Error404Page;