import { useState } from 'react'
import { useIngestion } from '../../context/IngestionContext'
import clickhouseApi from '../../api/clickhouseApi'

const ClickHouseConnectionForm = () => {
  const { 
    clickHouseConnection, 
    setClickHouseConnection, 
    setTables, 
    setError, 
    setSuccess, 
    setLoading 
  } = useIngestion()
  
  const [testStatus, setTestStatus] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setClickHouseConnection({
      ...clickHouseConnection,
      [name]: name === 'port' ? parseInt(value) : value
    })
  }

  const handleTestConnection = async (e) => {
    e.preventDefault()
    setLoading(true)
    setTestStatus(null)
    
    try {
      const result = await clickhouseApi.testConnection(clickHouseConnection)
      setTestStatus({ success: result.success, message: result.message })
      if (result.success) {
        setSuccess('Connection successful')
      } else {
        setError(result.message)
      }
    } catch (error) {
      setTestStatus({ success: false, message: error.toString() })
      setError('Connection test failed: ' + error.toString())
    } finally {
      setLoading(false)
    }
  }

  const handleLoadTables = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const tables = await clickhouseApi.getTables(clickHouseConnection)
      setTables(tables)
      setSuccess(`Successfully loaded ${tables.length} tables`)
    } catch (error) {
      setError('Failed to load tables: ' + error.toString())
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">ClickHouse Connection</h2>
      
      <form className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="host" className="form-label">Host</label>
            <input
              type="text"
              id="host"
              name="host"
              className="form-input"
              value={clickHouseConnection.host}
              onChange={handleChange}
              placeholder="localhost"
              required
            />
          </div>
          
          <div>
            <label htmlFor="port" className="form-label">Port</label>
            <input
              type="number"
              id="port"
              name="port"
              className="form-input"
              value={clickHouseConnection.port}
              onChange={handleChange}
              placeholder="8123"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="database" className="form-label">Database</label>
          <input
            type="text"
            id="database"
            name="database"
            className="form-input"
            value={clickHouseConnection.database}
            onChange={handleChange}
            placeholder="default"
            required
          />
        </div>

        <div>
          <label htmlFor="user" className="form-label">User</label>
          <input
            type="text"
            id="user"
            name="user"
            className="form-input"
            value={clickHouseConnection.user}
            onChange={handleChange}
            placeholder="default"
            required
          />
        </div>

        <div>
          <label htmlFor="jwtToken" className="form-label">JWT Token</label>
          <textarea
            id="jwtToken"
            name="jwtToken"
            className="form-input"
            value={clickHouseConnection.jwtToken}
            onChange={handleChange}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            rows={3}
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <button 
            type="button" 
            className="btn-primary" 
            onClick={handleTestConnection}
          >
            Test Connection
          </button>
          
          <button
            type="button"
            className="btn-secondary"
            onClick={handleLoadTables}
          >
            Load Tables
          </button>
        </div>
        
        {testStatus && (
          <div className={`mt-4 rounded-md p-3 ${testStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {testStatus.message}
          </div>
        )}
      </form>
    </div>
  )
}

export default ClickHouseConnectionForm