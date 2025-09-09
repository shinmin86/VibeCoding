'use client'

import { useState, useEffect } from 'react'
import { TodoItem } from '@/components/todo-item'
import { AddTodo } from '@/components/add-todo'
import { ProgressBar } from '@/components/progress-bar'
import { TodoFilters } from '@/components/todo-filters'
import { useLocalStorage } from '@/hooks/useLocalStorage'

export interface Todo {
  id: string
  text: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  category: 'work' | 'personal' | 'shopping' | 'health' | 'other'
  createdAt: Date
  updatedAt: Date
}

export default function HomePage() {
  const [todos, setTodos] = useLocalStorage<Todo[]>('ny-todos', [])
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [editingId, setEditingId] = useState<string | null>(null)

  const addTodo = (text: string, priority: Todo['priority'] = 'medium', category: Todo['category'] = 'other') => {
    const now = new Date()
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      priority,
      category,
      createdAt: now,
      updatedAt: now,
    }
    setTodos((prev) => [...prev, newTodo])
  }

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed, updatedAt: new Date() } : todo
      )
    )
  }

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  const editTodo = (id: string, newText: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, text: newText, updatedAt: new Date() } : todo
      )
    )
    setEditingId(null)
  }

  const updateTodoPriority = (id: string, priority: Todo['priority']) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, priority, updatedAt: new Date() } : todo
      )
    )
  }

  // Filter todos based on status and category
  const filteredTodos = todos
    .filter((todo) => {
      if (filter === 'active') return !todo.completed
      if (filter === 'completed') return todo.completed
      return true
    })
    .filter((todo) => {
      if (categoryFilter === 'all') return true
      return todo.category === categoryFilter
    })
    .sort((a, b) => {
      // Sort by priority (high -> medium -> low) then by creation date
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    })

  const completedCount = filteredTodos.filter((todo) => todo.completed).length
  const totalCount = filteredTodos.length
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  // Categories for filtering
  const categories = [
    { value: 'all', label: 'All Categories', icon: '📋' },
    { value: 'work', label: 'Work', icon: '💼' },
    { value: 'personal', label: 'Personal', icon: '🏠' },
    { value: 'shopping', label: 'Shopping', icon: '🛒' },
    { value: 'health', label: 'Health', icon: '🏥' },
    { value: 'other', label: 'Other', icon: '📝' },
  ]

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when not editing
      if (editingId || document.activeElement?.tagName === 'INPUT') return

      switch (e.key) {
        case '1':
          setFilter('all')
          break
        case '2':
          setFilter('active')
          break
        case '3':
          setFilter('completed')
          break
        case 'a':
        case 'A':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            // Focus on add todo input
            const input = document.querySelector('input[placeholder*="What needs"]') as HTMLInputElement
            input?.focus()
          }
          break
        case 'Escape':
          setEditingId(null)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [editingId, setFilter])

  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  return (
    <div className="min-h-screen ny-cityscape">
      <div className="min-h-screen ny-gradient">
        <div className="container mx-auto max-w-4xl px-6 py-12">
          <header className="text-center mb-16">
            <div className="mb-6">
              <h1 className="ny-title text-white mb-4">
                TODAY'S 
                <span className="ny-gold-accent"> AGENDA</span>
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mb-6"></div>
              <p className="ny-subtitle text-gray-300">{today}</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 text-gray-400 text-sm tracking-wider">
                <span>🏙️</span>
                <span>NEW YORK STYLE PRODUCTIVITY</span>
                <span>🏙️</span>
              </div>
            </div>
          </header>

          <div className="ny-card rounded-lg p-8 mb-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-4 tracking-wide">ADD NEW TASK</h2>
              <AddTodo onAdd={addTodo} />
            </div>
          </div>

          {todos.length > 0 && (
            <div className="ny-card rounded-lg p-8 mb-8">
              <TodoFilters
                filter={filter}
                setFilter={setFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                categories={categories}
              />
            </div>
          )}

          {totalCount > 0 && (
            <div className="ny-card rounded-lg p-8 mb-8">
              <ProgressBar 
                progress={progress} 
                completed={completedCount} 
                total={totalCount} 
              />
            </div>
          )}

          <div className="ny-card rounded-lg p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white tracking-wide flex items-center">
                <span className="mr-3">📋</span>
                TASK LIST
                {totalCount > 0 && (
                  <span className="ml-auto text-sm ny-gold-accent bg-black/30 px-3 py-1 rounded-full">
                    {totalCount} ITEMS
                  </span>
                )}
              </h2>
            </div>
            
            {filteredTodos.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-8xl mb-6 opacity-20">
                  {todos.length === 0 ? '🗽' : '🔍'}
                </div>
                <p className="text-gray-400 text-lg tracking-wide mb-2">
                  {todos.length === 0 ? 'NO TASKS YET' : 'NO MATCHING TASKS'}
                </p>
                <p className="text-gray-500 text-sm tracking-wider uppercase">
                  {todos.length === 0 
                    ? 'Start building your empire, one task at a time'
                    : 'Try adjusting your filters'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                    onEdit={editTodo}
                    onUpdatePriority={updateTodoPriority}
                    isEditing={editingId === todo.id}
                    setIsEditing={(editing) => setEditingId(editing ? todo.id : null)}
                  />
                ))}
              </div>
            )}
          </div>
          
          <footer className="text-center mt-12 space-y-4">
            <div className="ny-card rounded-lg p-4">
              <h4 className="text-sm font-semibold text-white mb-3 tracking-wide">KEYBOARD SHORTCUTS</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-gray-800 rounded text-yellow-400">1</kbd>
                  <span>All Tasks</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-gray-800 rounded text-yellow-400">2</kbd>
                  <span>Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-gray-800 rounded text-yellow-400">3</kbd>
                  <span>Done</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-gray-800 rounded text-yellow-400">Ctrl+A</kbd>
                  <span>Focus Input</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-gray-800 rounded text-yellow-400">Enter</kbd>
                  <span>Save Edit</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-gray-800 rounded text-yellow-400">Esc</kbd>
                  <span>Cancel Edit</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-gray-800 rounded text-yellow-400">2x Click</kbd>
                  <span>Edit Task</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-gray-800 rounded text-yellow-400">Hover</kbd>
                  <span>Quick Actions</span>
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-xs tracking-widest uppercase">
              Powered by the city that never sleeps
            </p>
          </footer>
        </div>
      </div>
    </div>
  )
}
