import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DatosPrincipales from './host/home/add/datosprincipales'; // Corrected import path
// Importa tus otros componentes

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/host/home/add/datosprincipales" element={<DatosPrincipales />} />
        {/* Define tus otras rutas aquí */}
      </Routes>
    </BrowserRouter>
  );
}

export default App; // Added export