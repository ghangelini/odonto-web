import { useState, useMemo } from 'react';
import { Search, User, ChevronDown, X, Check, Info } from 'lucide-react';
import { arcadaSuperior, arcadaInferior, hallazgosDentales } from '../data/mockData';

// ─────────────────────────────────────────────────────────────
// Componente Diente: representación visual de un diente individual
// ─────────────────────────────────────────────────────────────
function Diente({ numero, hallazgo, onClick, isSelected }) {
  // Color de relleno: si hay hallazgo usa su color, sino blanco
  const fillColor = hallazgo ? hallazgo.color : '#ffffff';
  // Determinar si el texto debe ser claro u oscuro según el fondo
  const textColor = hallazgo && hallazgo.hallazgo !== 'Sano' ? '#ffffff' : '#374151';
  // Borde más marcado si está seleccionado
  const borderColor = isSelected ? '#1e40af' : (hallazgo ? hallazgo.color : '#d1d5db');

  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center cursor-pointer transition-all duration-200 hover:scale-110 hover:z-10 group"
      title={`Diente ${numero}${hallazgo ? ` — ${hallazgo.hallazgo}` : ''}`}
    >
      {/* Corona del diente */}
      <div
        className={`w-10 h-8 rounded-t-lg border-2 flex items-center justify-center text-xs font-bold transition-all duration-200 
          ${isSelected ? 'ring-2 ring-blue-800 ring-offset-1' : ''} 
          group-hover:shadow-lg group-hover:shadow-blue-200/50`}
        style={{
          backgroundColor: fillColor,
          borderColor: borderColor,
          color: textColor,
        }}
      >
        {numero}
      </div>
      {/* Raíz del diente */}
      <div
        className="w-4 h-4 rounded-b-md border-x-2 border-b-2 transition-all duration-200"
        style={{
          backgroundColor: fillColor,
          borderColor: borderColor,
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Componente ModalDiente: modal de detalle para un diente
// ─────────────────────────────────────────────────────────────
function ModalDiente({ diente, hallazgoActual, onAplicar, onCerrar }) {
  const [seleccion, setSeleccion] = useState(hallazgoActual?.hallazgo || null);

  const handleAplicar = () => {
    onAplicar(diente, seleccion);
  };

  return (
    // Overlay oscuro
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-gray-100 animate-in">
        {/* Encabezado */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-800 to-teal-600 rounded-t-2xl">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Info size={20} />
            Diente {diente}
          </h3>
          <button
            onClick={onCerrar}
            className="text-white/80 hover:text-white transition-colors hover:bg-white/20 rounded-full p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Estado actual */}
        <div className="px-6 pt-4 pb-2">
          <p className="text-sm text-gray-500 mb-1">Estado actual:</p>
          {hallazgoActual ? (
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium text-white"
              style={{ backgroundColor: hallazgoActual.color }}
            >
              {hallazgoActual.hallazgo}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
              Sin hallazgos
            </span>
          )}
        </div>

        {/* Opciones de hallazgo */}
        <div className="px-6 py-4 space-y-2">
          <p className="text-sm font-semibold text-gray-700 mb-2">Seleccionar hallazgo:</p>
          {hallazgosDentales.map((h) => (
            <button
              key={h.valor}
              onClick={() => setSeleccion(h.valor)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 transition-all duration-150 text-left
                ${seleccion === h.valor
                  ? 'border-blue-700 bg-blue-50 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
            >
              {/* Indicador de color */}
              <span
                className="w-5 h-5 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                style={{ backgroundColor: h.color }}
              />
              <span className="text-sm font-medium text-gray-700 flex-1">{h.label}</span>
              {seleccion === h.valor && (
                <Check size={16} className="text-blue-700 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 px-6 pb-5 pt-2">
          <button
            onClick={onCerrar}
            className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={handleAplicar}
            disabled={!seleccion}
            className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-800 to-blue-600 text-white font-medium text-sm 
              hover:from-blue-900 hover:to-blue-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Componente principal: Odontograma
// ─────────────────────────────────────────────────────────────
export default function Odontograma({ pacientes, setPacientes }) {
  // Estado: paciente seleccionado, diente seleccionado, búsqueda, observaciones, dropdown abierto
  const [pacienteSeleccionadoId, setPacienteSeleccionadoId] = useState(null);
  const [dienteSeleccionado, setDienteSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [dropdownAbierto, setDropdownAbierto] = useState(false);

  // Paciente actualmente seleccionado
  const paciente = useMemo(
    () => pacientes.find((p) => p.id === pacienteSeleccionadoId) || null,
    [pacientes, pacienteSeleccionadoId]
  );

  // Filtrar pacientes en el dropdown según búsqueda
  const pacientesFiltrados = useMemo(
    () =>
      pacientes.filter(
        (p) =>
          `${p.nombre} ${p.apellido}`.toLowerCase().includes(busqueda.toLowerCase()) ||
          p.dni.includes(busqueda)
      ),
    [pacientes, busqueda]
  );

  // Estadísticas de hallazgos del paciente seleccionado
  const estadisticas = useMemo(() => {
    if (!paciente) return {};
    const stats = {};
    hallazgosDentales.forEach((h) => {
      if (h.valor !== 'Sano') stats[h.valor] = 0;
    });
    Object.values(paciente.odontograma || {}).forEach((val) => {
      if (val.hallazgo && stats[val.hallazgo] !== undefined) {
        stats[val.hallazgo]++;
      }
    });
    return stats;
  }, [paciente]);

  // Seleccionar paciente desde el dropdown
  const seleccionarPaciente = (p) => {
    setPacienteSeleccionadoId(p.id);
    setDropdownAbierto(false);
    setBusqueda('');
    setObservaciones('');
    setDienteSeleccionado(null);
  };

  // Aplicar un hallazgo a un diente del paciente seleccionado
  const aplicarHallazgo = (numeroDiente, hallazgoValor) => {
    if (!paciente) return;

    setPacientes((prev) =>
      prev.map((p) => {
        if (p.id !== paciente.id) return p;

        const nuevoOdontograma = { ...p.odontograma };

        if (hallazgoValor === 'Sano') {
          // "Sano" limpia el hallazgo del diente
          delete nuevoOdontograma[numeroDiente];
        } else {
          const hallazgoObj = hallazgosDentales.find((h) => h.valor === hallazgoValor);
          nuevoOdontograma[numeroDiente] = {
            hallazgo: hallazgoObj.valor,
            color: hallazgoObj.color,
          };
        }

        return { ...p, odontograma: nuevoOdontograma };
      })
    );

    setDienteSeleccionado(null);
  };

  return (
    <div className="space-y-6">
      {/* ───── Selector de Paciente ───── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
          <User size={22} className="text-teal-600" />
          Odontograma — Ficha Dental
        </h2>

        {/* Dropdown con búsqueda */}
        <div className="relative max-w-md">
          <label className="block text-sm font-medium text-gray-600 mb-1.5">
            Seleccionar paciente
          </label>
          <button
            onClick={() => setDropdownAbierto(!dropdownAbierto)}
            className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-left 
              hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
          >
            {paciente ? (
              <span className="text-gray-800 font-medium">
                {paciente.nombre} {paciente.apellido}{' '}
                <span className="text-gray-400 font-normal">— DNI {paciente.dni}</span>
              </span>
            ) : (
              <span className="text-gray-400">Seleccione un paciente...</span>
            )}
            <ChevronDown
              size={18}
              className={`text-gray-400 transition-transform ${dropdownAbierto ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Panel del dropdown */}
          {dropdownAbierto && (
            <div className="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
              {/* Campo de búsqueda */}
              <div className="p-2 border-b border-gray-100">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar por nombre o DNI..."
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 rounded-lg text-sm border border-gray-200 outline-none focus:border-blue-400 transition-colors"
                    autoFocus
                  />
                </div>
              </div>
              {/* Lista de pacientes */}
              <div className="max-h-56 overflow-y-auto">
                {pacientesFiltrados.length > 0 ? (
                  pacientesFiltrados.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => seleccionarPaciente(p)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 transition-colors
                        ${pacienteSeleccionadoId === p.id ? 'bg-blue-50 border-l-4 border-blue-600' : 'border-l-4 border-transparent'}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {p.nombre[0]}
                        {p.apellido[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {p.nombre} {p.apellido}
                        </p>
                        <p className="text-xs text-gray-400">DNI {p.dni}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4">Sin resultados</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ───── Carta Dental (solo si hay paciente seleccionado) ───── */}
      {paciente && (
        <>
          {/* Estadísticas resumen */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {hallazgosDentales
              .filter((h) => h.valor !== 'Sano')
              .map((h) => (
                <div
                  key={h.valor}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 flex items-center gap-3"
                >
                  <span
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm"
                    style={{ backgroundColor: h.color }}
                  >
                    {estadisticas[h.valor] || 0}
                  </span>
                  <span className="text-sm font-medium text-gray-600">{h.label}</span>
                </div>
              ))}
          </div>

          {/* Odontograma visual */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-6 text-center">
              Carta Dental —{' '}
              <span className="text-teal-600">
                {paciente.nombre} {paciente.apellido}
              </span>
            </h3>

            {/* Contenedor con scroll horizontal en pantallas pequeñas */}
            <div className="overflow-x-auto pb-4">
              <div className="min-w-[700px] mx-auto flex flex-col items-center gap-1">
                {/* Etiqueta Arcada Superior */}
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                  Arcada Superior
                </p>

                {/* Fila de dientes superiores */}
                <div className="flex items-end gap-1 relative">
                  {arcadaSuperior.map((num, idx) => (
                    <div key={num} className="relative">
                      {/* Línea media vertical entre diente 11 y 21 */}
                      {idx === 8 && (
                        <div className="absolute -left-[3px] top-0 bottom-0 w-[2px] bg-blue-800/30 rounded-full" />
                      )}
                      <Diente
                        numero={num}
                        hallazgo={paciente.odontograma?.[num] || null}
                        onClick={() => setDienteSeleccionado(num)}
                        isSelected={dienteSeleccionado === num}
                      />
                    </div>
                  ))}
                </div>

                {/* Línea divisoria horizontal (midline) */}
                <div className="w-full max-w-[680px] flex items-center gap-2 my-2">
                  <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-blue-800/30 to-blue-800/30 rounded-full" />
                  <span className="text-[10px] font-bold text-blue-800/40 uppercase tracking-wider">
                    Línea Media
                  </span>
                  <div className="flex-1 h-[2px] bg-gradient-to-l from-transparent via-blue-800/30 to-blue-800/30 rounded-full" />
                </div>

                {/* Fila de dientes inferiores */}
                <div className="flex items-start gap-1 relative">
                  {arcadaInferior.map((num, idx) => (
                    <div key={num} className="relative">
                      {/* Línea media vertical entre diente 41 y 31 */}
                      {idx === 8 && (
                        <div className="absolute -left-[3px] top-0 bottom-0 w-[2px] bg-blue-800/30 rounded-full" />
                      )}
                      <Diente
                        numero={num}
                        hallazgo={paciente.odontograma?.[num] || null}
                        onClick={() => setDienteSeleccionado(num)}
                        isSelected={dienteSeleccionado === num}
                      />
                    </div>
                  ))}
                </div>

                {/* Etiqueta Arcada Inferior */}
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-2">
                  Arcada Inferior
                </p>
              </div>
            </div>

            {/* ───── Leyenda de colores ───── */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Leyenda
              </p>
              <div className="flex flex-wrap gap-4">
                {hallazgosDentales
                  .filter((h) => h.valor !== 'Sano')
                  .map((h) => (
                    <div key={h.valor} className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full shadow-sm border border-white"
                        style={{ backgroundColor: h.color }}
                      />
                      <span className="text-xs text-gray-600 font-medium">{h.label}</span>
                    </div>
                  ))}
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-white border-2 border-gray-300" />
                  <span className="text-xs text-gray-600 font-medium">Sin hallazgos</span>
                </div>
              </div>
            </div>
          </div>

          {/* ───── Observaciones ───── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Observaciones Odontológicas Generales
            </label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={4}
              placeholder="Ingrese observaciones generales sobre el estado dental del paciente..."
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm text-gray-700 
                placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 
                transition-all resize-none"
            />
          </div>

          {/* ───── Modal de detalle del diente ───── */}
          {dienteSeleccionado !== null && (
            <ModalDiente
              diente={dienteSeleccionado}
              hallazgoActual={paciente.odontograma?.[dienteSeleccionado] || null}
              onAplicar={aplicarHallazgo}
              onCerrar={() => setDienteSeleccionado(null)}
            />
          )}
        </>
      )}

      {/* Mensaje cuando no hay paciente seleccionado */}
      {!paciente && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center">
            <Info size={28} className="text-blue-600" />
          </div>
          <p className="text-gray-500 font-medium">
            Seleccione un paciente para ver su odontograma
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Podrá visualizar y editar la carta dental de cada paciente
          </p>
        </div>
      )}
    </div>
  );
}
