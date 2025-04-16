import { useIngestion } from '../../context/IngestionContext'

const IngestionResult = () => {
  const { ingestionResult } = useIngestion()

  if (!ingestionResult) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-800">Ingestion Result</h2>
        <p className="text-gray-600">No ingestion results yet.</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">Ingestion Result</h2>
      
      <div className={`rounded-md p-4 ${ingestionResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
        <div className="flex">
          <div className="flex-shrink-0">
            {ingestionResult.success ? (
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium">
              {ingestionResult.success ? 'Success!' : 'Error'}
            </h3>
            <div className="mt-2 text-sm">
              <p>{ingestionResult.message}</p>
              {ingestionResult.recordCount > 0 && (
                <p className="mt-1">
                  Processed records: <span className="font-semibold">{ingestionResult.recordCount}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IngestionResult