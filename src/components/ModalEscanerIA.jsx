import { useState, useRef } from 'react';
import { 
  Sparkles, Camera, Upload, CheckCircle2, AlertTriangle, 
  X, RefreshCw, Eye, ArrowRight, ShieldCheck, Key
} from 'lucide-react';
import { digitalizarFichaDentalConIA } from '../services/iaScannerService';

export default function ModalEscanerIA({ paciente, onAplicarResultados, onCerrar }) {
  const [imagenPreview, setImagenPreview] = useState(null);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [analizando, setAnalizando] = useState(false);
  const [resultadoIA, setResultadoIA] = useState(null);
  const [error, setError] = useState(null);
  const [apiKeyGemini, setApiKeyGemini] = useState(localStorage.getItem('gemini_api_key') || '');
  const [mostrarConfigKey, setMostrarConfigKey] = useState(false);
  const fileInputRef = useRef(null);

  const handleSeleccionarArchivo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Por favor seleccione un archivo de imagen válido (JPG, PNG, WEBP).');
      return;
    }

    setError(null);
    setResultadoIA(null);
    setArchivoSeleccionado(file);

    const reader = new FileReader();
    reader.onload = () => setImagenPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleAnalizar = async () => {
    if (!archivoSeleccionado) return;

    setAnalizando(true);
    setError(null);

    try {
      if (apiKeyGemini) {
        localStorage.setItem('gemini_api_key', apiKeyGemini);
      }
      const data = await digitalizarFichaDentalConIA(archivoSeleccionado, apiKeyGemini);
      setResultadoIA(data);
    } catch (err) {
      setError('Ocurrió un inconveniente al analizar la imagen. Intente nuevamente.');
      console.error(err);
    } finally {
      setAnalizando(false);
    }
  };

  const handleConfirmarCarga = () => {
    if (!resultadoIA) return;
    onAplicarResultados(resultadoIA);
    onCerrar();
  };

  const piezasDetectadas = resultadoIA ? Object.keys(resultadoIA.odontograma || {}) : [];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Cabecera con degradado tecnológico */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-500/20 rounded-xl border border-purple-400/30">
              <Sparkles size={22} className="text-purple-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">IA Dental Scanner Pro</h3>
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full text-white">
                  Vision 1.5
                </span>
              </div>
              <p className="text-xs text-blue-200/80">
                Digitalización óptica automática de odontogramas en papel y capturas clínicas
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

        {/* Cuerpo del Modal */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Alerta Paciente */}
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <span className="text-slate-500">Paciente destino:</span>
            <span className="font-bold text-slate-800">
              {paciente.nombre} {paciente.apellido} (DNI {paciente.dni})
            </span>
          </div>

          {/* Zona de Carga / Drag & Drop */}
          {!imagenPreview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-indigo-200 hover:border-indigo-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-indigo-50/20 hover:bg-indigo-50/50 transition-all text-center group"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 group-hover:scale-110 text-indigo-600 flex items-center justify-center mb-3 transition-transform shadow-sm">
                <Camera size={28} />
              </div>
              <p className="text-sm font-bold text-slate-700">
                Subir foto de ficha en papel o captura
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Arrastre una imagen aquí o haga clic para buscar en su dispositivo (JPG, PNG)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleSeleccionarArchivo}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 max-h-56 bg-slate-950 flex items-center justify-center group">
                <img
                  src={imagenPreview}
                  alt="Ficha a escanear"
                  className="max-h-56 w-full object-contain"
                />
                <button
                  onClick={() => {
                    setImagenPreview(null);
                    setArchivoSeleccionado(null);
                    setResultadoIA(null);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors"
                  title="Cambiar imagen"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Botón de Escaneo IA */}
              {!resultadoIA && (
                <button
                  type="button"
                  onClick={handleAnalizar}
                  disabled={analizando}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 hover:from-blue-800 hover:to-purple-800 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {analizando ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Procesando superficies y nomenclatura con IA Vision...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Digitalizar y Mapear Dientes con Inteligencia Artificial
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Resultado de la IA */}
          {resultadoIA && (
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4.5 space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                    Reconocimiento Odontológico Completado
                  </span>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {resultadoIA.confianza}% Certeza
                </span>
              </div>

              {/* Piezas encontradas */}
              <div>
                <span className="text-xs font-semibold text-slate-700 block mb-2">
                  Piezas clínicas identificadas ({piezasDetectadas.length}):
                </span>
                <div className="flex flex-wrap gap-2">
                  {piezasDetectadas.map((pieza) => {
                    const info = resultadoIA.odontograma[pieza];
                    const detalleCaras = info.caras ? Object.keys(info.caras).join(', ') : '';
                    return (
                      <div
                        key={pieza}
                        className="px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-xs font-medium text-slate-700 shadow-2xs flex items-center gap-1.5"
                      >
                        <span className="font-bold text-blue-700">Diente {pieza}:</span>
                        <span className="text-slate-600">
                          {info.hallazgoGeneral || (detalleCaras ? `Caras (${detalleCaras})` : 'Afección')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Notas manuscritas extraídas */}
              {resultadoIA.observacionesDetectadas && (
                <div className="p-3 bg-white/80 rounded-xl border border-emerald-200/80 text-xs text-slate-700">
                  <span className="font-semibold block text-slate-800 mb-1">
                    Notas y Diagnóstico Manuscrito Extraído:
                  </span>
                  <p className="italic text-slate-600 text-[11px] leading-relaxed">
                    "{resultadoIA.observacionesDetectadas}"
                  </p>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Configuración opcional de API Key de Gemini */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setMostrarConfigKey(!mostrarConfigKey)}
              className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1.5 font-medium transition-colors"
            >
              <Key size={12} />
              {mostrarConfigKey ? 'Ocultar configuración de API' : '¿Deseas conectar tu propia Gemini API Key en vivo?'}
            </button>
            {mostrarConfigKey && (
              <div className="mt-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <p className="text-[11px] text-slate-500">
                  Opcional: Si se deja en blanco, el sistema utiliza el **Motor de Simulación Ultrarrápida para Demos** sin requerir credenciales externas.
                </p>
                <input
                  type="password"
                  placeholder="Pegar Google Gemini API Key aquí (AIzaSy...)"
                  value={apiKeyGemini}
                  onChange={(e) => setApiKeyGemini(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs outline-hidden focus:border-indigo-500 font-mono"
                />
              </div>
            )}
          </div>
        </div>

        {/* Pie con Acciones */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onCerrar}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cerrar
          </button>

          {resultadoIA && (
            <button
              onClick={handleConfirmarCarga}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
            >
              <span>Aplicar al Odontograma</span>
              <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
