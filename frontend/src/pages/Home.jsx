import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="mx-auto max-w-4xl text-center">
      <h1 className="mb-8 text-3xl font-bold text-gray-800">Welcome to ClickHouse Ingestion Tool</h1>
      <p className="mb-8 text-lg text-gray-600">
        This application allows you to transfer data between ClickHouse databases and flat files in both directions.
      </p>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="card">
          <h2 className="mb-4 text-xl font-semibold text-primary-700">ClickHouse to Flat File</h2>
          <p className="mb-6 text-gray-600">
            Export data from your ClickHouse database to a flat file (CSV) format.
            You can select specific tables and columns to include in the export.
          </p>
          <Link to="/clickhouse-to-flatfile" className="btn-primary inline-block">
            Go to ClickHouse Export
          </Link>
        </div>
        
        <div className="card">
          <h2 className="mb-4 text-xl font-semibold text-primary-700">Flat File to ClickHouse</h2>
          <p className="mb-6 text-gray-600">
            Import data from a flat file (CSV) into your ClickHouse database.
            You can create new tables or insert into existing ones.
          </p>
          <Link to="/flatfile-to-clickhouse" className="btn-primary inline-block">
            Go to ClickHouse Import
          </Link>
        </div>
      </div>
      
      <div className="mt-12">
        <h3 className="mb-4 text-xl font-semibold text-gray-800">Features</h3>
        <ul className="mx-auto max-w-2xl space-y-2 text-left text-gray-700">
          <li className="flex items-start">
            <svg className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Bidirectional data flow between ClickHouse and flat files
          </li>
          <li className="flex items-start">
            <svg className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            JWT token authentication for ClickHouse
          </li>
          <li className="flex items-start">
            <svg className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Column selection for targeted data export/import
          </li>
          <li className="flex items-start">
            <svg className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Data preview before ingestion
          </li>
          <li className="flex items-start">
            <svg className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Support for multi-table joins in ClickHouse exports
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Home