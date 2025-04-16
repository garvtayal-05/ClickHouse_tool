const Input = ({ label, id, type = 'text', className = '', ...props }) => {
    return (
      <div className={className}>
        {label && (
          <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          type={type}
          id={id}
          className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          {...props}
        />
      </div>
    )
  }
  
  export default Input