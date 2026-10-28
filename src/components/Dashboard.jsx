import React, { useMemo } from 'react';
import {
  Calendar,
  Users,
  ClipboardCheck,
  Clock,
  ArrowRight,
  Smile,
  TrendingUp,
} from 'lucide-react';

// ────────────────────────────────────────────────────────────
// Dashboard – Vista principal del consultorio odontológico
// Muestra KPIs del día, turnos de hoy y resumen odontológico.
// ────────────────────────────────────────────────────────────

const HOY = '2026-10-27'; // Fecha de referencia para la demo

// ── Componente tarjeta KPI ──────────────────────────────────
function KpiCard({ icono: Icono, valor, etiqueta, colorClase }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
      {/* Ícono con fondo de color */}
      <div className={`${colorClase} rounded-lg p-3 flex-shrink-0`}>
        <Icono className="w-6 h-6 text-white" />
      </div>

      {/* Valor numérico y etiqueta */}
      <div>
        <p className="text-2xl font-bold text-gray-800">{valor}</p>
        <p className="text-sm text-gray-500">{etiqueta}</p>
      </div>
    </div>
  );
}

// ── Badge de estado del turno ───────────────────────────────
function EstadoBadge({ estado }) {
  const estilos = {
    Finalizado: 'bg-emerald-100 text-emerald-700',
    'En curso': 'bg-amber-100 text-amber-700',
    Pendiente: 'bg-gray-100 text-gray-600',
  };

  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${estilos[estado] || 'bg-gray-100 text-gray-600'}`}
    >
      {estado}
    </span>
  );
}

// ── Componente principal Dashboard ──────────────────────────
export default function Dashboard({ pacientes, turnos, setVistaActual }) {
  // Filtrar turnos del día actual
  const turnosHoy = useMemo(
    () => turnos.filter((t) => t.fecha === HOY),
    [turnos]
  );

  // ── Cálculos de KPIs ──
  const totalTurnosHoy = turnosHoy.length;
  const pacientesAtendidos = turnosHoy.filter((t) => t.estado === 'Finalizado').length;
  const totalPacientes = pacientes.length;
  const proximosTurnos = turnosHoy.filter((t) => t.estado === 'Pendiente').length;

  // ── Resumen odontológico: hallazgos dentales totales ──
  const resumenOdontologico = useMemo(() => {
    const contadores = { Caries: 0, Restauración: 0, Extracción: 0, Implante: 0 };
    pacientes.forEach((p) => {
      Object.values(p.odontograma || {}).forEach((val) => {
        if (val.hallazgo && contadores[val.hallazgo] !== undefined) {
          contadores[val.hallazgo]++;
        }
      });
    });
    return contadores;
  }, [pacientes]);

  // ── Pacientes con más hallazgos ──
  const pacientesConHallazgos = useMemo(() => {
    return pacientes
      .map((p) => ({
        id: p.id,
        nombre: `${p.nombre} ${p.apellido}`,
        hallazgos: Object.keys(p.odontograma || {}).length,
        obraSocial: p.obraSocial,
      }))
      .filter((p) => p.hallazgos > 0)
      .sort((a, b) => b.hallazgos - a.hallazgos)
      .slice(0, 5);
  }, [pacientes]);

  // ── Configuración de las tarjetas KPI ──
  const kpis = [
    {
      icono: Calendar,
      valor: totalTurnosHoy,
      etiqueta: 'Turnos del Día',
      colorClase: 'bg-blue-600',
    },
    {
      icono: ClipboardCheck,
      valor: pacientesAtendidos,
      etiqueta: 'Pacientes Atendidos',
      colorClase: 'bg-emerald-600',
    },
    {
      icono: Users,
      valor: totalPacientes,
      etiqueta: 'Total Pacientes',
      colorClase: 'bg-teal-600',
    },
    {
      icono: Clock,
      valor: proximosTurnos,
      etiqueta: 'Turnos Pendientes',
      colorClase: 'bg-amber-500',
    },
  ];

  // Colores para los hallazgos
  const coloresHallazgo = {
    Caries: '#ef4444',
    Restauración: '#3b82f6',
    Extracción: '#6b7280',
    Implante: '#8b5cf6',
  };

  return (
    <div className="space-y-6">
      {/* ── Encabezado ─────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <TrendingUp className="w-7 h-7 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Resumen general del consultorio
          </p>
        </div>
      </div>

      {/* ── Fila de tarjetas KPI ───────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <KpiCard key={idx} {...kpi} />
        ))}
      </div>

      {/* ── Contenido: dos columnas ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ─── Turnos de Hoy ──────────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Cabecera de la tarjeta */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-800">
                Turnos de Hoy
              </h2>
            </div>
            <button
              onClick={() => setVistaActual('turnos')}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Ver todos
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Lista de turnos */}
          <div className="divide-y divide-gray-50">
            {turnosHoy.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">
                No hay turnos para hoy.
              </p>
            ) : (
              turnosHoy.map((turno) => (
                <div
                  key={turno.id}
                  className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/60 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Hora */}
                    <span className="text-sm font-semibold text-blue-700 bg-blue-50 rounded-md px-2 py-1 flex-shrink-0">
                      {turno.hora}
                    </span>

                    {/* Info del paciente */}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {turno.pacienteNombre}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {turno.especialidad}
                      </p>
                    </div>
                  </div>

                  {/* Badge de estado */}
                  <EstadoBadge estado={turno.estado} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* ─── Resumen Odontológico ─────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Cabecera */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Smile className="w-5 h-5 text-teal-600" />
              <h2 className="text-lg font-semibold text-gray-800">
                Resumen Odontológico
              </h2>
            </div>
            <button
              onClick={() => setVistaActual('odontograma')}
              className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-800 font-medium transition-colors"
            >
              Ver odontogramas
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="px-5 py-4 space-y-4">
            {/* Barras de hallazgos */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Hallazgos totales registrados
              </p>
              <div className="space-y-3">
                {Object.entries(resumenOdontologico).map(([tipo, cantidad]) => {
                  const maxVal = Math.max(...Object.values(resumenOdontologico), 1);
                  const porcentaje = (cantidad / maxVal) * 100;
                  return (
                    <div key={tipo}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: coloresHallazgo[tipo] }}
                          />
                          <span className="text-sm text-gray-700 font-medium">{tipo}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-800">{cantidad}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${porcentaje}%`,
                            backgroundColor: coloresHallazgo[tipo],
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pacientes con hallazgos */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Pacientes con tratamientos
              </p>
              <div className="space-y-1.5">
                {pacientesConHallazgos.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-teal-100 rounded-full flex items-center justify-center">
                        <Smile className="w-3.5 h-3.5 text-teal-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{p.nombre}</span>
                    </div>
                    <span className="text-xs font-medium bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">
                      {p.hallazgos} {p.hallazgos === 1 ? 'hallazgo' : 'hallazgos'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
