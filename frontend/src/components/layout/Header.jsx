import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-primary-700">ClickHouse Ingestion Tool</span>
          </Link>
          <nav className="flex space-x-4">
            <Link to="/" className="text-gray-700 hover:text-primary-600">Home</Link>
            <Link to="/clickhouse-to-flatfile" className="text-gray-700 hover:text-primary-600">
              ClickHouse to Flat File
            </Link>
            <Link to="/flatfile-to-clickhouse" className="text-gray-700 hover:text-primary-600">
              Flat File to ClickHouse
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header