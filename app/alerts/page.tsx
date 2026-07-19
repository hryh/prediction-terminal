'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import {
  Bell,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  TrendingDown,
  Mail,
  Smartphone,
  Slack,
} from 'lucide-react'

interface Alert {
  id: string
  name: string
  type: 'price' | 'volume' | 'news' | 'arbitrage'
  condition: string
  value: string
  isActive: boolean
  notifications: string[]
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    name: 'Trump Election Odds',
    type: 'price',
    condition: 'Above',
    value: '60%',
    isActive: true,
    notifications: ['email', 'push'],
  },
  {
    id: '2',
    name: 'High Volume Alert',
    type: 'volume',
    condition: 'Exceeds',
    value: '$10M',
    isActive: true,
    notifications: ['email'],
  },
  {
    id: '3',
    name: 'Arbitrage Opportunity',
    type: 'arbitrage',
    condition: 'ROI Above',
    value: '5%',
    isActive: false,
    notifications: ['push', 'slack'],
  },
]

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map(a => 
      a.id === id ? { ...a, isActive: !a.isActive } : a
    ))
  }

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id))
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'price':
        return <TrendingUp className="w-5 h-5" />
      case 'volume':
        return <TrendingDown className="w-5 h-5" />
      case 'arbitrage':
        return <Bell className="w-5 h-5" />
      default:
        return <Bell className="w-5 h-5" />
    }
  }

  return (
    <div className="flex min-h-screen bg-terminal-bg">
      <Sidebar />
      
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-terminal-bg/80 backdrop-blur-md border-b border-terminal-border">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Bell className="w-6 h-6 text-terminal-accent" />
                  Alerts
                </h1>
                <p className="text-sm text-terminal-muted">
                  Monitor markets and get notified
                </p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-terminal-accent hover:bg-terminal-accent/90 text-white rounded-lg text-sm font-medium transition-colors">
                <Plus className="w-4 h-4" />
                New Alert
              </button>
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Alerts List */}
            <div className="lg:col-span-2">
              <div className="bg-terminal-card border border-terminal-border rounded-xl overflow-hidden">
                <div className="p-4 border-b border-terminal-border">
                  <h2 className="font-semibold">Your Alerts</h2>
                </div>
                
                {alerts.length > 0 ? (
                  <div className="divide-y divide-terminal-border">
                    {alerts.map((alert) => (
                      <div key={alert.id} className="p-6 hover:bg-terminal-border/30 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className={`p-2 rounded-lg ${
                              alert.isActive ? 'bg-terminal-accent/10 text-terminal-accent' : 'bg-terminal-border text-terminal-muted'
                            }`}>
                              {getAlertIcon(alert.type)}
                            </div>
                            <div>
                              <h3 className="font-medium">{alert.name}</h3>
                              <p className="text-sm text-terminal-muted mt-1">
                                {alert.condition} {alert.value}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                {alert.notifications.includes('email') && (
                                  <Mail className="w-4 h-4 text-terminal-muted" />
                                )}
                                {alert.notifications.includes('push') && (
                                  <Smartphone className="w-4 h-4 text-terminal-muted" />
                                )}
                                {alert.notifications.includes('slack') && (
                                  <Slack className="w-4 h-4 text-terminal-muted" />
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleAlert(alert.id)}
                              className="p-2 hover:bg-terminal-border rounded-lg transition-colors"
                            >
                              {alert.isActive ? (
                                <ToggleRight className="w-6 h-6 text-terminal-success" />
                              ) : (
                                <ToggleLeft className="w-6 h-6 text-terminal-muted" />
                              )}
                            </button>
                            <button
                              onClick={() => deleteAlert(alert.id)}
                              className="p-2 hover:bg-terminal-border rounded-lg transition-colors text-terminal-danger"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <Bell className="w-12 h-12 text-terminal-muted mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No alerts yet</h3>
                    <p className="text-sm text-terminal-muted mb-4">Create your first alert to get notified</p>
                    <button className="px-4 py-2 bg-terminal-accent text-white rounded-lg text-sm font-medium">
                      Create Alert
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stats */}
              <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
                <h2 className="font-semibold mb-4">Alert Stats</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-terminal-muted">Total Alerts</span>
                    <span className="font-medium">{alerts.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-terminal-muted">Active</span>
                    <span className="font-medium text-terminal-success">
                      {alerts.filter(a => a.isActive).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-terminal-muted">Triggered (24h)</span>
                    <span className="font-medium">12</span>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
                <h2 className="font-semibold mb-4">Notification Channels</h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-terminal-border" />
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">Email notifications</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-terminal-border" />
                    <Smartphone className="w-4 h-4" />
                    <span className="text-sm">Push notifications</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-terminal-border" />
                    <Slack className="w-4 h-4" />
                    <span className="text-sm">Slack integration</span>
                  </label>
                </div>
              </div>

              {/* Alert Types */}
              <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
                <h2 className="font-semibold mb-4">Alert Types</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-terminal-accent" />
                    <span>Price movements</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-terminal-success" />
                    <span>Volume spikes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-terminal-warning" />
                    <span>News impact</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-purple-500" />
                    <span>Arbitrage opportunities</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
