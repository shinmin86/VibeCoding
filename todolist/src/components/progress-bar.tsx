"use client"

import { Progress } from '@/components/ui/progress'

interface ProgressBarProps {
  progress: number
  completed: number
  total: number
}

export function ProgressBar({ progress, completed, total }: ProgressBarProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white tracking-wide">
          PROGRESS REPORT
        </h3>
        <span className="text-sm text-gray-400 bg-black/30 px-3 py-1 rounded-full tracking-wider">
          {completed}/{total} COMPLETED
        </span>
      </div>
      <div className="relative">
        <Progress value={progress} className="h-4 bg-gray-800 border border-gray-700" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 opacity-90" 
             style={{ width: `${progress}%` }}></div>
      </div>
      <div className="text-center">
        <div className="mb-3">
          <span className="text-4xl font-bold ny-gold-accent">
            {Math.round(progress)}%
          </span>
          <span className="text-gray-400 ml-2 text-lg">COMPLETE</span>
        </div>
        <div className="flex items-center justify-center space-x-2">
          {progress === 100 ? (
            <>
              <span className="text-2xl">🏆</span>
              <p className="text-sm text-gray-300 tracking-wider uppercase">
                Mission Accomplished!
              </p>
              <span className="text-2xl">🏆</span>
            </>
          ) : (
            <>
              <span className="text-lg">⚡</span>
              <p className="text-sm text-gray-400 tracking-wider uppercase">
                Keep building your empire
              </p>
              <span className="text-lg">⚡</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
