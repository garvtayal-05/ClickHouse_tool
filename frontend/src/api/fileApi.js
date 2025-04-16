import axios from 'axios'

const fileApi = {
  uploadFile: async (file) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post('/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      throw error.response?.data || 'Failed to upload file'
    }
  },

  listFiles: async () => {
    try {
      const response = await axios.get('/api/files/list')
      return response.data.files || []
    } catch (error) {
      throw error.response?.data || 'Failed to list files'
    }
  },

  getFileSchema: async (connection) => {
    try {
      const response = await axios.post('/api/flatfile/schema', connection)
      return response.data
    } catch (error) {
      throw error.response?.data || 'Failed to get file schema'
    }
  },

  previewData: async (connection, limit = 10) => {
    try {
      const response = await axios.post(`/api/flatfile/preview?limit=${limit}`, connection)
      return response.data
    } catch (error) {
      throw error.response?.data || 'Failed to preview file data'
    }
  }
}

export default fileApi