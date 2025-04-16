const Button = ({ children, type = 'button', variant = 'primary', className = '', ...props }) => {
    const variants = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700',
      secondary: 'bg-secondary-600 text-white hover:bg-secondary-700',
      outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
      danger: 'bg-red-600 text-white hover:bg-red-700'
    }
  
    return (
      <button
        type={type}
        className={`rounded-md px-4 py-2 font-medium transition duration-200 ease-in-out ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }
  
  export default Button