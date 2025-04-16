import { useIngestion } from '../../context/IngestionContext'
import clickhouseApi from '../../api/clickhouseApi'

const ColumnSelection = () => {
  const {
    schema,
    selectedColumns,
    setSelectedColumns,
    setPreviewData,
    setLoading,
    setError,
    clickHouseConnection,
    selectedTable
  } = useIngestion()

  const handleColumnToggle = (columnName) => {
    setSelectedColumns(prev =>
      prev.includes(columnName)
        ? prev.filter(col => col !== columnName)
        : [...prev, columnName]
    )
  }

  const handleSelectAll = () => {
    if (selectedColumns.length === schema.columns.length) {
      setSelectedColumns([])
    } else {
      setSelectedColumns(schema.columns.map(col => col.name))
    }
  }

  const handlePreview = async () => {
    if (selectedColumns.length === 0) {
      setError('Please select at least one column')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const data = await clickhouseApi.previewData(
        clickHouseConnection,
        selectedTable,
        selectedColumns,
        10
      )
      setPreviewData(data)
    } catch (error) {
      setError('Failed to preview data: ' + error.toString())
    } finally {
      setLoading(false)
    }
  }

  if (!schema || schema.columns.length === 0) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-800">Columns</h2>
        <p className="text-gray-600">No columns loaded. Please select a table first.</p>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Columns</h2>
        <button
          onClick={handleSelectAll}
          className="text-sm text-primary-600 hover:text-primary-800"
        >
          {selectedColumns.length === schema.columns.length ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      <div className="mt-4 max-h-96 overflow-y-auto">
        <ul className="space-y-2">
          {schema.columns.map((column) => (
            <li key={column.name}>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedColumns.includes(column.name)}
                  onChange={() => handleColumnToggle(column.name)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-700">
                  {column.name} <span className="text-sm text-gray-500">({column.type})</span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handlePreview}
        className="btn-secondary mt-4"
      >
        Preview Data
      </button>
    </div>
  )
}

export default ColumnSelection