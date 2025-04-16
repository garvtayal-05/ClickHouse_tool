import axios from 'axios'

const clickhouseApi = {
  testConnection: async (connection) => {
    try {
      const response = await axios.post('/api/clickhouse/test-connection', connection)
      return response.data
    } catch (error) {
      throw error.response?.data || 'Failed to test connection'
    }
  },

  getTables: async (connection) => {
    try {
      const response = await axios.post('/api/clickhouse/tables', connection)
      return response.data
    } catch (error) {
      throw error.response?.data || 'Failed to fetch tables'
    }
  },

  getTableSchema: async (connection, tableName) => {
    try {
      const response = await axios.post('/api/clickhouse/schema', {
        connection,
        tableName
      })
      return response.data
    } catch (error) {
      throw error.response?.data || 'Failed to fetch schema'
    }
  },

  previewData: async (connection, tableName, columns) => {
    try {
      const response = await axios.post('/api/clickhouse/preview', {
        connection,
        tableName,
        columns
      })
      return response.data
    } catch (error) {
      throw error.response?.data || 'Failed to preview data'
    }
  },

  getDatabaseInfo: async (connection) => {
    try {
      const response = await axios.post('/api/database/info', connection)
      return response.data
    } catch (error) {
      throw error.response?.data || 'Failed to get database info'
    }
  }
}

export default clickhouseApi