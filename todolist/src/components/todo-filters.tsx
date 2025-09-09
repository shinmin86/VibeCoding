"use client"

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Category {
  value: string
  label: string
  icon: string
}

interface TodoFiltersProps {
  filter: 'all' | 'active' | 'completed'
  setFilter: (filter: 'all' | 'active' | 'completed') => void
  categoryFilter: string
  setCategoryFilter: (category: string) => void
  categories: Category[]
}

export function TodoFilters({ 
  filter, 
  setFilter, 
  categoryFilter, 
  setCategoryFilter, 
  categories 
}: TodoFiltersProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white tracking-wide">FILTERS & SORTING</h3>
      
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Status Filter */}
        <div className="flex-1">
          <label className="text-sm text-gray-400 mb-2 block tracking-wide">STATUS</label>
          <div className="flex rounded-lg bg-black/20 p-1 border border-gray-700">
            <Button
              variant={filter === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
              className={`flex-1 text-xs ${
                filter === 'all' 
                  ? 'bg-yellow-400 text-black hover:bg-yellow-500' 
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              ALL
            </Button>
            <Button
              variant={filter === 'active' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('active')}
              className={`flex-1 text-xs ${
                filter === 'active' 
                  ? 'bg-yellow-400 text-black hover:bg-yellow-500' 
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              ACTIVE
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('completed')}
              className={`flex-1 text-xs ${
                filter === 'completed' 
                  ? 'bg-yellow-400 text-black hover:bg-yellow-500' 
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              DONE
            </Button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex-1">
          <label className="text-sm text-gray-400 mb-2 block tracking-wide">CATEGORY</label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="bg-black/20 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              {categories.map((category) => (
                <SelectItem 
                  key={category.value} 
                  value={category.value}
                  className="text-white hover:bg-gray-800"
                >
                  {category.icon} {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
