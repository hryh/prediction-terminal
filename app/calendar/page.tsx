'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { mockCalendarEvents, CalendarEvent } from '@/lib/mock-data'
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  TrendingUp,
  AlertCircle,
  Filter,
  Bell,
} from 'lucide-react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, getDay } from 'date-fns'

const categories = [
  { value: 'all', label: 'All Events', color: 'bg-terminal-accent' },
  { value: 'economic', label: 'Economic', color: 'bg-terminal-success' },
  { value: 'political', label: 'Political', color: 'bg-purple-500' },
  { value: 'crypto', label: 'Crypto', color: 'bg-orange-500' },
  { value: 'sports', label: 'Sports', color: 'bg-pink-500' },
]

const importanceColors = {
  high: 'border-terminal-danger text-terminal-danger',
  medium: 'border-terminal-warning text-terminal-warning',
  low: 'border-terminal-accent text-terminal-accent',
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const filteredEvents = mockCalendarEvents.filter(
    (event) => selectedCategory === 'all' || event.category === selectedCategory
  )

  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter((event) => isSameDay(event.date, date))
  }

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : []

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
                  <Calendar className="w-6 h-6 text-terminal-accent" />
                  Event Calendar
                </h1>
                <p className="text-sm text-terminal-muted">
                  Track upcoming catalysts and market-moving events
                </p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-terminal-card border border-terminal-border rounded-lg text-sm hover:bg-terminal-border transition-colors">
                <Bell className="w-4 h-4" />
                Set Alerts
              </button>
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Calendar */}
            <div className="lg:col-span-3">
              <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">
                    {format(currentDate, 'MMMM yyyy')}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                      className="p-2 hover:bg-terminal-border rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCurrentDate(new Date())}
                      className="px-4 py-2 text-sm font-medium hover:bg-terminal-border rounded-lg transition-colors"
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                      className="p-2 hover:bg-terminal-border rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-terminal-muted py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: getDay(monthStart) }).map((_, index) => (
                    <div key={`empty-${index}`} className="aspect-square" />
                  ))}
                  {daysInMonth.map((date) => {
                    const events = getEventsForDate(date)
                    const isSelected = selectedDate && isSameDay(date, selectedDate)
                    const isToday = isSameDay(date, new Date())

                    return (
                      <button
                        key={date.toISOString()}
                        onClick={() => setSelectedDate(date)}
                        className={`aspect-square p-2 rounded-lg border transition-all ${
                          isSelected
                            ? 'border-terminal-accent bg-terminal-accent/10'
                            : 'border-terminal-border hover:border-terminal-accent/50'
                        } ${isToday ? 'ring-2 ring-terminal-accent ring-offset-2 ring-offset-terminal-bg' : ''}`}
                      >
                        <div className="text-sm font-medium mb-1">{format(date, 'd')}</div>
                        <div className="flex flex-wrap gap-1">
                          {events.slice(0, 3).map((event, idx) => {
                            const category = categories.find((c) => c.value === event.category)
                            return (
                              <div
                                key={idx}
                                className={`w-2 h-2 rounded-full ${category?.color || 'bg-terminal-accent'}`}
                              />
                            )
                          })}
                          {events.length > 3 && (
                            <span className="text-xs text-terminal-muted">+{events.length - 3}</span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Upcoming Events List */}
              <div className="mt-8 bg-terminal-card border border-terminal-border rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
                <div className="space-y-4">
                  {filteredEvents
                    .filter((event) => event.date >= new Date())
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .slice(0, 5)
                    .map((event) => {
                      const category = categories.find((c) => c.value === event.category)
                      return (
                        <div
                          key={event.id}
                          className="flex items-start gap-4 p-4 bg-terminal-bg rounded-lg border border-terminal-border"
                        >
                          <div className={`w-3 h-3 rounded-full mt-1.5 ${category?.color}`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium">{event.title}</h3>
                              <span className={`px-2 py-0.5 rounded text-xs border ${importanceColors[event.importance]}`}>
                                {event.importance}
                              </span>
                            </div>
                            <p className="text-sm text-terminal-muted">
                              {format(event.date, 'MMMM d, yyyy')} • {category?.label}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {event.affectedMarkets.map((market, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-terminal-card rounded text-xs text-terminal-accent"
                                >
                                  {market}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Category Filter */}
              <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5" />
                  <h2 className="font-semibold">Categories</h2>
                </div>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.value
                          ? 'bg-terminal-accent text-white'
                          : 'hover:bg-terminal-border text-gray-400'
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full ${category.color}`} />
                      <span className="text-sm">{category.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Date Events */}
              {selectedDate && (
                <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
                  <h2 className="font-semibold mb-4">
                    {format(selectedDate, 'MMMM d, yyyy')}
                  </h2>
                  {selectedDateEvents.length > 0 ? (
                    <div className="space-y-3">
                      {selectedDateEvents.map((event) => {
                        const category = categories.find((c) => c.value === event.category)
                        return (
                          <div
                            key={event.id}
                            className="p-3 bg-terminal-bg rounded-lg border border-terminal-border"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className={`w-2 h-2 rounded-full ${category?.color}`} />
                              <span className="text-xs text-terminal-muted">{category?.label}</span>
                            </div>
                            <h3 className="text-sm font-medium mb-1">{event.title}</h3>
                            <span className={`text-xs px-1.5 py-0.5 rounded border ${importanceColors[event.importance]}`}>
                              {event.importance}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-terminal-muted">No events on this date</p>
                  )}
                </div>
              )}

              {/* Legend */}
              <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
                <h2 className="font-semibold mb-4">Importance Levels</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full border-2 border-terminal-danger" />
                    <span className="text-sm">High - Major market impact</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full border-2 border-terminal-warning" />
                    <span className="text-sm">Medium - Moderate impact</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full border-2 border-terminal-accent" />
                    <span className="text-sm">Low - Minor impact</span>
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
