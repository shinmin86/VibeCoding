"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus } from 'lucide-react'
import type { Todo } from '@/app/page'

interface AddTodoProps {
  onAdd: (text: string, priority?: Todo['priority'], category?: Todo['category']) => void
}

export function AddTodo({ onAdd }: AddTodoProps) {
  const [text, setText] = useState('')
  const [priority, setPriority] = useState<Todo['priority']>('medium')
  const [category, setCategory] = useState<Todo['category']>('other')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      onAdd(text.trim(), priority, category)
      setText('')
      setPriority('medium')
      setCategory('other')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-3">
        <Input
          type="text"
          placeholder="What needs to be done today?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 text-base bg-black/20 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-yellow-400/20"
        />
        <Button type="submit" size="icon" className="shrink-0 bg-yellow-400 hover:bg-yellow-500 text-black">
          <Plus className="h-5 w-5" />
          <span className="sr-only">할일 추가</span>
        </Button>
      </div>
      
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-sm text-gray-400 mb-2 block tracking-wide">PRIORITY</label>
          <Select value={priority} onValueChange={(value: Todo['priority']) => setPriority(value)}>
            <SelectTrigger className="bg-black/20 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="low" className="text-green-400">🟢 Low</SelectItem>
              <SelectItem value="medium" className="text-yellow-400">🟡 Medium</SelectItem>
              <SelectItem value="high" className="text-red-400">🔴 High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-1">
          <label className="text-sm text-gray-400 mb-2 block tracking-wide">CATEGORY</label>
          <Select value={category} onValueChange={(value: Todo['category']) => setCategory(value)}>
            <SelectTrigger className="bg-black/20 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="work" className="text-white">💼 Work</SelectItem>
              <SelectItem value="personal" className="text-white">🏠 Personal</SelectItem>
              <SelectItem value="shopping" className="text-white">🛒 Shopping</SelectItem>
              <SelectItem value="health" className="text-white">🏥 Health</SelectItem>
              <SelectItem value="other" className="text-white">📝 Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </form>
  )
}
