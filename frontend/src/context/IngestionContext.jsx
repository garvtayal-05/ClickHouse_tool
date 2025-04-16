import { createContext, useContext, useState } from 'react'

const IngestionContext = createContext(null)

export function IngestionProvider({ children }) {
  const [clickHouseConnection, setClickHouseConnection] = useState({
    host: '',
    port: 8123,
    database: '',
    user: '',
    jwtToken: ''
  })

  const [flatFileConnection, setFlatFileConnection] = useState({
    fileName: '',
    delimiter: ',',
    hasHeader: true
  })

  const [selectedSource, setSelectedSource] = useState('clickhouse')
  const [selectedTarget, setSelectedTarget] = useState('flatfile')
  const [tables, setTables] = useState([])
  const [selectedTable, setSelectedTable] = useState('')
  const [targetTableName, setTargetTableName] = useState('')
  const [schema, setSchema] = useState({ columns: [] })
  const [selectedColumns, setSelectedColumns] = useState([])
  const [joinTables, setJoinTables] = useState([])
  const [joinCondition, setJoinCondition] = useState('')
  const [previewData, setPreviewData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [ingestionResult, setIngestionResult] = useState(null)
  const [createTable, setCreateTable] = useState(true)

  const value = {
    clickHouseConnection,
    setClickHouseConnection,
    flatFileConnection,
    setFlatFileConnection,
    selectedSource,
    setSelectedSource,
    selectedTarget,
    setSelectedTarget,
    tables,
    setTables,
    selectedTable,
    setSelectedTable,
    targetTableName,
    setTargetTableName,
    schema,
    setSchema,
    selectedColumns,
    setSelectedColumns,
    joinTables,
    setJoinTables,
    joinCondition,
    setJoinCondition,
    previewData,
    setPreviewData,
    loading,
    setLoading,
    error,
    setError,
    success,
    setSuccess,
    ingestionResult,
    setIngestionResult,
    createTable,
    setCreateTable
  }

  return <IngestionContext.Provider value={value}>{children}</IngestionContext.Provider>
}

export function useIngestion() {
  const context = useContext(IngestionContext)
  if (context === null) {
    throw new Error('useIngestion must be used within an IngestionProvider')
  }
  return context
}