import { useIngestion } from '../context/IngestionContext'
import FileUploader from '../components/flatfile/FileUploader'
import ColumnSelection from '../components/clickhouse/ColumnSelection'
import DataPreview from '../components/ingestion/DataPreview'
import IngestionOptions from '../components/ingestion/IngestionOptions'
import IngestionResult from '../components/ingestion/IngestionResult'
import Alert from '../components/common/Alert'
import Loader from '../components/common/Loader'

const FlatFileToClickHouse = () => {
  const { loading, error, success } = useIngestion()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Flat File to ClickHouse</h1>
      
      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}
      {loading && <Loader />}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <FileUploader />
          <ColumnSelection />
        </div>
        
        <div className="space-y-6 lg:col-span-2">
          <DataPreview />
          <IngestionOptions />
          <IngestionResult />
        </div>
      </div>
    </div>
  )
}

export default FlatFileToClickHouse