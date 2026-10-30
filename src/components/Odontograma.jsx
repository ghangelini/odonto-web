import { useState, useMemo } from 'react';
import { 
  Search, User, ChevronDown, X, Check, Activity, 
  RotateCcw, Baby, Sparkles, AlertCircle, FileText, Stethoscope, Camera
} from 'lucide-react';
import ModalEscanerIA from './ModalEscanerIA';
import { 
  arcadaSuperiorAdulto, 
  arcadaInferiorAdulto, 
  arcadaSuperiorInfantil, 
  arcadaInferiorInfantil, 
  hallazgosDentales,
  carasDentales 
} from '../data/mockData';

// ─────────────────────────────────────────────────────────────
// Componente DienteGeometrico: Representación clínica con 5 caras
// Geometría trapezoidal profesional (Vestibular, Palatina/Lingual, Mesial, Distal, Oclusal)
// ─────────────────────────────────────────────────────────────
function DienteGeometrico({ numero, dataDiente, isSelected, onClick }) {
  // Normalizar datos del diente (soporta formato simplificado anterior y formato multicara)
  const estadoGeneral = dataDiente?.hallazgoGeneral || (typeof dataDiente?.hallazgo === 'string' ? dataDiente.hallazgo : null);
  const caras = dataDiente?.caras || {};

  // Color de una superficie específica
  const getColorCara = (caraKey) => {
    if (estadoGeneral === 'Extracción') return '#374151'; // Tachado / ausente
    if (estadoGeneral === 'Implante') return '#0891b2';
    if (estadoGeneral === 'Corona') return '#d97706';
    
    // Si la cara individual tiene hallazgo
    const hallazgoCara = caras[caraKey];
    if (hallazgoCara) {
      const hObj = hallazgosDentales.find(h => h.valor === hallazgoCara);
      return hObj ? hObj.color : '#ffffff';
    }

    // Compatibilidad con registros antiguos donde hallazgo aplicaba a todo el diente
    if (typeof dataDiente?.hallazgo === 'string') {
      const hObj = hallazgosDentales.find(h => h.valor === dataDiente.hallazgo);
      return hObj ? hObj.color : '#ffffff';
    }

    return '#ffffff';
  };

  const isAusente = estadoGeneral === 'Extracción';
  const isCorona = estadoGeneral === 'Corona';
  const isEndo = estadoGeneral === 'Endodoncia';
  const isImplante = estadoGeneral === 'Implante';

  return (
    <div 
      onClick={onClick}
      className={`flex flex-col items-center group cursor-pointer transition-all duration-200 select-none ${
        isSelected ? 'scale-110 z-20' : 'hover:scale-105 hover:z-10'
      }`}
      title={`Pieza ${numero}${estadoGeneral ? ` — ${estadoGeneral}` : ''}`}
    >
      {/* Número FDI de la pieza */}
      <span className={`text-[11px] font-mono font-bold mb-1 transition-colors ${
        isSelected ? 'text-blue-700 underline font-black' : 'text-slate-600 group-hover:text-blue-600'
      }`}>
        {numero}
      </span>

      {/* Esquema geométrico anatómico (SVG de 5 caras) */}
      <div className={`relative p-0.5 rounded-lg transition-all ${
        isSelected ? 'ring-2 ring-blue-600 ring-offset-2 shadow-lg bg-blue-50/50' : 'group-hover:shadow-md'
      }`}>
        <svg 
          viewBox="0 0 60 60" 
          className="w-9 h-9 sm:w-10 sm:h-10 transition-transform drop-shadow-sm"
        >
          {/* Cara 1: Vestibular (Superior) */}
          <polygon
            points="5,5 55,5 42,18 18,18"
            fill={getColorCara('vestibular')}
            stroke="#94a3b8"
            strokeWidth="1.5"
            className="transition-colors hover:opacity-85"
          />

          {/* Cara 2: Palatina / Lingual (Inferior) */}
          <polygon
            points="18,42 42,42 55,55 5,55"
            fill={getColorCara('palatinaLingual')}
            stroke="#94a3b8"
            strokeWidth="1.5"
            className="transition-colors hover:opacity-85"
          />

          {/* Cara 3: Mesial (Izquierda en cuadrantes derechos o viceversa) */}
          <polygon
            points="5,5 18,18 18,42 5,55"
            fill={getColorCara('mesial')}
            stroke="#94a3b8"
            strokeWidth="1.5"
            className="transition-colors hover:opacity-85"
          />

          {/* Cara 4: Distal (Derecha) */}
          <polygon
            points="55,5 42,18 42,42 55,55"
            fill={getColorCara('distal')}
            stroke="#94a3b8"
            strokeWidth="1.5"
            className="transition-colors hover:opacity-85"
          />

          {/* Cara 5: Oclusal / Incisal (Centro) */}
          <rect
            x="18"
            y="18"
            width="24"
            height="24"
            fill={getColorCara('oclusal')}
            stroke="#94a3b8"
            strokeWidth="1.5"
            className="transition-colors hover:opacity-85"
          />

          {/* Superposiciones clínicas simbólicas */}
          {isAusente && (
            <g stroke="#dc2626" strokeWidth="3" strokeLinecap="round">
              <line x1="8" y1="8" x2="52" y2="52" />
              <line x1="52" y1="8" x2="8" y2="52" />
            </g>
          )}

          {isCorona && (
            <circle 
              cx="30" 
              cy="30" 
              r="26" 
              fill="none" 
              stroke="#d97706" 
              strokeWidth="2.5" 
              strokeDasharray="4 2"
            />
          )}

          {isEndo && (
            <line 
              x1="30" 
              y1="4" 
              x2="30" 
              y2="56" 
              stroke="#7c3aed" 
              strokeWidth="3.5" 
              strokeLinecap="round"
            />
          )}

          {isImplante && (
            <g stroke="#0891b2" strokeWidth="2.5" fill="none">
              <line x1="30" y1="10" x2="30" y2="50" />
              <line x1="22" y1="20" x2="38" y2="20" />
              <line x1="24" y1="32" x2="36" y2="32" />
              <line x1="26" y1="44" x2="34" y2="44" />
            </g>
          )}
        </svg>

        {/* Indicador de estado general si existe */}
        {estadoGeneral && !isAusente && (
          <span 
            className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ring-2 ring-white"
            style={{ 
              backgroundColor: hallazgosDentales.find(h => h.valor === estadoGeneral)?.color || '#3b82f6' 
            }} 
          />
        )}
      </div>

      {/* Estado breve bajo la pieza */}
      <span className="text-[9px] font-medium text-slate-500 mt-1 max-w-[48px] truncate text-center h-3">
        {estadoGeneral || (Object.keys(caras).length > 0 ? `${Object.keys(caras).length} cara(s)` : '')}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Modal Clínico: Tratamiento y hallazgo por caras y general
// ─────────────────────────────────────────────────────────────
function ModalDienteClinico({ diente, dataDiente, onGuardar, onCerrar }) {
  const [caras, setCaras] = useState(dataDiente?.caras || {});
  const [hallazgoGeneral, setHallazgoGeneral] = useState(
    dataDiente?.hallazgoGeneral || (typeof dataDiente?.hallazgo === 'string' ? dataDiente.hallazgo : null)
  );
  const [caraActiva, setCaraActiva] = useState('oclusal');
  const [herramientaSeleccionada, setHerramientaSeleccionada] = useState('Caries');

  // Aplicar herramienta a la cara seleccionada
  const handlePintarCara = (caraKey) => {
    if (herramientaSeleccionada === 'Sano') {
      const nuevasCaras = { ...caras };
      delete nuevasCaras[caraKey];
      setCaras(nuevasCaras);
    } else {
      setCaras({
        ...caras,
        [caraKey]: herramientaSeleccionada
      });
    }
  };

  const handleLimpiarPieza = () => {
    setCaras({});
    setHallazgoGeneral(null);
  };

  const handleGuardar = () => {
    onGuardar(diente, {
      caras,
      hallazgoGeneral,
      // Compatibilidad con la versión anterior para vistas o filtros simples:
      hallazgo: hallazgoGeneral || (Object.values(caras)[0] || null),
      color: hallazgoGeneral 
        ? (hallazgosDentales.find(h => h.valor === hallazgoGeneral)?.color || '#3b82f6')
        : (caras.oclusal ? hallazgosDentales.find(h => h.valor === caras.oclusal)?.color : '#3b82f6')
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Cabecera del modal */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-950 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-400/30">
              <Stethoscope size={20} className="text-blue-300" />
            </div>
            <div>
              <h3 className="text-base font-bold flex items-center gap-2">
                Exploración Odontológica — Pieza {diente}
              </h3>
              <p className="text-xs text-blue-200/80">
                Seleccione las caras afectadas o aplique un diagnóstico a nivel de pieza completa
              </p>
            </div>
          </div>
          <button
            onClick={onCerrar}
            className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Herramientas de diagnóstico clínico */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                1. Seleccionar Diagnóstico o Hallazgo
              </span>
              <span className="text-xs text-slate-400">Clic para activar instrumento</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {hallazgosDentales.map((h) => {
                const isActivo = herramientaSeleccionada === h.valor;
                return (
                  <button
                    key={h.valor}
                    type="button"
                    onClick={() => setHerramientaSeleccionada(h.valor)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${
                      isActivo
                        ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-600/30 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: h.color }}
                    />
                    <div className="truncate">
                      <p className="text-xs font-medium leading-tight">{h.label}</p>
                      <span className="text-[10px] text-slate-400 capitalize">{h.tipo}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Editor interactivo de superficies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
            {/* Visualizador interactivo 5 caras */}
            <div className="flex flex-col items-center justify-center">
              <span className="text-xs font-semibold text-slate-600 mb-3">
                Superficies Anatómicas (Interactivo)
              </span>
              
              <div className="relative w-44 h-44 bg-white p-3 rounded-2xl shadow-sm border border-slate-200">
                <svg viewBox="0 0 100 100" className="w-full h-full cursor-pointer select-none">
                  {/* Vestibular */}
                  <polygon
                    points="5,5 95,5 75,25 25,25"
                    fill={caras.vestibular ? hallazgosDentales.find(h => h.valor === caras.vestibular)?.color : '#f8fafc'}
                    stroke="#64748b"
                    strokeWidth="2"
                    onClick={() => handlePintarCara('vestibular')}
                    className="hover:opacity-80 transition-opacity"
                  />
                  <text x="50" y="18" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#475569" pointerEvents="none">
                    V (Vestibular)
                  </text>

                  {/* Palatina / Lingual */}
                  <polygon
                    points="25,75 75,75 95,95 5,95"
                    fill={caras.palatinaLingual ? hallazgosDentales.find(h => h.valor === caras.palatinaLingual)?.color : '#f8fafc'}
                    stroke="#64748b"
                    strokeWidth="2"
                    onClick={() => handlePintarCara('palatinaLingual')}
                    className="hover:opacity-80 transition-opacity"
                  />
                  <text x="50" y="88" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#475569" pointerEvents="none">
                    P / L
                  </text>

                  {/* Mesial */}
                  <polygon
                    points="5,5 25,25 25,75 5,95"
                    fill={caras.mesial ? hallazgosDentales.find(h => h.valor === caras.mesial)?.color : '#f8fafc'}
                    stroke="#64748b"
                    strokeWidth="2"
                    onClick={() => handlePintarCara('mesial')}
                    className="hover:opacity-80 transition-opacity"
                  />
                  <text x="16" y="53" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#475569" pointerEvents="none">
                    M
                  </text>

                  {/* Distal */}
                  <polygon
                    points="95,5 75,25 75,75 95,95"
                    fill={caras.distal ? hallazgosDentales.find(h => h.valor === caras.distal)?.color : '#f8fafc'}
                    stroke="#64748b"
                    strokeWidth="2"
                    onClick={() => handlePintarCara('distal')}
                    className="hover:opacity-80 transition-opacity"
                  />
                  <text x="84" y="53" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#475569" pointerEvents="none">
                    D
                  </text>

                  {/* Oclusal */}
                  <rect
                    x="25"
                    y="25"
                    width="50"
                    height="50"
                    fill={caras.oclusal ? hallazgosDentales.find(h => h.valor === caras.oclusal)?.color : '#f8fafc'}
                    stroke="#64748b"
                    strokeWidth="2"
                    onClick={() => handlePintarCara('oclusal')}
                    className="hover:opacity-80 transition-opacity"
                  />
                  <text x="50" y="53" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#475569" pointerEvents="none">
                    Oclusal
                  </text>
                </svg>
              </div>
              <span className="text-[11px] text-slate-500 mt-2">
                Haga clic sobre una cara para aplicar: <span className="font-semibold text-slate-800">{herramientaSeleccionada}</span>
              </span>
            </div>

            {/* Diagnóstico Global y Afectación Total */}
            <div className="flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-semibold text-slate-700 block mb-2">
                  Afectación Total de la Pieza
                </span>
                <div className="space-y-1.5">
                  {['Corona', 'Endodoncia', 'Implante', 'Extracción'].map((afectacion) => (
                    <button
                      key={afectacion}
                      type="button"
                      onClick={() => setHallazgoGeneral(hallazgoGeneral === afectacion ? null : afectacion)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                        hallazgoGeneral === afectacion
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold'
                          : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span>{afectacion}</span>
                      {hallazgoGeneral === afectacion && <Check size={14} className="text-indigo-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Botón rápido para limpiar o dejar sano */}
              <button
                type="button"
                onClick={handleLimpiarPieza}
                className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors font-medium"
              >
                <RotateCcw size={13} />
                Restablecer pieza a Sano
              </button>
            </div>
          </div>

          {/* Resumen de hallazgos actuales del diente */}
          <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-xs text-slate-700 flex items-center justify-between">
            <span className="font-medium">Caras diagnosticadas:</span>
            <div className="flex gap-2">
              {Object.keys(caras).length > 0 ? (
                Object.entries(caras).map(([c, val]) => (
                  <span key={c} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-semibold text-slate-800">
                    {c.substring(0, 3).toUpperCase()}: {val}
                  </span>
                ))
              ) : (
                <span className="text-slate-400 italic">Ninguna cara con patología</span>
              )}
            </div>
          </div>
        </div>

        {/* Acciones del pie */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200">
          <button
            onClick={onCerrar}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-md shadow-blue-700/20 transition-all flex items-center gap-1.5"
          >
            <Check size={15} />
            Confirmar en Odontograma
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Componente Principal Odontograma
// ─────────────────────────────────────────────────────────────
export default function Odontograma({ pacientes, setPacientes }) {
  const [pacienteSeleccionadoId, setPacienteSeleccionadoId] = useState(null);
  const [dienteSeleccionado, setDienteSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [dropdownAbierto, setDropdownAbierto] = useState(false);
  const [modalEscanerAbierto, setModalEscanerAbierto] = useState(false);
  
  // Selector de dentición: Adulto (Permanente) o Infantil (Decidua / Temporal)
  const [tipoDenticion, setTipoDenticion] = useState('adulto');

  const paciente = useMemo(
    () => pacientes.find((p) => p.id === pacienteSeleccionadoId) || null,
    [pacientes, pacienteSeleccionadoId]
  );

  const pacientesFiltrados = useMemo(
    () =>
      pacientes.filter(
        (p) =>
          `${p.nombre} ${p.apellido}`.toLowerCase().includes(busqueda.toLowerCase()) ||
          p.dni.includes(busqueda)
      ),
    [pacientes, busqueda]
  );

  // Estadísticas del paciente (recuento por diagnóstico)
  const estadisticas = useMemo(() => {
    if (!paciente?.odontograma) return {};
    const stats = {
      Caries: 0,
      Restauración: 0,
      Sellador: 0,
      Corona: 0,
      Endodoncia: 0,
      Implante: 0,
      Extracción: 0,
    };

    Object.values(paciente.odontograma).forEach((pData) => {
      if (pData.hallazgoGeneral && stats[pData.hallazgoGeneral] !== undefined) {
        stats[pData.hallazgoGeneral]++;
      }
      if (pData.caras) {
        Object.values(pData.caras).forEach((cVal) => {
          if (stats[cVal] !== undefined) stats[cVal]++;
        });
      } else if (pData.hallazgo && stats[pData.hallazgo] !== undefined && !pData.hallazgoGeneral) {
        stats[pData.hallazgo]++;
      }
    });

    return stats;
  }, [paciente]);

  const seleccionarPaciente = (p) => {
    setPacienteSeleccionadoId(p.id);
    setDropdownAbierto(false);
    setBusqueda('');
    setObservaciones(p.observacionesOdonto || '');
    setDienteSeleccionado(null);
  };

  const guardarDiente = (numeroDiente, nuevoDatoDiente) => {
    if (!paciente) return;

    setPacientes((prev) =>
      prev.map((p) => {
        if (p.id !== paciente.id) return p;
        const nuevoOdontograma = { ...p.odontograma };
        
        // Si no tiene caras ni hallazgo general, lo limpiamos
        const tieneCaras = nuevoDatoDiente.caras && Object.keys(nuevoDatoDiente.caras).length > 0;
        const tieneGeneral = Boolean(nuevoDatoDiente.hallazgoGeneral);

        if (!tieneCaras && !tieneGeneral) {
          delete nuevoOdontograma[numeroDiente];
        } else {
          nuevoOdontograma[numeroDiente] = nuevoDatoDiente;
        }

        return { ...p, odontograma: nuevoOdontograma };
      })
    );

    setDienteSeleccionado(null);
  };

  const guardarObservaciones = () => {
    if (!paciente) return;
    setPacientes((prev) =>
      prev.map((p) => (p.id === paciente.id ? { ...p, observacionesOdonto: observaciones } : p))
    );
  };

  const aplicarResultadosIA = (resultadoIA) => {
    if (!paciente || !resultadoIA) return;

    if (resultadoIA.tipoDenticion) {
      setTipoDenticion(resultadoIA.tipoDenticion);
    }

    if (resultadoIA.observacionesDetectadas) {
      const notaNueva = observaciones 
        ? `${observaciones}\n[Extracción IA]: ${resultadoIA.observacionesDetectadas}`
        : `[Extracción IA]: ${resultadoIA.observacionesDetectadas}`;
      setObservaciones(notaNueva);
    }

    setPacientes((prev) =>
      prev.map((p) => {
        if (p.id !== paciente.id) return p;
        return {
          ...p,
          odontograma: {
            ...(p.odontograma || {}),
            ...(resultadoIA.odontograma || {}),
          },
          observacionesOdonto: resultadoIA.observacionesDetectadas 
            ? `${p.observacionesOdonto ? `${p.observacionesOdonto}\n` : ''}[Extracción IA]: ${resultadoIA.observacionesDetectadas}`
            : p.observacionesOdonto
        };
      })
    );
  };

  const arcadaSup = tipoDenticion === 'adulto' ? arcadaSuperiorAdulto : arcadaSuperiorInfantil;
  const arcadaInf = tipoDenticion === 'adulto' ? arcadaInferiorAdulto : arcadaInferiorInfantil;

  return (
    <div className="space-y-6">
      {/* Barra superior con selección de paciente y control de vista */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Activity className="text-blue-600" size={22} />
              Odontograma Clínico Especializado
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              FDI World Dental Federation — Registro por caras anatómicas y estado general de pieza
            </p>
          </div>

          {/* Toggle de dentición Adulto / Infantil y Botón Escáner IA */}
          <div className="flex flex-wrap items-center gap-2.5">
            {paciente && (
              <button
                type="button"
                onClick={() => setModalEscanerAbierto(true)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 hover:from-purple-800 hover:to-blue-800 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all hover:scale-102 cursor-pointer"
                title="Cargar con IA mediante dictado por voz, texto o foto de ficha"
              >
                <Sparkles size={14} className="text-purple-200 animate-pulse" />
                <span>Asistente IA (Voz / Foto)</span>
              </button>
            )}

            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 self-start md:self-auto">
              <button
                onClick={() => setTipoDenticion('adulto')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  tipoDenticion === 'adulto'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User size={14} />
                Dentición Permanente (32)
              </button>
              <button
                onClick={() => setTipoDenticion('infantil')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  tipoDenticion === 'infantil'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Baby size={14} />
                Odontopediatría (20)
              </button>
            </div>
          </div>
        </div>

        {/* Selector de Paciente */}
        <div className="mt-4 pt-4 border-t border-slate-100 relative max-w-md">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Paciente en Atención
          </label>
          <button
            onClick={() => setDropdownAbierto(!dropdownAbierto)}
            className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-left 
              hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all outline-hidden text-sm"
          >
            {paciente ? (
              <span className="text-slate-800 font-semibold">
                {paciente.nombre} {paciente.apellido}{' '}
                <span className="text-slate-400 font-normal">— DNI {paciente.dni}</span>
              </span>
            ) : (
              <span className="text-slate-400">Seleccionar paciente para examinar...</span>
            )}
            <ChevronDown
              size={18}
              className={`text-slate-400 transition-transform ${dropdownAbierto ? 'rotate-180' : ''}`}
            />
          </button>

          {dropdownAbierto && (
            <div className="absolute z-30 w-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
              <div className="p-2 border-b border-slate-100 bg-slate-50">
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Filtrar por nombre o DNI..."
                    className="w-full pl-8.5 pr-3 py-1.5 bg-white rounded-lg text-xs border border-slate-200 outline-hidden focus:border-blue-500"
                    autoFocus
                  />
                </div>
              </div>
              <div className="max-h-52 overflow-y-auto divide-y divide-slate-100">
                {pacientesFiltrados.length > 0 ? (
                  pacientesFiltrados.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => seleccionarPaciente(p)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left hover:bg-blue-50/70 transition-colors ${
                        pacienteSeleccionadoId === p.id ? 'bg-blue-50/90 font-medium' : ''
                      }`}
                    >
                      <div className="w-7 h-7 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {p.nombre[0]}{p.apellido[0]}
                      </div>
                      <div className="truncate">
                        <p className="text-xs text-slate-800">{p.nombre} {p.apellido}</p>
                        <p className="text-[11px] text-slate-400">DNI: {p.dni} — {p.obraSocial}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4">No se hallaron pacientes</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {paciente ? (
        <>
          {/* Panel Clínico de Métricas y Patologías activas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {hallazgosDentales
              .filter((h) => h.valor !== 'Sano')
              .map((h) => (
                <div
                  key={h.valor}
                  className="bg-white rounded-xl border border-slate-200/90 p-3 flex flex-col justify-between shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: h.color }} 
                    />
                    <span className="text-base font-black text-slate-800">
                      {estadisticas[h.valor] || 0}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600 mt-2 truncate">
                    {h.label}
                  </span>
                </div>
              ))}
          </div>

          {/* Gráfico Odontograma Visual Principal */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                  Esquema Dental Completo — {paciente.nombre} {paciente.apellido}
                </h3>
                <span className="text-xs text-slate-400">
                  Haga clic sobre cualquier pieza para registrar caries, restauraciones o tratamientos
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <Sparkles size={13} /> FDI Activo
                </span>
              </div>
            </div>

            {/* Representación visual de las Arcadas */}
            <div className="overflow-x-auto pb-6">
              <div className="min-w-[780px] flex flex-col items-center">
                {/* Indicador Cuadrantes Superiores */}
                <div className="w-full flex justify-between px-12 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  <span>Cuadrante {tipoDenticion === 'adulto' ? '1 (Superior Derecho)' : '5 (Sup. Der.)'}</span>
                  <span>Cuadrante {tipoDenticion === 'adulto' ? '2 (Superior Izquierdo)' : '6 (Sup. Izq.)'}</span>
                </div>

                {/* Arcada Superior */}
                <div className="flex items-center gap-1.5 sm:gap-2 relative py-2 px-4 rounded-xl bg-slate-50/70 border border-slate-200/60">
                  {arcadaSup.map((num, idx) => {
                    const mitad = arcadaSup.length / 2;
                    return (
                      <div key={num} className="relative flex items-center">
                        {idx === mitad && (
                          <div className="w-0.5 h-16 bg-blue-500/40 mx-2 rounded-full shadow-xs" title="Línea Media Dental" />
                        )}
                        <DienteGeometrico
                          numero={num}
                          dataDiente={paciente.odontograma?.[num] || null}
                          isSelected={dienteSeleccionado === num}
                          onClick={() => setDienteSeleccionado(num)}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Línea Divisoria Media / Plano Oclusal */}
                <div className="w-full max-w-[720px] flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-linear-to-r from-transparent via-slate-300 to-slate-300" />
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                    Plano Oclusal
                  </span>
                  <div className="flex-1 h-px bg-linear-to-l from-transparent via-slate-300 to-slate-300" />
                </div>

                {/* Arcada Inferior */}
                <div className="flex items-center gap-1.5 sm:gap-2 relative py-2 px-4 rounded-xl bg-slate-50/70 border border-slate-200/60">
                  {arcadaInf.map((num, idx) => {
                    const mitad = arcadaInf.length / 2;
                    return (
                      <div key={num} className="relative flex items-center">
                        {idx === mitad && (
                          <div className="w-0.5 h-16 bg-blue-500/40 mx-2 rounded-full shadow-xs" title="Línea Media Dental" />
                        )}
                        <DienteGeometrico
                          numero={num}
                          dataDiente={paciente.odontograma?.[num] || null}
                          isSelected={dienteSeleccionado === num}
                          onClick={() => setDienteSeleccionado(num)}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Indicador Cuadrantes Inferiores */}
                <div className="w-full flex justify-between px-12 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                  <span>Cuadrante {tipoDenticion === 'adulto' ? '4 (Inferior Derecho)' : '8 (Inf. Der.)'}</span>
                  <span>Cuadrante {tipoDenticion === 'adulto' ? '3 (Inferior Izquierdo)' : '7 (Inf. Izq.)'}</span>
                </div>
              </div>
            </div>

            {/* Guía y Leyenda Clínica Profesional */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                Convenciones y Simbología Odontológica
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#dc2626]" />
                  <span className="text-xs text-slate-600 font-medium">Caries (Rojo)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#2563eb]" />
                  <span className="text-xs text-slate-600 font-medium">Restauración (Azul)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#059669]" />
                  <span className="text-xs text-slate-600 font-medium">Sellador (Verde)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#d97706]" />
                  <span className="text-xs text-slate-600 font-medium">Corona (Círculo ámbar)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#7c3aed]" />
                  <span className="text-xs text-slate-600 font-medium">Endodoncia (Línea lila)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#4b5563]" />
                  <span className="text-xs text-slate-600 font-medium">Extracción / Cruz</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notas Clínicas y Plan de Tratamiento */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <FileText size={16} className="text-blue-600" />
                Evolución y Plan de Tratamiento Odontológico
              </label>
              <button
                onClick={guardarObservaciones}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition-all shadow-xs"
              >
                Guardar Notas
              </button>
            </div>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={3}
              placeholder="Describa el plan de tratamiento (ej. Se inicia obturación en pieza 26 cara oclusal, control de placa bacteriana, profilaxis...)"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-700 
                placeholder:text-slate-400 outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
            />
          </div>

          {/* Modal de edición clínica de pieza */}
          {dienteSeleccionado !== null && (
            <ModalDienteClinico
              diente={dienteSeleccionado}
              dataDiente={paciente.odontograma?.[dienteSeleccionado] || null}
              onGuardar={guardarDiente}
              onCerrar={() => setDienteSeleccionado(null)}
            />
          )}

          {/* Modal de Escáner y Digitalización con IA */}
          {modalEscanerAbierto && (
            <ModalEscanerIA
              paciente={paciente}
              onAplicarResultados={aplicarResultadosIA}
              onCerrar={() => setModalEscanerAbierto(false)}
            />
          )}
        </>
      ) : (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <AlertCircle size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-700">Sin paciente seleccionado</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Seleccione un paciente de la lista superior para visualizar su odontograma por caras o registrar nuevos tratamientos.
          </p>
        </div>
      )}
    </div>
  );
}
