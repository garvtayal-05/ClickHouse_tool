import { useState } from 'react'
import { useIngestion } from '../../context/IngestionContext'
import clickhouseApi from '../../api/clickhouseApi'

const ClickHouseTableList = () => {
  const {
    tables,
    selectedTable,
    setSelectedTable,
    setSchema,
    setSelectedColumns,
    setError,
    setSuccess,
    setLoading,
    clickHouseConnection
  } = useIngestion()

  const [expanded, setExpanded] = useState(false)

  const handleTableSelect = async (tableName) => {
    setSelectedTable(tableName)
    setLoading(true)
    setError(null)
    
    try {
      const schema = await clickhouseApi.getTableSchema(clickHouseConnection, tableName)
      setSchema(schema)
      setSelectedColumns(schema.columns.map(col => col.name))
      setSuccess(`Loaded schema for table: ${tableName}`)
    } catch (error) {
      setError(`Failed to load schema: ${error.toString()}`)
    } finally {
      setLoading(false)
    }
  }

  if (tables.length === 0) {
    return (
      <div className="card">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Tables</h2>
        <p className="text-gray-600">No tables loaded. Please connect to ClickHouse first.</p>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Tables</h2>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-primary-600 hover:text-primary-800"
        >
          {expanded ? 'Collapse' : 'Expand'} All
        </button>
      </div>
      
      <div className="mt-4 max-h-96 overflow-y-auto">
        <ul className="space-y-2">
          {tables.map((table) => (
            <li key={table}>
              <button
                type="button"
                className={`w-full rounded-md p-2 text-left hover:bg-gray-100 ${selectedTable === table ? 'bg-primary-50 text-primary-700' : ''}`}
                onClick={() => handleTableSelect(table)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{table}</span>
                  <svg
                    className={`h-5 w-5 transform transition-transform ${selectedTable === table ? 'rotate-90 text-primary-500' : 'text-gray-400'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ClickHouseTableList