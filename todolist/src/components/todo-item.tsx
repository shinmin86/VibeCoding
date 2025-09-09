"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2, Edit3, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Todo } from '@/app/page'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, newText: string) => void
  onUpdatePriority: (id: string, priority: Todo['priority']) => void
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
}

export function TodoItem({ 
  todo, 
  onToggle, 
  onDelete, 
  onEdit, 
  onUpdatePriority, 
  isEditing, 
  setIsEditing 
}: TodoItemProps) {
  const [editText, setEditText] = useState(todo.text)

  const handleEdit = () => {
    if (editText.trim() !== todo.text) {
      onEdit(todo.id, editText.trim())
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditText(todo.text)
    setIsEditing(false)
  }

  const getPriorityColor = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-400/10 border-red-400/20'
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      case 'low': return 'text-green-400 bg-green-400/10 border-green-400/20'
    }
  }

  const getPriorityIcon = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high': return '🔴'
      case 'medium': return '🟡'
      case 'low': return '🟢'
    }
  }

  const getCategoryIcon = (category: Todo['category']) => {
    switch (category) {
      case 'work': return '💼'
      case 'personal': return '🏠'
      case 'shopping': return '🛒'
      case 'health': return '🏥'
      case 'other': return '📝'
    }
  }

  return (
    <div className="group flex items-center gap-4 p-4 rounded-lg bg-black/20 border border-gray-700 hover:border-yellow-400/50 hover:bg-black/30 transition-all duration-200">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        className="shrink-0 border-gray-500 data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400 data-[state=checked]:text-black"
      />
      
      <div className="flex-1 space-y-2">
        {isEditing ? (
          <div className="flex gap-2">
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="flex-1 bg-black/20 border-gray-600 text-white"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleEdit()
                if (e.key === 'Escape') handleCancel()
              }}
              autoFocus
            />
            <Button size="sm" onClick={handleEdit} className="bg-green-600 hover:bg-green-700">
              <Check className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleCancel} className="text-gray-400">
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <span
            className={cn(
              "block text-base tracking-wide transition-all duration-200",
              todo.completed 
                ? "line-through text-gray-500" 
                : "text-gray-200 group-hover:text-white"
            )}
            onDoubleClick={() => !todo.completed && setIsEditing(true)}
          >
            {todo.text}
          </span>
        )}
        
        <div className="flex items-center gap-2 text-xs">
          <span className={`px-2 py-1 rounded-full border ${getPriorityColor(todo.priority)}`}>
            {getPriorityIcon(todo.priority)} {todo.priority.toUpperCase()}
          </span>
          <span className="text-gray-500 bg-gray-800/50 px-2 py-1 rounded-full">
            {getCategoryIcon(todo.category)} {todo.category.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {todo.completed && (
          <span className="text-xs ny-gold-accent bg-yellow-400/10 px-2 py-1 rounded-full border border-yellow-400/20">
            DONE
          </span>
        )}
        
        {!todo.completed && (
          <Select value={todo.priority} onValueChange={(value: Todo['priority']) => onUpdatePriority(todo.id, value)}>
            <SelectTrigger className="w-20 h-8 bg-black/20 border-gray-600 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="low" className="text-green-400">🟢</SelectItem>
              <SelectItem value="medium" className="text-yellow-400">🟡</SelectItem>
              <SelectItem value="high" className="text-red-400">🔴</SelectItem>
            </SelectContent>
          </Select>
        )}
        
        {!todo.completed && !isEditing && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
            className="shrink-0 text-gray-500 hover:text-blue-400 hover:bg-blue-400/10 opacity-0 group-hover:opacity-100 transition-all duration-200 h-8 w-8"
          >
            <Edit3 className="h-3 w-3" />
            <span className="sr-only">수정</span>
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(todo.id)}
          className="shrink-0 text-gray-500 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all duration-200 h-8 w-8"
        >
          <Trash2 className="h-3 w-3" />
          <span className="sr-only">삭제</span>
        </Button>
      </div>
    </div>
  )
}
