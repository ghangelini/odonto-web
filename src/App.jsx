import React, { useState } from 'react';
import Sidebar, { TopBar } from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Turnos from './components/Turnos';
import Odontograma from './components/Odontograma';
import { pacientesIniciales, turnosIniciales } from './data/mockData';

export default function App() {
  // Estado global de la aplicación
  const [vistaActual, setVistaActual] = useState('dashboard');
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [pacientes, setPacientes] = useState(pacientesIniciales);
  const [turnos, setTurnos] = useState(turnosIniciales);

  // Renderiza la vista activa
  const renderVista = () => {
    switch (vistaActual) {
      case 'dashboard':
        return (
          <Dashboard
            pacientes={pacientes}
            turnos={turnos}
            setVistaActual={setVistaActual}
          />
        );
      case 'turnos':
        return (
          <Turnos
            turnos={turnos}
            setTurnos={setTurnos}
            pacientes={pacientes}
          />
        );
      case 'odontograma':
        return (
          <Odontograma
            pacientes={pacientes}
            setPacientes={setPacientes}
          />
        );
      default:
        return (
          <Dashboard
            pacientes={pacientes}
            turnos={turnos}
            setVistaActual={setVistaActual}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar de navegación */}
      <Sidebar
        vistaActual={vistaActual}
        setVistaActual={setVistaActual}
        sidebarAbierto={sidebarAbierto}
        setSidebarAbierto={setSidebarAbierto}
      />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          setSidebarAbierto={setSidebarAbierto}
          vistaActual={vistaActual}
        />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {renderVista()}
        </main>
      </div>
    </div>
  );
}
