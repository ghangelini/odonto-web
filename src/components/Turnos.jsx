import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Calendar,
  Clock,
  User,
  X,
  Check,
  Play,
  Filter,
} from 'lucide-react';

// ─── Utilidades de fecha ────────────────────────────────────────────────────
/**
 * Devuelve la fecha actual en formato YYYY-MM-DD en la zona horaria local.
 */
export const hoyLocal = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Devuelve la fecha de mañana en formato YYYY-MM-DD local.
 */
export const mananaLocal = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Devuelve un Set con las fechas de la semana actual (lunes a domingo) local.
 */
export const fechasDeLaSemanaLocal = () => {
  const ahora = new Date();
  const dia = ahora.getDay(); // 0=domingo
  const lunes = new Date(ahora);
  lunes.setDate(ahora.getDate() - (dia === 0 ? 6 : dia - 1));

  const fechas = new Set();
  for (let i = 0; i < 7; i++) {
    const d = new Date(lunes);
    d.setDate(lunes.getDate() + i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    fechas.add(`${year}-${month}-${day}`);
  }
  return fechas;
};

/**
 * Formatea una fecha ISO a texto legible en español (ej: "Lunes 27 de Octubre 2026").
 */
const formatearFecha = (fechaISO) => {
  const d = new Date(fechaISO + 'T12:00:00'); // evitar problemas de zona horaria
  const opciones = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const texto = d.toLocaleDateString('es-AR', opciones);
  // Capitalizar primera letra
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

// ─── Componente principal: Turnos ───────────────────────────────────────────
const Turnos = ({ turnos, setTurnos, pacientes }) => {
  // Estado del filtro activo: "hoy" | "manana" | "semana"
  const [filtroFecha, setFiltroFecha] = useState('hoy');
  // Término de búsqueda por nombre de paciente
  const [busqueda, setBusqueda] = useState('');
  // Controla la visibilidad del modal de nuevo turno
  const [mostrarModal, setMostrarModal] = useState(false);

  // Estado del formulario de nuevo turno
  const [nuevoTurno, setNuevoTurno] = useState({
    pacienteNombre: '',
    dni: '',
    fecha: hoyLocal(),
    hora: '',
    especialidad: 'Clínica Médica',
  });

  // ─── Filtrado de turnos ─────────────────────────────────────────────────
  const turnosFiltrados = useMemo(() => {
    let resultado = [...turnos];

    // Filtro por rango de fecha
    if (filtroFecha === 'hoy') {
      const fechaHoy = hoyLocal();
      resultado = resultado.filter((t) => t.fecha === fechaHoy);
    } else if (filtroFecha === 'manana') {
      const fechaManana = mananaLocal();
      resultado = resultado.filter((t) => t.fecha === fechaManana);
    } else if (filtroFecha === 'semana') {
      const fechasSemana = fechasDeLaSemanaLocal();
      resultado = resultado.filter((t) => fechasSemana.has(t.fecha));
    }

    // Filtro por búsqueda de nombre de paciente
    if (busqueda.trim()) {
      const termino = busqueda.toLowerCase();
      resultado = resultado.filter(
        (t) =>
          t.pacienteNombre.toLowerCase().includes(termino) ||
          t.dni.includes(termino)
      );
    }

    // Ordenar por fecha y hora
    resultado.sort((a, b) => {
      if (a.fecha !== b.fecha) return a.fecha.localeCompare(b.fecha);
      return a.hora.localeCompare(b.hora);
    });

    return resultado;
  }, [turnos, filtroFecha, busqueda]);

  // ─── Agrupación por fecha ───────────────────────────────────────────────
  const turnosAgrupados = useMemo(() => {
    const grupos = {};
    turnosFiltrados.forEach((turno) => {
      if (!grupos[turno.fecha]) {
        grupos[turno.fecha] = [];
      }
      grupos[turno.fecha].push(turno);
    });
    return grupos;
  }, [turnosFiltrados]);

  // ─── Cambiar estado de un turno ─────────────────────────────────────────
  const cambiarEstado = (id, nuevoEstado) => {
    setTurnos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, estado: nuevoEstado } : t))
    );
  };

  // ─── Guardar nuevo turno ────────────────────────────────────────────────
  const guardarTurno = (e) => {
    e.preventDefault();
    const id = Math.max(0, ...turnos.map((t) => t.id)) + 1;

    // Intentar vincular con paciente existente por DNI
    const pacienteExistente = pacientes?.find((p) => p.dni === nuevoTurno.dni);

    const turnoNuevo = {
      id,
      pacienteId: pacienteExistente?.id || null,
      pacienteNombre: nuevoTurno.pacienteNombre,
      dni: nuevoTurno.dni,
      fecha: nuevoTurno.fecha,
      hora: nuevoTurno.hora,
      especialidad: nuevoTurno.especialidad,
      estado: 'Pendiente',
    };

    setTurnos((prev) => [...prev, turnoNuevo]);
    setMostrarModal(false);
    // Resetear formulario
    setNuevoTurno({
      pacienteNombre: '',
      dni: '',
      fecha: hoyLocal(),
      hora: '',
      especialidad: 'Clínica Médica',
    });
  };

  // ─── Clases de badge de especialidad ────────────────────────────────────
  const badgeEspecialidad = (especialidad) => {
    if (especialidad === 'Odontología') {
      return 'bg-teal-100 text-teal-800 border border-teal-200';
    }
    return 'bg-blue-100 text-blue-800 border border-blue-200';
  };

  // ─── Clases de badge de estado ──────────────────────────────────────────
  const badgeEstado = (estado) => {
    switch (estado) {
      case 'Pendiente':
        return 'bg-slate-100 text-slate-700 border border-slate-200';
      case 'En curso':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'Finalizado':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  // ─── Botones de filtro de fecha ─────────────────────────────────────────
  const filtros = [
    { key: 'hoy', label: 'Hoy' },
    { key: 'manana', label: 'Mañana' },
    { key: 'semana', label: 'Semana' },
  ];

  return (
    <div className="space-y-6">
      {/* ═══════ Encabezado ═══════ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="w-7 h-7 text-blue-600" />
            Gestión de Turnos
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Administrá los turnos del consultorio
          </p>
        </div>
        <button
          onClick={() => setMostrarModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Nuevo Turno
        </button>
      </div>

      {/* ═══════ Controles de filtro ═══════ */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Filtros de fecha */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <Filter className="w-4 h-4 text-gray-500 ml-2 mr-1" />
            {filtros.map((f) => (
              <button
                key={f.key}
                onClick={() => setFiltroFecha(f.key)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 cursor-pointer ${
                  filtroFecha === f.key
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Barra de búsqueda */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por paciente o DNI..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Contador de resultados */}
          <span className="text-sm text-gray-500 whitespace-nowrap">
            {turnosFiltrados.length} turno{turnosFiltrados.length !== 1 && 's'}
          </span>
        </div>
      </div>

      {/* ═══════ Listado de turnos agrupados por fecha ═══════ */}
      {Object.keys(turnosAgrupados).length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No hay turnos para mostrar</p>
          <p className="text-gray-400 text-sm mt-1">
            Ajustá los filtros o creá un nuevo turno
          </p>
        </div>
      ) : (
        Object.entries(turnosAgrupados).map(([fecha, turnosDelDia]) => (
          <div key={fecha} className="space-y-3">
            {/* Encabezado de fecha */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-800">
                  {formatearFecha(fecha)}
                </span>
              </div>
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">
                {turnosDelDia.length} turno{turnosDelDia.length !== 1 && 's'}
              </span>
            </div>

            {/* Tabla de turnos (desktop) / Cards (mobile) */}
            {/* ── Vista Desktop ── */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Hora
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Paciente
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      DNI
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Especialidad
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {turnosDelDia.map((turno) => (
                    <tr
                      key={turno.id}
                      className="hover:bg-blue-50/30 transition-colors duration-150"
                    >
                      {/* Hora */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold text-gray-800">
                            {turno.hora}
                          </span>
                        </div>
                      </td>

                      {/* Paciente */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-800">
                            {turno.pacienteNombre}
                          </span>
                        </div>
                      </td>

                      {/* DNI */}
                      <td className="px-5 py-3.5 text-sm text-gray-600">
                        {turno.dni}
                      </td>

                      {/* Especialidad */}
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeEspecialidad(turno.especialidad)}`}
                        >
                          {turno.especialidad}
                        </span>
                      </td>

                      {/* Estado */}
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeEstado(turno.estado)}`}
                        >
                          {turno.estado}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="px-5 py-3.5 text-right">
                        {turno.estado === 'Pendiente' && (
                          <button
                            onClick={() => cambiarEstado(turno.id, 'En curso')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5" />
                            Iniciar
                          </button>
                        )}
                        {turno.estado === 'En curso' && (
                          <button
                            onClick={() => cambiarEstado(turno.id, 'Finalizado')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Finalizar
                          </button>
                        )}
                        {turno.estado === 'Finalizado' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-600">
                            <Check className="w-4 h-4" />
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Vista Mobile (Cards) ── */}
            <div className="md:hidden space-y-3">
              {turnosDelDia.map((turno) => (
                <div
                  key={turno.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3"
                >
                  {/* Fila superior: hora + estado */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-gray-800">{turno.hora}</span>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeEstado(turno.estado)}`}
                    >
                      {turno.estado}
                    </span>
                  </div>

                  {/* Datos del paciente */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {turno.pacienteNombre}
                      </p>
                      <p className="text-sm text-gray-500">DNI: {turno.dni}</p>
                    </div>
                  </div>

                  {/* Especialidad + Acción */}
                  <div className="flex items-center justify-between pt-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeEspecialidad(turno.especialidad)}`}
                    >
                      {turno.especialidad}
                    </span>

                    {turno.estado === 'Pendiente' && (
                      <button
                        onClick={() => cambiarEstado(turno.id, 'En curso')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" />
                        Iniciar
                      </button>
                    )}
                    {turno.estado === 'En curso' && (
                      <button
                        onClick={() => cambiarEstado(turno.id, 'Finalizado')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Finalizar
                      </button>
                    )}
                    {turno.estado === 'Finalizado' && (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                        <Check className="w-4 h-4" />
                        Completado
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* ═══════ Modal: Nuevo Turno ═══════ */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMostrarModal(false)}
          />

          {/* Card del modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-5 animate-in fade-in zoom-in-95">
            {/* Encabezado del modal */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Nuevo Turno
              </h3>
              <button
                onClick={() => setMostrarModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <hr className="border-gray-200" />

            {/* Formulario */}
            <form onSubmit={guardarTurno} className="space-y-4">
              {/* Nombre del paciente */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del paciente
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={nuevoTurno.pacienteNombre}
                    onChange={(e) =>
                      setNuevoTurno({ ...nuevoTurno, pacienteNombre: e.target.value })
                    }
                    placeholder="Ej: María González"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* DNI */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  DNI
                </label>
                <input
                  type="text"
                  required
                  value={nuevoTurno.dni}
                  onChange={(e) =>
                    setNuevoTurno({ ...nuevoTurno, dni: e.target.value })
                  }
                  placeholder="Ej: 28456789"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Fecha y Hora en fila */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="date"
                      required
                      value={nuevoTurno.fecha}
                      onChange={(e) =>
                        setNuevoTurno({ ...nuevoTurno, fecha: e.target.value })
                      }
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hora
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="time"
                      required
                      value={nuevoTurno.hora}
                      onChange={(e) =>
                        setNuevoTurno({ ...nuevoTurno, hora: e.target.value })
                      }
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Especialidad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Especialidad
                </label>
                <select
                  value={nuevoTurno.especialidad}
                  onChange={(e) =>
                    setNuevoTurno({ ...nuevoTurno, especialidad: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                >
                  <option value="Clínica Médica">Clínica Médica</option>
                  <option value="Odontología">Odontología</option>
                </select>
              </div>

              <hr className="border-gray-200" />

              {/* Botones de acción */}
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setMostrarModal(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  Guardar Turno
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Turnos;
