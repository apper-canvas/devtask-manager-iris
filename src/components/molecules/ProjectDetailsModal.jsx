import { format } from "date-fns";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Tasks from "@/components/pages/Tasks";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import TaskCard from "@/components/molecules/TaskCard";

const ProjectDetailsModal = ({ isOpen, onClose, project, tasks = [] }) => {
  if (!isOpen || !project) return null

  const tasksByStatus = {
    todo: tasks.filter(task => task.status === "todo"),
    inProgress: tasks.filter(task => task.status === "inProgress"),
    done: tasks.filter(task => task.status === "done")
  }

  const completionRate = tasks.length > 0 
    ? Math.round((tasksByStatus.done.length / tasks.length) * 100) 
    : 0

  return (
    <div
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div
        className="bg-surface rounded-lg border border-gray-600 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div
            className="flex items-center justify-between p-6 border-b border-gray-600">
            <div className="flex items-center space-x-4">
                <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                    style={{
                        backgroundColor: project.color
                    }}>
                    {project.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h2 className="text-2xl font-mono font-semibold text-white">{project.name}</h2>
                    {project.description && <p className="text-gray-400 mt-1">{project.description}</p>}
                </div>
            </div>
            <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors">
                <ApperIcon name="X" size={24} />
            </button>
        </div>
        {/* Project Info */}
        <div className="p-6 border-b border-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <p className="text-sm text-gray-400">Created</p>
                    <p className="text-white font-medium">
                        {format(new Date(project.createdAt), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                </div>
                {project.repositoryUrl && <div className="space-y-2">
                    <p className="text-sm text-gray-400">Repository</p>
                    <a
                        href={project.repositoryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-accent transition-colors flex items-center space-x-1">
                        <ApperIcon name="Github" size={16} />
                        <span>View on GitHub</span>
                        <ApperIcon name="ExternalLink" size={14} />
                    </a>
                </div>}
                <div className="space-y-2">
                    <p className="text-sm text-gray-400">Progress</p>
                    <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
                                style={{
                                    width: `${completionRate}%`
                                }} />
                        </div>
                        <span className="text-white font-medium text-sm">{completionRate}%</span>
                    </div>
                </div>
            </div>
        </div>
        {/* Task Statistics */}
        <div className="p-6 border-b border-gray-600">
            <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                    <div className="text-2xl font-bold text-white">{tasks.length}</div>
                    <div className="text-sm text-gray-400">Total Tasks</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-warning">{tasksByStatus.todo.length}</div>
                    <div className="text-sm text-gray-400">To Do</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-info">{tasksByStatus.inProgress.length}</div>
                    <div className="text-sm text-gray-400">In Progress</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-success">{tasksByStatus.done.length}</div>
                    <div className="text-sm text-gray-400">Completed</div>
                </div>
            </div>
        </div>
        {/* Tasks List */}
        <div className="flex-1 overflow-y-auto p-6">
            <h3
                className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <ApperIcon name="CheckSquare" size={20} />
                <span>Project Tasks</span>
            </h3>
            {tasks.length > 0 ? <div className="space-y-3">
                {tasks.map(task => <div key={task.Id} className="bg-background/50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h4 className="font-medium text-white mb-1">{task.title}</h4>
                            {task.description && <p className="text-sm text-gray-400 mb-2">{task.description}</p>}
                            <div className="flex items-center space-x-3">
                                <Badge
                                    variant={task.status === "todo" ? "warning" : task.status === "inProgress" ? "info" : "success"}>
                                    {task.status === "todo" ? "To Do" : task.status === "inProgress" ? "In Progress" : "Done"}
                                </Badge>
                                <Badge
                                    variant={task.priority === "high" ? "error" : task.priority === "medium" ? "warning" : "secondary"}>
                                    {task.priority}priority
                                                            </Badge>
                            </div>
                        </div>
                        <div className="text-xs text-gray-500 ml-4">
                            {format(new Date(task.createdAt), "MMM d")}
                        </div>
                    </div>
                </div>)}
            </div> : <div className="text-center py-8">
                <ApperIcon name="Inbox" size={48} className="text-gray-600 mx-auto mb-3" />
                <h4 className="text-lg font-medium text-gray-400 mb-2">No tasks yet</h4>
                <p className="text-gray-500">Create tasks to track progress for this project</p>
            </div>}
        </div>
        {/* Footer */}
        <div className="p-6 border-t border-gray-600 bg-background/30">
            <div className="flex justify-end">
                <Button onClick={onClose}>Close
                                </Button>
            </div>
        </div>
    </div>
    <span>Project: {project.name}</span></div>
  )
}

export default ProjectDetailsModal