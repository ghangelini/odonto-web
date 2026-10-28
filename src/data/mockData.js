// Datos simulados para la demo del Consultorio Clínico y Odontológico

export const pacientesIniciales = [
  {
    id: 1,
    nombre: 'María',
    apellido: 'González',
    dni: '28456789',
    fechaNacimiento: '1982-03-15',
    telefono: '11-4567-8901',
    email: 'maria.gonzalez@email.com',
    obraSocial: 'OSDE',
    examenes: [
      {
        id: 1,
        tipo: 'Periódico',
        fecha: '2026-06-15',
        signosVitales: { presionArterial: '120/80', frecuenciaCardiaca: 72, peso: 65, altura: 1.62 },
        anamnesis: 'Paciente refiere buen estado general. Sin antecedentes relevantes.',
        aptitudFisica: 'Apta sin restricciones',
        observaciones: 'Control anual sin hallazgos patológicos.',
      },
    ],
    odontograma: { 18: { hallazgo: 'Caries', color: '#ef4444' }, 26: { hallazgo: 'Restauración', color: '#3b82f6' }, 36: { hallazgo: 'Extracción', color: '#6b7280' } },
  },
  {
    id: 2,
    nombre: 'Carlos',
    apellido: 'Rodríguez',
    dni: '31789456',
    fechaNacimiento: '1988-07-22',
    telefono: '11-2345-6789',
    email: 'carlos.rodriguez@email.com',
    obraSocial: 'Swiss Medical',
    examenes: [
      {
        id: 1,
        tipo: 'Reconfirmatorio',
        fecha: '2026-09-10',
        signosVitales: { presionArterial: '130/85', frecuenciaCardiaca: 78, peso: 82, altura: 1.78 },
        anamnesis: 'Refiere cefaleas esporádicas. Antecedente de hipertensión familiar.',
        aptitudFisica: 'Apto con restricciones menores',
        observaciones: 'Se sugiere control de presión arterial cada 3 meses.',
      },
    ],
    odontograma: { 11: { hallazgo: 'Restauración', color: '#3b82f6' }, 21: { hallazgo: 'Restauración', color: '#3b82f6' }, 46: { hallazgo: 'Caries', color: '#ef4444' } },
  },
  {
    id: 3,
    nombre: 'Ana',
    apellido: 'Martínez',
    dni: '35123456',
    fechaNacimiento: '1993-11-08',
    telefono: '11-8765-4321',
    email: 'ana.martinez@email.com',
    obraSocial: 'Galeno',
    examenes: [],
    odontograma: {},
  },
  {
    id: 4,
    nombre: 'Jorge',
    apellido: 'López',
    dni: '26890123',
    fechaNacimiento: '1978-01-30',
    telefono: '11-3456-7890',
    email: 'jorge.lopez@email.com',
    obraSocial: 'OSDE',
    examenes: [
      {
        id: 1,
        tipo: 'Periódico',
        fecha: '2026-03-20',
        signosVitales: { presionArterial: '140/90', frecuenciaCardiaca: 85, peso: 95, altura: 1.75 },
        anamnesis: 'Paciente con sobrepeso. Fumador desde hace 15 años. Refiere dolor lumbar crónico.',
        aptitudFisica: 'Apto con restricciones',
        observaciones: 'Se indica plan de cesación tabáquica y derivación a nutrición.',
      },
      {
        id: 2,
        tipo: 'Reconfirmatorio',
        fecha: '2026-08-05',
        signosVitales: { presionArterial: '135/88', frecuenciaCardiaca: 80, peso: 91, altura: 1.75 },
        anamnesis: 'Mejoría en peso. Continúa con plan de cesación tabáquica. Dolor lumbar estable.',
        aptitudFisica: 'Apto con restricciones menores',
        observaciones: 'Evolución favorable. Se mantiene seguimiento trimestral.',
      },
    ],
    odontograma: { 14: { hallazgo: 'Implante', color: '#8b5cf6' }, 24: { hallazgo: 'Caries', color: '#ef4444' }, 37: { hallazgo: 'Extracción', color: '#6b7280' }, 47: { hallazgo: 'Restauración', color: '#3b82f6' } },
  },
  {
    id: 5,
    nombre: 'Lucía',
    apellido: 'Fernández',
    dni: '33567890',
    fechaNacimiento: '1991-05-14',
    telefono: '11-6789-0123',
    email: 'lucia.fernandez@email.com',
    obraSocial: 'Medifé',
    examenes: [
      {
        id: 1,
        tipo: 'Periódico',
        fecha: '2026-10-01',
        signosVitales: { presionArterial: '110/70', frecuenciaCardiaca: 68, peso: 58, altura: 1.65 },
        anamnesis: 'Paciente en excelente estado general. Practica actividad física regularmente.',
        aptitudFisica: 'Apta sin restricciones',
        observaciones: 'Sin hallazgos. Próximo control en 12 meses.',
      },
    ],
    odontograma: { 16: { hallazgo: 'Restauración', color: '#3b82f6' } },
  },
  {
    id: 6,
    nombre: 'Roberto',
    apellido: 'Díaz',
    dni: '29345678',
    fechaNacimiento: '1984-09-02',
    telefono: '11-5678-9012',
    email: 'roberto.diaz@email.com',
    obraSocial: 'Swiss Medical',
    examenes: [],
    odontograma: { 38: { hallazgo: 'Caries', color: '#ef4444' }, 48: { hallazgo: 'Caries', color: '#ef4444' } },
  },
];

export const turnosIniciales = [
  { id: 1, pacienteId: 1, pacienteNombre: 'María González', dni: '28456789', fecha: '2026-10-27', hora: '08:30', especialidad: 'Clínica Médica', estado: 'Finalizado' },
  { id: 2, pacienteId: 2, pacienteNombre: 'Carlos Rodríguez', dni: '31789456', fecha: '2026-10-27', hora: '09:00', especialidad: 'Odontología', estado: 'Finalizado' },
  { id: 3, pacienteId: 3, pacienteNombre: 'Ana Martínez', dni: '35123456', fecha: '2026-10-27', hora: '09:30', especialidad: 'Clínica Médica', estado: 'En curso' },
  { id: 4, pacienteId: 4, pacienteNombre: 'Jorge López', dni: '26890123', fecha: '2026-10-27', hora: '10:00', especialidad: 'Clínica Médica', estado: 'Pendiente' },
  { id: 5, pacienteId: 5, pacienteNombre: 'Lucía Fernández', dni: '33567890', fecha: '2026-10-27', hora: '10:30', especialidad: 'Odontología', estado: 'Pendiente' },
  { id: 6, pacienteId: 6, pacienteNombre: 'Roberto Díaz', dni: '29345678', fecha: '2026-10-27', hora: '11:00', especialidad: 'Odontología', estado: 'Pendiente' },
  { id: 7, pacienteId: 1, pacienteNombre: 'María González', dni: '28456789', fecha: '2026-10-28', hora: '08:00', especialidad: 'Odontología', estado: 'Pendiente' },
  { id: 8, pacienteId: 4, pacienteNombre: 'Jorge López', dni: '26890123', fecha: '2026-10-28', hora: '09:30', especialidad: 'Clínica Médica', estado: 'Pendiente' },
  { id: 9, pacienteId: 2, pacienteNombre: 'Carlos Rodríguez', dni: '31789456', fecha: '2026-10-28', hora: '10:00', especialidad: 'Odontología', estado: 'Pendiente' },
  { id: 10, pacienteId: 3, pacienteNombre: 'Ana Martínez', dni: '35123456', fecha: '2026-10-29', hora: '08:30', especialidad: 'Clínica Médica', estado: 'Pendiente' },
  { id: 11, pacienteId: 5, pacienteNombre: 'Lucía Fernández', dni: '33567890', fecha: '2026-10-29', hora: '09:00', especialidad: 'Clínica Médica', estado: 'Pendiente' },
  { id: 12, pacienteId: 6, pacienteNombre: 'Roberto Díaz', dni: '29345678', fecha: '2026-10-29', hora: '11:30', especialidad: 'Odontología', estado: 'Pendiente' },
];

// Nomenclatura FDI: dientes adultos
// Cuadrante 1 (sup-derecho): 18-11 | Cuadrante 2 (sup-izquierdo): 21-28
// Cuadrante 3 (inf-izquierdo): 38-31 | Cuadrante 4 (inf-derecho): 41-48
export const arcadaSuperiorAdulto = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
export const arcadaInferiorAdulto = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

// Dientes temporales / infantiles (deciduos): Cuadrantes 5, 6, 7 y 8
export const arcadaSuperiorInfantil = [55, 54, 53, 52, 51, 61, 62, 63, 64, 65];
export const arcadaInferiorInfantil = [85, 84, 83, 82, 81, 71, 72, 73, 74, 75];

// Compatibilidad hacia atrás
export const arcadaSuperior = arcadaSuperiorAdulto;
export const arcadaInferior = arcadaInferiorAdulto;

// Nombres clínicos de las 5 superficies
export const carasDentales = [
  { id: 'vestibular', nombre: 'Vestibular (V)', desc: 'Cara externa hacia labios o mejillas' },
  { id: 'palatinaLingual', nombre: 'Palatina / Lingual (P/L)', desc: 'Cara interna hacia paladar o lengua' },
  { id: 'mesial', nombre: 'Mesial (M)', desc: 'Cara proximal hacia la línea media' },
  { id: 'distal', nombre: 'Distal (D)', desc: 'Cara proximal opuesta a la línea media' },
  { id: 'oclusal', nombre: 'Oclusal / Incisal (O/I)', desc: 'Superficie de masticación o corte' },
];

export const hallazgosDentales = [
  { valor: 'Caries', color: '#dc2626', label: 'Caries activa', tipo: 'superficie' },
  { valor: 'Restauración', color: '#2563eb', label: 'Obturación / Empaste', tipo: 'superficie' },
  { valor: 'Sellador', color: '#059669', label: 'Sellador de fosas', tipo: 'superficie' },
  { valor: 'Corona', color: '#d97706', label: 'Corona protésica', tipo: 'general' },
  { valor: 'Endodoncia', color: '#7c3aed', label: 'Tratamiento de conducto', tipo: 'general' },
  { valor: 'Implante', color: '#0891b2', label: 'Implante óseo', tipo: 'general' },
  { valor: 'Extracción', color: '#4b5563', label: 'Pieza ausente / Extracción', tipo: 'general' },
  { valor: 'Sano', color: '#10b981', label: 'Sano / Limpiar', tipo: 'accion' },
];
