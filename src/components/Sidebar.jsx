import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  Smile,
  Menu,
  X,
  Stethoscope,
  LogOut,
  Settings,
  Bell,
  RotateCcw,
} from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'turnos', label: 'Turnos', icon: Calendar },
  { id: 'odontograma', label: 'Odontograma', icon: Smile },
];

export default function Sidebar({ vistaActual, setVistaActual, sidebarAbierto, setSidebarAbierto }) {
  return (
    <>
      {/* Overlay para mobile */}
      {sidebarAbierto && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarAbierto(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-gradient-to-b from-blue-800 to-blue-900
          text-white flex flex-col transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${sidebarAbierto ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo / Header */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-blue-700/50">
          <div className="w-10 h-10 bg-teal-400 rounded-xl flex items-center justify-center shadow-lg">
            <Stethoscope className="w-6 h-6 text-blue-900" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold tracking-tight leading-tight">Odonto-Web</h1>
            <p className="text-xs text-blue-300">Gestión Odontológica</p>
          </div>
          <button
            className="lg:hidden p-1 hover:bg-blue-700 rounded-lg transition-colors"
            onClick={() => setSidebarAbierto(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = vistaActual === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setVistaActual(item.id);
                  setSidebarAbierto(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 group
                  ${isActive
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-blue-200 hover:bg-white/10 hover:text-white'}
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-teal-300' : 'text-blue-300 group-hover:text-teal-300'}`} />
                {item.label}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 bg-teal-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer del sidebar: Usuario Administrativo / Asistente */}
        <div className="px-3 py-4 border-t border-blue-700/50 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2.5 bg-blue-950/40 rounded-xl border border-blue-700/40">
            <div className="w-9 h-9 bg-teal-400/20 text-teal-300 rounded-xl flex items-center justify-center font-bold text-xs ring-1 ring-teal-400/30">
              ADM
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">Recepción Central</p>
              <p className="text-[11px] text-teal-300/90 font-medium truncate">Usuario Administrativo</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// Top bar component para usar en el layout
export function TopBar({ setSidebarAbierto, vistaActual, onRestablecerDemo }) {
  const currentPage = menuItems.find(m => m.id === vistaActual);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200/60 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
            onClick={() => setSidebarAbierto(true)}
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {currentPage?.label || 'Dashboard'}
            </h2>
            <p className="text-xs text-gray-400">
              {new Date().toLocaleDateString('es-AR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onRestablecerDemo && (
            <button
              onClick={onRestablecerDemo}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-rose-700 bg-slate-100 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl transition-all cursor-pointer shadow-2xs"
              title="Restablecer datos demo a fábrica"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restablecer Mock</span>
            </button>
          )}

          <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <Bell className="w-5 h-5 text-gray-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <Settings className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>
    </header>
  );
}
