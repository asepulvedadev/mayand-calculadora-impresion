import Link from 'next/link';
import { Calculator, Scissors, Settings, Layers, FolderOpen, ArrowRight, TrendingUp, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { label: 'Cotizaciones Hoy', value: '12', icon: TrendingUp, color: '#458FFF' },
    { label: 'Proyectos Activos', value: '5', icon: Clock, color: '#FFD700' },
    { label: 'Materiales', value: '24', icon: Layers, color: '#A855F7' },
  ];

  const quickActions = [
    { label: 'Nueva Cotización', desc: 'Impresión Gran Formato', href: '/admin/calculadora', icon: Calculator, color: '#458FFF' },
    { label: 'Corte Láser', desc: 'Cotizar proyecto', href: '/admin/corte-laser', icon: Scissors, color: '#FFD700' },
    { label: 'Catálogo', desc: 'Gestionar productos', href: '/admin/catalogo', icon: FolderOpen, color: '#22c55e' },
    { label: 'Configuración', desc: 'Ajustes de láser', href: '/admin/configuracion-laser', icon: Settings, color: '#A855F7' },
  ];

  const recentQuotes = [
    { id: 1, client: 'Empresa ABC', type: 'Impresión', amount: '$2,450', date: 'Hoy' },
    { id: 2, client: 'Tech Solutions', type: 'Corte Láser', amount: '$890', date: 'Hoy' },
    { id: 3, client: 'Design Studio', type: 'Impresión', amount: '$1,200', date: 'Ayer' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-white/30 text-xs sm:text-sm mt-1">Panel de administración de Mayand</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/30 text-[10px] sm:text-xs font-medium uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl sm:text-3xl font-black text-white mt-1">{stat.value}</p>
              </div>
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: stat.color + '15' }}>
                <stat.icon size={18} style={{ color: stat.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all active:scale-[0.98]"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: action.color + '15' }}>
              <action.icon size={16} style={{ color: action.color }} />
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs sm:text-sm font-semibold truncate">{action.label}</p>
              <p className="text-white/25 text-[10px] sm:text-xs truncate">{action.desc}</p>
            </div>
            <ArrowRight size={14} className="text-white/10 group-hover:text-white/30 transition-colors ml-auto shrink-0 hidden sm:block" />
          </Link>
        ))}
      </div>

      {/* Recent Quotes */}
      <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-white/[0.06]">
          <h2 className="text-sm sm:text-base font-bold text-white">Cotizaciones Recientes</h2>
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-white/[0.04]">
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-white/25">Cliente</th>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-white/25">Tipo</th>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-white/25">Monto</th>
                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-white/25">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {recentQuotes.map((quote) => (
                <tr key={quote.id} className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5 text-white text-sm font-medium">{quote.client}</td>
                  <td className="px-5 py-3.5 text-white/50 text-sm">{quote.type}</td>
                  <td className="px-5 py-3.5 text-[#FFD700] text-sm font-semibold">{quote.amount}</td>
                  <td className="px-5 py-3.5 text-white/30 text-sm">{quote.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden divide-y divide-white/[0.04]">
          {recentQuotes.map((quote) => (
            <div key={quote.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">{quote.client}</p>
                <p className="text-white/30 text-xs">{quote.type} · {quote.date}</p>
              </div>
              <p className="text-[#FFD700] text-sm font-semibold">{quote.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
