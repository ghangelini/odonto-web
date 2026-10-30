import { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Camera, Mic, MicOff, FileText, CheckCircle2, 
  AlertTriangle, X, RefreshCw, ArrowRight, Key, Volume2
} from 'lucide-react';
import { digitalizarFichaDentalConIA, interpretarDictadoTextoConIA } from '../services/iaScannerService';

export default function ModalEscanerIA({ paciente, onAplicarResultados, onCerrar }) {
  const [modo, setModo] = useState('voz'); // 'voz' (texto/dictado) o 'imagen'
  
  // Estados para modo Imagen
  const [imagenPreview, setImagenPreview] = useState(null);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const fileInputRef = useRef(null);

  // Estados para modo Dictado / Texto
  const [textoDictado, setTextoDictado] = useState('');
  const [grabandoVoz, setGrabandoVoz] = useState(false);
  const [soporteVoz, setSoporteVoz] = useState(true);
  const recognitionRef = useRef(null);

  // Estados comunes
  const [analizando, setAnalizando] = useState(false);
  const [resultadoIA, setResultadoIA] = useState(null);
  const [error, setError] = useState(null);
  const [apiKeyGemini, setApiKeyGemini] = useState(localStorage.getItem('gemini_api_key') || '');
  const [mostrarConfigKey, setMostrarConfigKey] = useState(false);

  // Inicializar Web Speech Recognition API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSoporteVoz(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let transcripcionActual = '';
      for (let i = 0; i < event.results.length; i++) {
        transcripcionActual += event.results[i][0].transcript + ' ';
      }
      setTextoDictado(transcripcionActual);
    };

    recognition.onerror = (event) => {
      console.warn('Error en reconocimiento de voz:', event.error);
      setGrabandoVoz(false);
      if (event.error === 'not-allowed') {
        setError('Acceso al micrófono denegado. Permite el micrófono en tu navegador o escribe directamente.');
      }
    };

    recognition.onend = () => {
      setGrabandoVoz(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleGrabacionVoz = () => {
    if (!soporteVoz) {
      setError('Tu navegador no soporta dictado por voz directo. Puedes escribir el texto en el recuadro.');
      return;
    }

    setError(null);
    if (grabandoVoz) {
      recognitionRef.current?.stop();
      setGrabandoVoz(false);
    } else {
      try {
        recognitionRef.current?.start();
        setGrabandoVoz(true);
      } catch (err) {
        console.error('Error al iniciar grabación:', err);
      }
    }
  };

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
    setAnalizando(true);
    setError(null);

    try {
      if (apiKeyGemini) {
        localStorage.setItem('gemini_api_key', apiKeyGemini);
      }

      let data;
      if (modo === 'imagen') {
        if (!archivoSeleccionado) {
          setError('Seleccione una imagen para digitalizar.');
          setAnalizando(false);
          return;
        }
        data = await digitalizarFichaDentalConIA(archivoSeleccionado, apiKeyGemini);
      } else {
        if (!textoDictado.trim()) {
          setError('Escribe o dicta algún hallazgo antes de procesar.');
          setAnalizando(false);
          return;
        }
        data = await interpretarDictadoTextoConIA(textoDictado, apiKeyGemini);
      }

      setResultadoIA(data);
    } catch (err) {
      setError('Ocurrió un inconveniente al procesar con IA. Intente nuevamente.');
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

  const insertarTextoEjemplo = (ejemplo) => {
    setTextoDictado(ejemplo);
    setError(null);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Cabecera tecnológica */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-500/20 rounded-xl border border-purple-400/30">
              <Sparkles size={22} className="text-purple-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">IA Dental Assistant Pro</h3>
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full text-white">
                  Gemini Flash + Voice
                </span>
              </div>
              <p className="text-xs text-blue-200/80">
                Carga automática de odontogramas mediante dictado por voz, texto o escaneo de ficha
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

        {/* Pestañas de Selección de Modo */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-6 pt-2">
          <button
            type="button"
            onClick={() => { setModo('voz'); setResultadoIA(null); setError(null); }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
              modo === 'voz'
                ? 'border-indigo-600 text-indigo-700 bg-white rounded-t-xl shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Mic size={15} />
            <span>Dictado por Voz y Texto</span>
          </button>

          <button
            type="button"
            onClick={() => { setModo('imagen'); setResultadoIA(null); setError(null); }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
              modo === 'imagen'
                ? 'border-indigo-600 text-indigo-700 bg-white rounded-t-xl shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Camera size={15} />
            <span>Escanear Ficha / Imagen</span>
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

          {/* MODO 1: DICTADO POR VOZ O TEXTO */}
          {modo === 'voz' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <FileText size={14} className="text-indigo-600" />
                  Dictá o escribí las patologías del paciente:
                </label>

                {soporteVoz && (
                  <button
                    type="button"
                    onClick={toggleGrabacionVoz}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      grabandoVoz
                        ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-600/30 ring-2 ring-rose-400'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'
                    }`}
                  >
                    {grabandoVoz ? <MicOff size={14} /> : <Mic size={14} />}
                    {grabandoVoz ? 'Detener dictado' : 'Dictar por Micrófono'}
                  </button>
                )}
              </div>

              {grabandoVoz && (
                <div className="flex items-center gap-2 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 animate-in fade-in">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                  <span>Escuchando micrófono... Hablá de forma natural: <i>"Pieza 16 con caries oclusal, pieza 36 extracción..."</i></span>
                </div>
              )}

              <div className="relative">
                <textarea
                  rows={4}
                  value={textoDictado}
                  onChange={(e) => setTextoDictado(e.target.value)}
                  placeholder="Ej: Diente 16 tiene caries oclusal y mesial, diente 24 con restauración vestibular, 36 extracción y 47 endodoncia..."
                  className="w-full p-3.5 bg-slate-50 border border-slate-300 focus:border-indigo-500 focus:bg-white rounded-2xl text-xs text-slate-800 outline-hidden transition-all resize-none shadow-inner"
                />
                {textoDictado && (
                  <button
                    type="button"
                    onClick={() => { setTextoDictado(''); setResultadoIA(null); }}
                    className="absolute top-2.5 right-2.5 p-1 rounded-full text-slate-400 hover:text-slate-600 bg-white/80 hover:bg-slate-200"
                    title="Borrar texto"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Botones de sugerencias rápidas */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-500">Ejemplos para probar con un clic:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Pieza 16 caries en cara oclusal, pieza 24 con arreglo mesial y pieza 36 para extracción',
                    'Diente 11 restauración palatina, diente 46 caries oclusal y 47 endodoncia con corona',
                    'Extracción de pieza 18 y 28, caries oclusal en pieza 37 y sellador en 44',
                  ].map((ej, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => insertarTextoEjemplo(ej)}
                      className="text-[11px] bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors text-left"
                    >
                      💡 {ej}
                    </button>
                  ))}
                </div>
              </div>

              {!resultadoIA && (
                <button
                  type="button"
                  onClick={handleAnalizar}
                  disabled={analizando || !textoDictado.trim()}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 hover:from-blue-800 hover:to-purple-800 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {analizando ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Interpretando piezas, caras y tratamientos con IA...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Completar Odontograma desde Dictado / Texto
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* MODO 2: ESCANEO DE IMAGEN */}
          {modo === 'imagen' && (
            <>
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
            </>
          )}

          {/* Resultado de la IA */}
          {resultadoIA && (
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4.5 space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                    Reconocimiento Odontológico Exitoso
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
                  {piezasDetectadas.length > 0 ? (
                    piezasDetectadas.map((pieza) => {
                      const info = resultadoIA.odontograma[pieza];
                      const detalleCaras = info.caras ? Object.entries(info.caras).map(([k, v]) => `${k.substring(0,3)}: ${v}`).join(', ') : '';
                      return (
                        <div
                          key={pieza}
                          className="px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-xs font-medium text-slate-700 shadow-2xs flex items-center gap-1.5"
                        >
                          <span className="font-bold text-indigo-700">Diente {pieza}:</span>
                          <span className="text-slate-600">
                            {info.hallazgoGeneral || (detalleCaras ? `Caras (${detalleCaras})` : 'Afección')}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <span className="text-xs text-slate-500 italic">No se identificaron piezas específicas.</span>
                  )}
                </div>
              </div>

              {/* Notas extraídas */}
              {resultadoIA.observacionesDetectadas && (
                <div className="p-3 bg-white/80 rounded-xl border border-emerald-200/80 text-xs text-slate-700">
                  <span className="font-semibold block text-slate-800 mb-1">
                    Notas y Diagnóstico Extraído:
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
                  Opcional: Si se deja en blanco, el sistema utiliza el **Motor Inteligente Local/Demo** para procesar voz, texto e imágenes sin depender de credenciales externas.
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
