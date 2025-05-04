import './App.css'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import MainContext from './components/MainContext'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex h-screen overflow-hidden bg-gray-100">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <MainContext />
      </div>
    </div>
  )
}

export default App
