import axios from 'axios'

const ingestionApi = {
  startIngestion: async (request) => {
    try {
      const response = await axios.post('/api/ingestion/start', request)
      return response.data
    } catch (error) {
      throw error.response?.data || 'Failed to start ingestion process'
    }
  },

  performJoinIngestion: async (request) => {
    try {
      const response = await axios.post('/api/ingestion/join', request)
      return response.data
    } catch (error) {
      throw error.response?.data || 'Failed to perform join ingestion'
    }
  }
}

export default ingestionApi