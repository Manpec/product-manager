export default function Button({ color, children, onClick }) {
    const styles = {
      dark: "bg-blue-500 text-white hover:bg-white hover:text-black border border-blue-500 hover:border-2 border-blue-500 rounded-md px-3.5 py-2.5 hover:cursor-pointer",
      primary: "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none float-left focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
      light:
        "bg-white text-black hover:bg-black hover:text-white rounded-md px-3.5 py-2.5 hover:cursor-pointer",
      bright:
        "bg-green-200 text-black hover:bg-green-500 hover:text-white  rounded-md px-3.5 py-2.5 hover:cursor-pointer",
      danger:"bg-red text-black bg-red-200 hover:bg-red-500 hover:text-white rounded-md px-3.5 py-2.5 hover:cursor-pointer"
    };
  
    return (
      <button
        className={`${styles[color]} p-2`}
        onClick={onClick}>{children}</button>
      
    );
  }