import React from 'react'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import { cn } from '@/utils/cn'

const KeyboardShortcuts = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  // Detect platform for modifier key display
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0
  const modifierKey = isMac ? '⌘' : 'Ctrl'
  const modifierText = isMac ? 'Cmd' : 'Ctrl'

const shortcutCategories = [
    {
      title: 'Navigation',
      icon: 'Navigation',
      shortcuts: [
        { key: '?', description: 'Show/hide keyboard shortcuts', active: true },
        { key: 'Esc', description: 'Close modal or cancel action', active: true },
        { key: 'Alt + H', description: 'Go to Dashboard', active: true },
        { key: 'Alt + T', description: 'Go to Tasks page', active: true },
        { key: 'Alt + P', description: 'Go to Projects page', active: true },
        { key: 'Alt + S', description: 'Quick search', active: false, comingSoon: true }
      ]
    },
    {
      title: 'Tasks',
      icon: 'CheckSquare',
      shortcuts: [
        { key: 'Alt + N', description: 'Create new task', active: false, info: true },
        { key: 'Alt + E', description: 'Edit selected task', active: false, info: true },
        { key: 'Alt + D', description: 'Delete selected task', active: false, info: true },
        { key: 'Alt + F', description: 'Filter tasks', active: false, info: true }
      ]
    },
    {
      title: 'Projects',
      icon: 'FolderOpen',
      shortcuts: [
        { key: 'Alt + Shift + N', description: 'Create new project', active: false, info: true },
        { key: 'Alt + Shift + E', description: 'Edit selected project', active: false, info: true },
        { key: 'Alt + I', description: 'View project details', active: false, info: true },
        { key: 'Alt + G', description: 'Open project repository', active: false, info: true }
      ]
    },
    {
      title: 'General',
      icon: 'Settings',
      shortcuts: [
        { key: 'Alt + R', description: 'Refresh application', active: true },
        { key: 'Alt + /', description: 'Toggle help documentation', active: false, comingSoon: true }
      ]
    }
  ]

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-surface border border-gray-600 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-600">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <ApperIcon name="Keyboard" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-mono font-semibold text-white">Keyboard Shortcuts</h2>
              <p className="text-sm text-gray-400">Navigate faster with these shortcuts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ApperIcon name="X" size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-8rem)]">
          <div className="p-6">
            {/* Platform Info */}
            <div className="mb-6 p-4 bg-background/50 rounded-lg border border-gray-700">
              <div className="flex items-center space-x-2 mb-2">
                <ApperIcon name="Info" size={16} className="text-info" />
                <span className="text-sm font-medium text-gray-300">Platform: {isMac ? 'macOS' : 'Windows/Linux'}</span>
              </div>
<p className="text-xs text-gray-400">
                Navigation shortcuts work immediately. Action shortcuts show helpful info messages. Alt key combinations avoid browser conflicts.
              </p>
            </div>

            {/* Shortcuts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {shortcutCategories.map((category, index) => (
                <Card key={index} className="p-0">
                  <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name={category.icon} size={18} className="text-primary" />
                      <h3 className="font-semibold text-white">{category.title}</h3>
                    </div>
                  </div>
<div className="p-4 space-y-3">
                    {category.shortcuts.map((shortcut, shortcutIndex) => (
                      <div key={shortcutIndex} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={cn(
                            "text-sm",
                            shortcut.active ? "text-gray-300" : "text-gray-500"
                          )}>
                            {shortcut.description}
                          </span>
                          {shortcut.comingSoon && (
                            <span className="px-2 py-0.5 text-xs bg-accent/20 text-accent rounded-full">
                              Soon
                            </span>
                          )}
                          {shortcut.info && (
                            <span className="px-2 py-0.5 text-xs bg-info/20 text-info rounded-full">
                              Info
                            </span>
                          )}
                        </div>
                        <kbd className={cn(
                          "px-2 py-1 text-xs font-mono border rounded shadow-sm",
                          shortcut.active 
                            ? "bg-gray-800 border-gray-600 text-gray-300" 
                            : "bg-gray-900 border-gray-700 text-gray-500"
                        )}>
                          {shortcut.key}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            {/* Additional Tips */}
            <div className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <ApperIcon name="Lightbulb" size={16} className="text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-white mb-1">Pro Tips</h4>
<ul className="text-sm text-gray-300 space-y-1">
                    <li>• Press <kbd className="px-1 py-0.5 text-xs bg-gray-800 rounded">?</kbd> anytime to toggle this help overlay</li>
                    <li>• Navigation shortcuts (Alt+H, Alt+T, Alt+P) work from any page</li>
                    <li>• Action shortcuts provide contextual feedback and guidance</li>
                    <li>• Use <kbd className="px-1 py-0.5 text-xs bg-gray-800 rounded">Esc</kbd> to quickly close dialogs and modals</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-600 p-4 bg-background/30">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">
              Press <kbd className="px-1 py-0.5 bg-gray-800 border border-gray-600 rounded">Esc</kbd> or click outside to close
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default KeyboardShortcuts