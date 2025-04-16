import { useIngestion } from '../../context/IngestionContext'
import ingestionApi from '../../api/ingestionApi'

const IngestionOptions = () => {
  const {
    selectedSource,
    setSelectedSource,
    selectedTarget,
    setSelectedTarget,
    targetTableName,
    setTargetTableName,
    createTable,
    setCreateTable,
    joinTables,
    setJoinTables,
    joinCondition,
    setJoinCondition,
    loading,
    setLoading,
    setError,
    setSuccess,
    setIngestionResult
  } = useIngestion()

  const handleStartIngestion = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      // Create ingestion request based on source and target
      // This would use the actual request object from your context
      // and call the appropriate API endpoint
      
      setSuccess('Ingestion started successfully')
      const result = await ingestionApi.startIngestion(ingestionRequest)
      setIngestionResult(result)
    } catch (error) {
      setError('Failed to start ingestion: ' + error.toString())
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">Ingestion Options</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="source" className="form-label">Source</label>
            <select
              id="source"
              name="source"
              className="form-select"
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
            >
              <option value="clickhouse">ClickHouse</option>
              <option value="flatfile">Flat File</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="target" className="form-label">Target</label>
            <select
              id="target"
              name="target"
              className="form-select"
              value={selectedTarget}
              onChange={(e) => setSelectedTarget(e.target.value)}
            >
              <option value="flatfile">Flat File</option>
              <option value="clickhouse">ClickHouse</option>
            </select>
          </div>
        </div>

        {selectedTarget === 'clickhouse' && (
          <>
            <div>
              <label htmlFor="targetTableName" className="form-label">Target Table Name</label>
              <input
                type="text"
                id="targetTableName"
                name="targetTableName"
                className="form-input"
                value={targetTableName}
                onChange={(e) => setTargetTableName(e.target.value)}
                placeholder="new_table"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                id="createTable"
                name="createTable"
                type="checkbox"
                checked={createTable}
                onChange={(e) => setCreateTable(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="createTable" className="ml-2 block text-sm text-gray-700">
                Create table if not exists
              </label>
            </div>
          </>
        )}

        {selectedSource === 'clickhouse' && selectedTarget === 'flatfile' && (
          <>
            <div>
              <label htmlFor="joinTables" className="form-label">Join Tables (optional)</label>
              <input
                type="text"
                id="joinTables"
                name="joinTables"
                className="form-input"
                value={joinTables.join(', ')}
                onChange={(e) => setJoinTables(e.target.value.split(',').map(s => s.trim()))}
                placeholder="table1, table2"
              />
            </div>

            <div>
              <label htmlFor="joinCondition" className="form-label">Join Condition (optional)</label>
              <input
                type="text"
                id="joinCondition"
                name="joinCondition"
                className="form-input"
                value={joinCondition}
                onChange={(e) => setJoinCondition(e.target.value)}
                placeholder="table1.id = table2.id"
              />
            </div>
          </>
        )}

        <button
          onClick={handleStartIngestion}
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? 'Processing...' : 'Start Ingestion'}
        </button>
      </div>
    </div>
  )
}

export default IngestionOptions