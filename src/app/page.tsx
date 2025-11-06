'use client';

import Link from 'next/link';
import { Calculator, Scissors, BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    {
      title: 'Cotizaciones Hoy',
      value: '12',
      change: '+20%',
      icon: BarChart3,
      color: 'text-blue-400'
    },
    {
      title: 'Ingresos del Mes',
      value: '$45,231',
      change: '+15%',
      icon: DollarSign,
      color: 'text-green-400'
    },
    {
      title: 'Clientes Activos',
      value: '573',
      change: '+8%',
      icon: Users,
      color: 'text-purple-400'
    },
    {
      title: 'Proyectos Completados',
      value: '89',
      change: '+12%',
      icon: TrendingUp,
      color: 'text-orange-400'
    }
  ];

  const quickActions = [
    {
      title: 'Impresión Gran Formato',
      description: 'Cotiza impresión en vinil, lona y materiales especiales',
      href: '/calculadora',
      icon: Calculator,
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    },
    {
      title: 'Corte Láser',
      description: 'Calcula costos de corte láser por material y dimensiones',
      href: '/corte-laser',
      icon: Scissors,
      color: 'bg-green-500/20 text-green-400 border-green-500/30'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard Mayand</h1>
        <p className="text-white/80 text-lg">Sistema de cotización y gestión de proyectos</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                <p className="text-green-400 text-sm mt-1">{stat.change} vs mes anterior</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="block group"
            >
              <div className={`bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 ${action.color}`}>
                <div className="flex items-start space-x-4">
                  <action.icon className="h-8 w-8 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white group-hover:text-white/90 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-white/70 mt-2">
                      {action.description}
                    </p>
                    <div className="mt-4">
                      <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                        Ir a calculadora →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-4">Actividad Reciente</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <div className="flex-1">
              <p className="text-white text-sm">Nueva cotización de impresión generada</p>
              <p className="text-white/60 text-xs">Hace 2 horas</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <div className="flex-1">
              <p className="text-white text-sm">Proyecto de corte láser completado</p>
              <p className="text-white/60 text-xs">Hace 4 horas</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <div className="flex-1">
              <p className="text-white text-sm">Nuevo cliente registrado</p>
              <p className="text-white/60 text-xs">Hace 6 horas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
