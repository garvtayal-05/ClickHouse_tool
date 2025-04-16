import { Outlet } from 'react-router-dom'
import Header from './Header'

const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto flex-1 px-4 py-8">
        <Outlet />
      </main>
      <footer className="bg-gray-100 py-4 text-center text-sm text-gray-600">
        &copy; {new Date().getFullYear()} ClickHouse Ingestion Tool
      </footer>
    </div>
  )
}

export default MainLayout