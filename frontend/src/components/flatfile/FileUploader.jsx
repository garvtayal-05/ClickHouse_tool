import { useState } from 'react'
import { useIngestion } from '../../context/IngestionContext'
import fileApi from '../../api/fileApi'

const FileUploader = () => {
  const {
    flatFileConnection,
    setFlatFileConnection,
    setSchema,
    setSelectedColumns,
    setError,
    setSuccess,
    setLoading
  } = useIngestion()

  const [fileList, setFileList] = useState([])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFlatFileConnection({
        ...flatFileConnection,
        fileName: file.name,
        hasHeader: true
      })
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!flatFileConnection.fileName) {
      setError('Please select a file first')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const response = await fileApi.uploadFile(flatFileConnection.fileName)
      const files = await fileApi.listFiles()
      setFileList(files)
      
      const schema = await fileApi.getFileSchema({
        fileName: response.filepath,
        delimiter: flatFileConnection.delimiter,
        hasHeader: flatFileConnection.hasHeader
      })
      
      setSchema(schema)
      setSelectedColumns(schema.columns.map(col => col.name))
      setSuccess('File uploaded and schema loaded successfully')
    } catch (error) {
      setError('Failed to upload file: ' + error.toString())
    } finally {
      setLoading(false)
    }
  }

  const handleLoadSchema = async () => {
    if (!flatFileConnection.fileName) {
      setError('Please select a file first')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const schema = await fileApi.getFileSchema(flatFileConnection)
      setSchema(schema)
      setSelectedColumns(schema.columns.map(col => col.name))
      setSuccess('Schema loaded successfully')
    } catch (error) {
      setError('Failed to load schema: ' + error.toString())
    } finally {
      setLoading(false)
    }
  }

  const handlePreview = async () => {
    if (!flatFileConnection.fileName) {
      setError('Please select a file first')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const data = await fileApi.previewData(flatFileConnection, 10)
      setPreviewData(data)
    } catch (error) {
      setError('Failed to preview data: ' + error.toString())
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">Flat File Upload</h2>
      
      <div className="space-y-4">
        <div>
          <label className="form-label">File</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:rounded-md file:border-0
              file:bg-primary-50 file:px-4 file:py-2
              file:text-sm file:font-semibold file:text-primary-700
              hover:file:bg-primary-100"
          />
        </div>

        <div>
          <label htmlFor="delimiter" className="form-label">Delimiter</label>
          <select
            id="delimiter"
            name="delimiter"
            className="form-select"
            value={flatFileConnection.delimiter}
            onChange={(e) => setFlatFileConnection({
              ...flatFileConnection,
              delimiter: e.target.value
            })}
          >
            <option value=",">Comma (CSV)</option>
            <option value="\t">Tab (TSV)</option>
            <option value=";">Semicolon</option>
            <option value="|">Pipe</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            id="hasHeader"
            name="hasHeader"
            type="checkbox"
            checked={flatFileConnection.hasHeader}
            onChange={(e) => setFlatFileConnection({
              ...flatFileConnection,
              hasHeader: e.target.checked
            })}
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="hasHeader" className="ml-2 block text-sm text-gray-700">
            File has header row
          </label>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            className="btn-primary"
            onClick={handleUpload}
          >
            Upload File
          </button>
          
          <button
            type="button"
            className="btn-secondary"
            onClick={handleLoadSchema}
          >
            Load Schema
          </button>
          
          <button
            type="button"
            className="btn-outline"
            onClick={handlePreview}
          >
            Preview Data
          </button>
        </div>

        {fileList.length > 0 && (
          <div className="mt-4">
            <h3 className="mb-2 text-sm font-medium text-gray-700">Uploaded Files</h3>
            <ul className="divide-y divide-gray-200 rounded-md border border-gray-200">
              {fileList.map((file) => (
                <li key={file.name} className="flex items-center justify-between py-2 pl-3 pr-4 text-sm">
                  <span className="truncate">{file.name}</span>
                  <span className="text-gray-500">{file.size} bytes</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default FileUploader