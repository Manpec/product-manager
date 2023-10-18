export default function Button({ color, children, handleClick }) {
    const styles = {
      dark: "bg-black text-white hover:bg-blue-500 hover:text-black rounded-md px-3.5 py-2.5 hover:cursor-pointer",
      light:
        "bg-white text-black hover:bg-black hover:text-white rounded-md px-3.5 py-2.5 hover:cursor-pointer",
      bright:
        "bg-green-200 text-black hover:bg-green-500 hover:text-white  rounded-md px-3.5 py-2.5 hover:cursor-pointer",
      danger:"bg-red text-black bg-red-200 hover:bg-red-500 hover:text-white rounded-md px-3.5 py-2.5 hover:cursor-pointer"
    };
  
    return (
      <button
        className={`${styles[color]} p-2`}
        onClick={handleClick}>{children}</button>
      
    );
  }