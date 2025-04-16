const Loader = () => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
        <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-xl">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
          <p className="mt-2 text-sm font-medium text-gray-700">Processing...</p>
        </div>
      </div>
    )
  }
  
  export default Loader