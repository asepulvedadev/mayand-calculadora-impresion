import Link from 'next/link';
import { Calculate, ContentCut, Settings, Inventory } from '@mui/icons-material';

export default function AdminDashboard() {
  const stats = [
    { label: 'Cotizaciones Hoy', value: '12', icon: Calculate },
    { label: 'Proyectos Activos', value: '5', icon: ContentCut },
    { label: 'Materiales', value: '24', icon: Inventory },
  ];

  const recentQuotes = [
    { id: 1, client: 'Empresa ABC', type: 'Impresión', amount: '$2,450', date: 'Hoy' },
    { id: 2, client: 'Tech Solutions', type: 'Corte Láser', amount: '$890', date: 'Hoy' },
    { id: 3, client: 'Design Studio', type: 'Impresión', amount: '$1,200', date: 'Ayer' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-white/60 mt-2">Bienvenido al panel de administración de Mayand</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className="p-3 bg-[#458FFF]/20 rounded-lg">
                <stat.icon className="w-6 h-6 text-[#458FFF]" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link 
          href="/admin/calculadora"
          className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all"
        >
          <div className="p-3 bg-[#458FFF]/20 rounded-lg">
            <Calculate className="w-6 h-6 text-[#458FFF]" />
          </div>
          <div>
            <p className="text-white font-semibold">Nueva Cotización</p>
            <p className="text-white/60 text-sm">Impresión Gran Formato</p>
          </div>
        </Link>
        <Link 
          href="/admin/corte-laser"
          className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all"
        >
          <div className="p-3 bg-[#FFD700]/20 rounded-lg">
            <ContentCut className="w-6 h-6 text-[#FFD700]" />
          </div>
          <div>
            <p className="text-white font-semibold">Corte Láser</p>
            <p className="text-white/60 text-sm">Cotizar proyecto</p>
          </div>
        </Link>
        <Link 
          href="/admin/materiales"
          className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all"
        >
          <div className="p-3 bg-green-500/20 rounded-lg">
            <Inventory className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <p className="text-white font-semibold">Materiales</p>
            <p className="text-white/60 text-sm">Gestionar inventario</p>
          </div>
        </Link>
        <Link 
          href="/admin/configuracion-laser"
          className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all"
        >
          <div className="p-3 bg-purple-500/20 rounded-lg">
            <Settings className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <p className="text-white font-semibold">Configuración</p>
            <p className="text-white/60 text-sm">Ajustes de láser</p>
          </div>
        </Link>
      </div>

      {/* Recent Quotes */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Cotizaciones Recientes</h2>
        </div>
        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="text-left text-white/60 text-sm">
                <th className="pb-4 font-medium">Cliente</th>
                <th className="pb-4 font-medium">Tipo</th>
                <th className="pb-4 font-medium">Monto</th>
                <th className="pb-4 font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {recentQuotes.map((quote) => (
                <tr key={quote.id} className="border-b border-white/5 last:border-0">
                  <td className="py-4 text-white font-medium">{quote.client}</td>
                  <td className="py-4 text-white/80">{quote.type}</td>
                  <td className="py-4 text-white font-semibold text-[#FFD700]">{quote.amount}</td>
                  <td className="py-4 text-white/60">{quote.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
