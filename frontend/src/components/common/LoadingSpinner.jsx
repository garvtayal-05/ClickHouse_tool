const LoadingSpinner = ({ fullPage = false }) => (
    <div className={`flex items-center justify-center ${fullPage ? 'h-screen' : 'h-full'}`}>
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
    </div>
  );
  
  export default LoadingSpinner;