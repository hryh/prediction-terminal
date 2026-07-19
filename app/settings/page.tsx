'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import {
  Settings,
  User,
  Bell,
  Shield,
  Wallet,
  Globe,
  Moon,
  ChevronRight,
  Key,
  ExternalLink,
} from 'lucide-react'

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile')

  const sections = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'wallet', name: 'Wallet', icon: Wallet },
    { id: 'preferences', name: 'Preferences', icon: Globe },
  ]

  return (
    <div className="flex min-h-screen bg-terminal-bg">
      <Sidebar />
      
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-terminal-bg/80 backdrop-blur-md border-b border-terminal-border">
          <div className="px-8 py-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Settings className="w-6 h-6 text-terminal-accent" />
              Settings
            </h1>
          </div>
        </header>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-terminal-card border border-terminal-border rounded-xl p-4 sticky top-24">
                <nav className="space-y-1">
                  {sections.map((section) => {
                    const Icon = section.icon
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          activeSection === section.id
                            ? 'bg-terminal-accent text-white'
                            : 'text-gray-400 hover:text-white hover:bg-terminal-border'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{section.name}</span>
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      </button>
                    )
                  })}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              {activeSection === 'profile' && (
                <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
                  <h2 className="text-lg font-semibold mb-6">Profile Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-2xl font-bold">
                        PT
                      </div>
                      <div>
                        <button className="px-4 py-2 bg-terminal-border rounded-lg text-sm font-medium hover:bg-terminal-border/80 transition-colors">
                          Change Avatar
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm text-terminal-muted mb-2">Display Name</label>
                        <input
                          type="text"
                          defaultValue="Prediction Terminal"
                          className="w-full px-4 py-2 bg-terminal-bg border border-terminal-border rounded-lg focus:outline-none focus:border-terminal-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-terminal-muted mb-2">Email</label>
                        <input
                          type="email"
                          defaultValue="user@example.com"
                          className="w-full px-4 py-2 bg-terminal-bg border border-terminal-border rounded-lg focus:outline-none focus:border-terminal-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-terminal-muted mb-2">Username</label>
                        <input
                          type="text"
                          defaultValue="@predterminal"
                          className="w-full px-4 py-2 bg-terminal-bg border border-terminal-border rounded-lg focus:outline-none focus:border-terminal-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-terminal-muted mb-2">Timezone</label>
                        <select className="w-full px-4 py-2 bg-terminal-bg border border-terminal-border rounded-lg focus:outline-none focus:border-terminal-accent">
                          <option>UTC-5 (Eastern Time)</option>
                          <option>UTC-8 (Pacific Time)</option>
                          <option>UTC+0 (GMT)</option>
                          <option>UTC+1 (Central European)</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-terminal-border">
                      <button className="px-6 py-2 bg-terminal-accent text-white rounded-lg font-medium hover:bg-terminal-accent/90 transition-colors">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'notifications' && (
                <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
                  <h2 className="text-lg font-semibold mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    {[
                      { name: 'Price Alerts', desc: 'Get notified when markets hit your target prices', default: true },
                      { name: 'News Alerts', desc: 'Breaking news that affects your watchlist', default: true },
                      { name: 'Arbitrage Opportunities', desc: 'New cross-platform price differences', default: false },
                      { name: 'Whale Activity', desc: 'Large position movements in tracked markets', default: true },
                      { name: 'Market Open/Close', desc: 'Notifications for market events', default: false },
                    ].map((item) => (
                      <div key={item.name} className="flex items-center justify-between py-4 border-b border-terminal-border last:border-0">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-terminal-muted">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked={item.default} className="sr-only peer" />
                          <div className="w-11 h-6 bg-terminal-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-terminal-accent"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'security' && (
                <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
                  <h2 className="text-lg font-semibold mb-6">Security Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between py-4 border-b border-terminal-border">
                      <div className="flex items-center gap-3">
                        <Key className="w-5 h-5 text-terminal-muted" />
                        <div>
                          <h3 className="font-medium">Two-Factor Authentication</h3>
                          <p className="text-sm text-terminal-muted">Add an extra layer of security</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-terminal-border rounded-lg text-sm font-medium hover:bg-terminal-border/80 transition-colors">
                        Enable
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-terminal-border">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-terminal-muted" />
                        <div>
                          <h3 className="font-medium">API Keys</h3>
                          <p className="text-sm text-terminal-muted">Manage your API access</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-terminal-border rounded-lg text-sm font-medium hover:bg-terminal-border/80 transition-colors">
                        Manage
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-4">
                      <div className="flex items-center gap-3">
                        <ExternalLink className="w-5 h-5 text-terminal-muted" />
                        <div>
                          <h3 className="font-medium">Connected Wallets</h3>
                          <p className="text-sm text-terminal-muted">2 wallets connected</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-terminal-border rounded-lg text-sm font-medium hover:bg-terminal-border/80 transition-colors">
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'wallet' && (
                <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
                  <h2 className="text-lg font-semibold mb-6">Wallet Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="p-4 bg-terminal-bg rounded-lg border border-terminal-border">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                            <Wallet className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">Primary Wallet</h3>
                            <p className="text-sm text-terminal-muted">0x7a2...9f3b</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-terminal-success/10 text-terminal-success rounded text-xs">
                          Connected
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 py-2 bg-terminal-border rounded-lg text-sm font-medium hover:bg-terminal-border/80 transition-colors">
                          Disconnect
                        </button>
                        <button className="flex-1 py-2 bg-terminal-accent rounded-lg text-sm font-medium hover:bg-terminal-accent/90 transition-colors">
                          Switch
                        </button>
                      </div>
                    </div>

                    <button className="w-full py-3 border-2 border-dashed border-terminal-border rounded-lg text-terminal-muted hover:text-white hover:border-terminal-accent transition-colors">
                      + Connect New Wallet
                    </button>
                  </div>
                </div>
              )}

              {activeSection === 'preferences' && (
                <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
                  <h2 className="text-lg font-semibold mb-6">Preferences</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between py-4 border-b border-terminal-border">
                      <div className="flex items-center gap-3">
                        <Moon className="w-5 h-5 text-terminal-muted" />
                        <div>
                          <h3 className="font-medium">Dark Mode</h3>
                          <p className="text-sm text-terminal-muted">Always use dark theme</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-terminal-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-terminal-accent"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-terminal-border">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-terminal-muted" />
                        <div>
                          <h3 className="font-medium">Currency</h3>
                          <p className="text-sm text-terminal-muted">Display currency for values</p>
                        </div>
                      </div>
                      <select className="px-3 py-2 bg-terminal-bg border border-terminal-border rounded-lg text-sm">
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>GBP (£)</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between py-4">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-terminal-muted" />
                        <div>
                          <h3 className="font-medium">Auto-refresh</h3>
                          <p className="text-sm text-terminal-muted">Update data automatically</p>
                        </div>
                      </div>
                      <select className="px-3 py-2 bg-terminal-bg border border-terminal-border rounded-lg text-sm">
                        <option>Every 5 seconds</option>
                        <option>Every 30 seconds</option>
                        <option>Every minute</option>
                        <option>Manual only</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
