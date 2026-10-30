import React, { useState, useEffect } from 'react';
import Sidebar, { TopBar } from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Turnos from './components/Turnos';
import Odontograma from './components/Odontograma';
import { pacientesIniciales, turnosIniciales } from './data/mockData';

export default function App() {
  // Estado global de la aplicación persistido en localStorage
  const [vistaActual, setVistaActual] = useState('dashboard');
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  const [pacientes, setPacientes] = useState(() => {
    try {
      const guardados = localStorage.getItem('odonto_pacientes');
      return guardados ? JSON.parse(guardados) : pacientesIniciales;
    } catch {
      return pacientesIniciales;
    }
  });

  const [turnos, setTurnos] = useState(() => {
    try {
      const guardados = localStorage.getItem('odonto_turnos');
      return guardados ? JSON.parse(guardados) : turnosIniciales;
    } catch {
      return turnosIniciales;
    }
  });

  // Guardar automáticamente en localStorage ante cualquier modificación
  useEffect(() => {
    try {
      localStorage.setItem('odonto_pacientes', JSON.stringify(pacientes));
    } catch (e) {
      console.warn('No se pudo guardar pacientes en localStorage:', e);
    }
  }, [pacientes]);

  useEffect(() => {
    try {
      localStorage.setItem('odonto_turnos', JSON.stringify(turnos));
    } catch (e) {
      console.warn('No se pudo guardar turnos en localStorage:', e);
    }
  }, [turnos]);

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
