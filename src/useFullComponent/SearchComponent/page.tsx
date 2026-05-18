export default function SearchCom() {
  return (
    // <div className="w-full h-[30vh] bg-white z-index-30 ">
    <div className=" w-full h-16 bg-white p-4 flex flex-col justify-center items-center">
      <h1 className="text-lg">What Are You Looking For?</h1>
      <div>
        <input
          type="text"
          placeholder="Search..."
          className="border mt-5 border-gray-300 rounded-l-md px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="bg-blue-500 text-white rounded-r-md px-4 py-2 hover:bg-blue-600 transition-colors duration-200">
          Search
        </button>
      </div>
    </div>
    // </div>
  );
}
