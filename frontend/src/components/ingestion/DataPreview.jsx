import { useIngestion } from '../../context/IngestionContext'

const DataPreview = () => {
  const { previewData } = useIngestion()

  if (!previewData || previewData.length === 0) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-800">Data Preview</h2>
        <p className="text-gray-600">No data to preview. Please select columns and click Preview.</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">Data Preview</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {previewData[0].map((header, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {previewData.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="whitespace-nowrap px-6 py-4 text-sm text-gray-500"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-2 text-sm text-gray-500">
        Showing {previewData.length - 1} rows (first row shows headers)
      </div>
    </div>
  )
}

export default DataPreview