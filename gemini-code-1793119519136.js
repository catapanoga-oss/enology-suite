import React, { useState } from 'react';
import { 
  Wine, Calculator, Thermometer, FlaskConical, Scale, 
  ClipboardList, Plus, Trash2, FileSpreadsheet
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('so2');

  // SO2 State
  const [volumeSo2, setVolumeSo2] = useState(1000); // Litros
  const [so2Actual, setSo2Actual] = useState(15);   // mg/L
  const [so2Objetivo, setSo2Objetivo] = useState(35); // mg/L
  const [productoSo2, setProductoSo2] = useState('metabisulfito'); // metabisulfito, liquido10, gas

  // Calculo SO2
  const diffSo2 = Math.max(0, so2Objetivo - so2Actual);
  let cantidadSo2 = 0;
  let aporteK = 0;
  if (productoSo2 === 'metabisulfito') {
    cantidadSo2 = (diffSo2 * volumeSo2) / 570; // en gramos
    aporteK = cantidadSo2 * 0.37; // Aprox K+
  } else if (productoSo2 === 'liquido10') {
    cantidadSo2 = (diffSo2 * volumeSo2) / 100; // en mL o g
  } else {
    cantidadSo2 = (diffSo2 * volumeSo2) / 1000; // en gramos
  }

  // Densidad / Azucar State
  const [tipoLectura, setTipoLectura] = useState('brix');
  const [valorLectura, setValorLectura] = useState(22);
  const [tempMuestra, setTempMuestra] = useState(20);

  let brix = tipoLectura === 'brix' ? Number(valorLectura) : tipoLectura === 'baume' ? Number(valorLectura) / 0.55 : Number(valorLectura) / 10;
  let baume = brix * 0.55;
  let densidad = 1 + (brix / (258.2 - (brix * 0.267)));
  let alcoholProbable = brix * 0.55; 

  // Acidez State
  const [volAcidez, setVolAcidez] = useState(1000);
  const [acidezActual, setAcidezActual] = useState(4.5); 
  const [acidezObjetivo, setAcidezObjetivo] = useState(6.0);
  const diffAcidez = Math.max(0, acidezObjetivo - acidezActual);
  const tartarticoNecesario = diffAcidez * volAcidez; 

  // Coupage State
  const [vol1, setVol1] = useState(5000);
  const [param1, setParam1] = useState(13.5); 
  const [param2, setParam2] = useState(11.5);
  const [paramObj, setParamObj] = useState(12.5);
  
  let vol2Calculado = 0;
  if (paramObj > param2 && param1 > paramObj) {
    vol2Calculado = vol1 * (param1 - paramObj) / (paramObj - param2);
  }

  // Tanques / Seguimiento State
  const [tanques, setTanques] = useState([
    { id: 1, nombre: 'Cuba Inox 01', variedad: 'Malbec', volumen: 10000, densidad: 1080, temperatura: 24, estado: 'Activa' },
    { id: 2, nombre: 'Pileta de Concreto 04', variedad: 'Cabernet Sauvignon', volumen: 15000, densidad: 994, temperatura: 18, estado: 'F. Maloláctica' }
  ]);
  const [nuevoTanque, setNuevoTanque] = useState({ nombre: '', variedad: '', volumen: '', densidad: '', temperatura: '' });

  const agregarTanque = (e) => {
    e.preventDefault();
    if (!nuevoTanque.nombre) return;
    setTanques([...tanques, { ...nuevoTanque, id: Date.now(), estado: 'Activa' }]);
    setNuevoTanque({ nombre: '', variedad: '', volumen: '', densidad: '', temperatura: '' });
  };

  const eliminarTanque = (id) => {
    setTanques(tanques.filter(t => t.id !== id));
  };

  const exportarCSV = () => {
    const headers = "ID,Nombre,Variedad,Volumen(L),Densidad(g/L),Temperatura(°C),Estado\n";
    const rows = tanques.map(t => `${t.id},${t.nombre},${t.variedad},${t.volumen},${t.densidad},${t.temperatura},${t.estado}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "seguimiento_bodega.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#fcfbf8] text-[#1c1c1c] flex flex-col">
      <header className="bg-wine-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3">
            <Wine className="w-8 h-8 text-rose-300" />
            <div>
              <h1 className="text-2xl font-bold tracking-wide">EnologySuite Pro</h1>
              <p className="text-xs text-rose-200">Plataforma Integral de Gestión y Cálculos Enológicos</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            <button 
              onClick={() => setActiveTab('so2')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'so2' ? 'bg-wine-700 text-white shadow' : 'bg-wine-800/60 text-rose-100 hover:bg-wine-800'}`}
            >
              Sulfitado
            </button>
            <button 
              onClick={() => setActiveTab('densidad')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'densidad' ? 'bg-wine-700 text-white shadow' : 'bg-wine-800/60 text-rose-100 hover:bg-wine-800'}`}
            >
              Densidad & Azúcar
            </button>
            <button 
              onClick={() => setActiveTab('acidez')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'acidez' ? 'bg-wine-700 text-white shadow' : 'bg-wine-800/60 text-rose-100 hover:bg-wine-800'}`}
            >
              Acidez
            </button>
            <button 
              onClick={() => setActiveTab('coupage')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'coupage' ? 'bg-wine-700 text-white shadow' : 'bg-wine-800/60 text-rose-100 hover:bg-wine-800'}`}
            >
              Cortes / Coupage
            </button>
            <button 
              onClick={() => setActiveTab('tanques')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'tanques' ? 'bg-wine-700 text-white shadow' : 'bg-wine-800/60 text-rose-100 hover:bg-wine-800'}`}
            >
              Depósitos & Bodega
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {activeTab === 'so2' && (
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
            <div className="flex items-center space-x-3 mb-6 border-b pb-4">
              <Calculator className="w-6 h-6 text-wine-700" />
              <h2 className="text-xl font-semibold text-stone-800">Calculadora de Anhídrido Sulfuroso (SO₂)</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Volumen de Vino / Mosto (Litros)</label>
                  <input 
                    type="number" 
                    value={volumeSo2} 
                    onChange={(e) => setVolumeSo2(Number(e.target.value))}
                    className="w-full rounded-lg border border-stone-300 p-2.5 focus:ring-2 focus:ring-wine-700 focus:outline-none" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">SO₂ Actual (mg/L)</label>
                    <input 
                      type="number" 
                      value={so2Actual} 
                      onChange={(e) => setSo2Actual(Number(e.target.value))}
                      className="w-full rounded-lg border border-stone-300 p-2.5 focus:ring-2 focus:ring-wine-700 focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">SO₂ Objetivo (mg/L)</label>
                    <input 
                      type="number" 
                      value={so2Objetivo} 
                      onChange={(e) => setSo2Objetivo(Number(e.target.value))}
                      className="w-full rounded-lg border border-stone-300 p-2.5 focus:ring-2 focus:ring-wine-700 focus:outline-none" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Producto a Utilizar</label>
                  <select 
                    value={productoSo2} 
                    onChange={(e) => setProductoSo2(e.target.value)}
                    className="w-full rounded-lg border border-stone-300 p-2.5 focus:ring-2 focus:ring-wine-700 focus:outline-none"
                  >
                    <option value="metabisulfito">Metabisulfito de Potasio (Polvo ~57% SO₂)</option>
                    <option value="liquido10">Solución Sulfurosa Líquida (~10%)</option>
                    <option value="gas">SO₂ Gas Puro</option>
                  </select>
                </div>
              </div>

              <div className="bg-stone-50 rounded-xl p-6 border border-stone-200 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-medium text-stone-900 mb-4">Resultado del Cálculo</h3>
                  <div className="space-y-3 text-stone-700">
                    <p className="flex justify-between"><span>Déficit a corregir:</span> <strong className="text-stone-900">{diffSo2.toFixed(1)} mg/L</strong></p>
                    <p className="flex justify-between"><span>Cantidad necesaria:</span> <strong className="text-wine-800 text-xl">{cantidadSo2.toFixed(2)} {productoSo2 === 'metabisulfito' || productoSo2 === 'gas' ? 'gramos (g)' : 'mililitros (mL)'}</strong></p>
                    {productoSo2 === 'metabisulfito' && (
                      <p className="flex justify-between text-sm text-stone-500 pt-2 border-t"><span>Aporte estimado de Potasio (K⁺):</span> <span>{aporteK.toFixed(1)} g</span></p>
                    )}
                  </div>
                </div>
                <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                  <strong>Nota técnica:</strong> Disolver siempre el metabisulfito en una pequeña porción de vino antes de incorporarlo al depósito con agitación homogénea.
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'densidad' && (
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
            <div className="flex items-center space-x-3 mb-6 border-b pb-4">
              <Thermometer className="w-6 h-6 text-wine-700" />
              <h2 className="text-xl font-semibold text-stone-800">Conversor de Densidad, Azúcar y Corrección Térmica</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Tipo de Escala de Lectura</label>
                  <select 
                    value={tipoLectura} 
                    onChange={(e) => setTipoLectura(e.target.value)}
                    className="w-full rounded-lg border border-stone-300 p-2.5 focus:ring-2 focus:ring-wine-700 focus:outline-none"
                  >
                    <option value="brix">Grados Brix (°Bx)</option>
                    <option value="baume">Grados Baumé (°Bé)</option>
                    <option value="density">Densidad (ej. 1080 g/L -> ingrese 1080)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Valor Medido</label>
                  <input 
                    type="number" 
                    value={valorLectura} 
                    onChange={(e) => setValorLectura(Number(e.target.value))}
                    className="w-full rounded-lg border border-stone-300 p-2.5 focus:ring-2 focus:ring-wine-700 focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Temperatura de la Muestra (°C)</label>
                  <input 
                    type="number" 
                    value={tempMuestra} 
                    onChange={(e) => setTempMuestra(Number(e.target.value))}
                    className="w-full rounded-lg border border-stone-300 p-2.5 focus:ring-2 focus:ring-wine-700 focus:outline-none" 
                  />
                  <p className="text-xs text-stone-500 mt-1">Estándar de calibración de mostímetros: 20 °C.</p>
                </div>
              </div>

              <div className="bg-stone-50 rounded-xl p-6 border border-stone-200">
                <h3 className="text-lg font-medium text-stone-900 mb-4">Equivalencias Calculadas</h3>
                <div className="space-y-3 text-stone-700">
                  <p className="flex justify-between"><span>Grados Brix (°Bx):</span> <strong className="text-stone-900">{brix.toFixed(2)} °Bx</strong></p>
                  <p className="flex justify-between"><span>Grados Baumé (°Bé):</span> <strong className="text-stone-900">{baume.toFixed(2)} °Bé</strong></p>
                  <p className="flex justify-between"><span>Densidad Relativa / Absoluta:</span> <strong className="text-stone-900">{densidad.toFixed(4)} g/cm³</strong></p>
                  <p className="flex justify-between border-t pt-2"><span>Grado Alcohólico Probable (aprox.):</span> <strong className="text-wine-800 text-lg">{alcoholProbable.toFixed(1)} % vol</strong></p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'acidez' && (
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
            <div className="flex items-center space-x-3 mb-6 border-b pb-4">
              <FlaskConical className="w-6 h-6 text-wine-700" />
              <h2 className="text-xl font-semibold text-stone-800">Corrección y Ajuste de Acidez</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Volumen de Vino / Mosto (Litros)</label>
                  <input 
                    type="number" 
                    value={volAcidez} 
                    onChange={(e) => setVolAcidez(Number(e.target.value))}
                    className="w-full rounded-lg border border-stone-300 p-2.5 focus:ring-2 focus:ring-wine-700 focus:outline-none" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Acidez Actual (g/L)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={acidezActual} 
                      onChange={(e) => setAcidezActual(Number(e.target.value))}
                      className="w-full rounded-lg border border-stone-300 p-2.5 focus:ring-2 focus:ring-wine-700 focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Acidez Objetivo (g/L)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={acidezObjetivo} 
                      onChange={(e) => setAcidezObjetivo(Number(e.target.value))}
                      className="w-full rounded-lg border border-stone-300 p-2.5 focus:ring-2 focus:ring-wine-700 focus:outline-none" 
                    />
                  </div>
                </div>
              </div>

              <div className="bg-stone-50 rounded-xl p-6 border border-stone-200 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-medium text-stone-900 mb-4">Resultado de Acidificación</h3>
                  <div className="space-y-3 text-stone-700">
                    <p className="flex justify-between"><span>Incremento necesario:</span> <strong className="text-stone-900">{diffAcidez.toFixed(2)} g/L (en Ácido Tartárico)</strong></p>
                    <p className="flex justify-between"><span>Ácido Tartárico Total:</span> <strong className="text-wine-800 text-xl">{(tartarticoNecesario / 1000).toFixed(2)} kg</strong></p>
                  </div>
                </div>
                <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
                  <strong>Recomendación:</strong> Realizar ensayos de estanqueidad y sabor a escala de laboratorio antes de aplicar en grandes volúmenes.
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'coupage' && (
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
            <div className="flex items-center space-x-3 mb-6 border-b pb-4">
              <Scale className="w-6 h-6 text-wine-700" />
              <h2 className="text-xl font-semibold text-stone-800">Cálculo de Cortes / Coupage (Cruz de Pearson)</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Volumen Lote Base 1 (Litros)</label>
                  <input 
                    type="number" 
                    value={vol1} 
                    onChange={(e) => setVol1(Number(e.target.value))}
                    className="w-full rounded-lg border border-stone-300 p-2.5 focus:ring-2 focus:ring-wine-700 focus:outline-none" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Parámetro Lote 1 (% vol / g/L)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={param1} 
                      onChange={(e) => setParam1(Number(e.target.value))}
                      className="w-full rounded-lg border border-stone-300 p-2.5 focus:ring-2 focus:ring-wine-700 focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Parámetro Lote 2</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={param2} 
                      onChange={(e) => setParam2(Number(e.target.value))}
                      className="w-full rounded-lg border border-stone-300 p-2.5 focus:ring-2 focus:ring-wine-700 focus:outline-none" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Parámetro Objetivo Deseado</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={paramObj} 
                    onChange={(e) => setParamObj(Number(e.target.value))}
                    className="w-full rounded-lg border border-stone-300 p-2.5 focus:ring-2 focus:ring-wine-700 focus:outline-none" 
                  />
                </div>
              </div>

              <div className="bg-stone-50 rounded-xl p-6 border border-stone-200">
                <h3 className="text-lg font-medium text-stone-900 mb-4">Proporción de Mezcla</h3>
                <div className="space-y-3 text-stone-700">
                  <p className="flex justify-between"><span>Volumen necesario del Lote 2:</span> <strong className="text-wine-800 text-xl">{vol2Calculado > 0 ? vol2Calculado.toFixed(0) : 'Revisar valores'} L</strong></p>
                  <p className="flex justify-between border-t pt-2"><span>Volumen Final Resultante:</span> <strong className="text-stone-900">{(vol1 + (vol2Calculado > 0 ? vol2Calculado : 0)).toFixed(0)} L</strong></p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tanques' && (
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-4 gap-4">
              <div className="flex items-center space-x-3">
                <ClipboardList className="w-6 h-6 text-wine-700" />
                <h2 className="text-xl font-semibold text-stone-800">Control de Depósitos y Fermentación</h2>
              </div>
              <button 
                onClick={exportarCSV}
                className="flex items-center space-x-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Exportar CSV / Excel</span>
              </button>
            </div>

            <form onSubmit={agregarTanque} className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-6 bg-stone-50 p-4 rounded-xl border border-stone-200">
              <input 
                type="text" 
                placeholder="Nombre / Depósito" 
                value={nuevoTanque.nombre}
                onChange={(e) => setNuevoTanque({...nuevoTanque, nombre: e.target.value})}
                className="rounded-lg border border-stone-300 p-2 text-sm focus:ring-2 focus:ring-wine-700 focus:outline-none"
              />
              <input 
                type="text" 
                placeholder="Variedad" 
                value={nuevoTanque.variedad}
                onChange={(e) => setNuevoTanque({...nuevoTanque, variedad: e.target.value})}
                className="rounded-lg border border-stone-300 p-2 text-sm focus:ring-2 focus:ring-wine-700 focus:outline-none"
              />
              <input 
                type="number" 
                placeholder="Volumen (L)" 
                value={nuevoTanque.volumen}
                onChange={(e) => setNuevoTanque({...nuevoTanque, volumen: e.target.value})}
                className="rounded-lg border border-stone-300 p-2 text-sm focus:ring-2 focus:ring-wine-700 focus:outline-none"
              />
              <input 
                type="number" 
                placeholder="Densidad (g/L)" 
                value={nuevoTanque.densidad}
                onChange={(e) => setNuevoTanque({...nuevoTanque, densidad: e.target.value})}
                className="rounded-lg border border-stone-300 p-2 text-sm focus:ring-2 focus:ring-wine-700 focus:outline-none"
              />
              <input 
                type="number" 
                placeholder="Temp (°C)" 
                value={nuevoTanque.temperatura}
                onChange={(e) => setNuevoTanque({...nuevoTanque, temperatura: e.target.value})}
                className="rounded-lg border border-stone-300 p-2 text-sm focus:ring-2 focus:ring-wine-700 focus:outline-none"
              />
              <button type="submit" className="flex items-center justify-center space-x-1 bg-wine-800 hover:bg-wine-900 text-white rounded-lg p-2 text-sm font-medium transition">
                <Plus className="w-4 h-4" />
                <span>Agregar</span>
              </button>
            </form>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-100 text-stone-700 text-xs uppercase tracking-wider border-b border-stone-200">
                    <th className="p-3">Depósito</th>
                    <th className="p-3">Variedad</th>
                    <th className="p-3">Volumen (L)</th>
                    <th className="p-3">Densidad</th>
                    <th className="p-3">Temperatura</th>
                    <th className="p-3">Estado</th>
                    <th className="p-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 text-sm">
                  {tanques.map((t) => (
                    <tr key={t.id} className="hover:bg-stone-50/50">
                      <td className="p-3 font-medium text-stone-900">{t.nombre}</td>
                      <td className="p-3 text-stone-700">{t.variedad}</td>
                      <td className="p-3 text-stone-700">{Number(t.volumen).toLocaleString()} L</td>
                      <td className="p-3 text-stone-700">{t.densidad} g/L</td>
                      <td className="p-3 text-stone-700">{t.temperatura} °C</td>
                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          {t.estado}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button 
                          onClick={() => eliminarTanque(t.id)} 
                          className="text-rose-600 hover:text-rose-800 p-1 rounded transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-stone-100 border-t border-stone-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-stone-500">
          EnologySuite Pro &copy; 2026 — Desarrollado para gestión técnica enológica y de bodegas.
        </div>
      </footer>
    </div>
  );
}