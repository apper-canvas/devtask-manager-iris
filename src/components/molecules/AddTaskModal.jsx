import React, { useState } from "react";
import { toast } from "react-toastify";
import { taskService } from "@/services/api/taskService";
import ApperIcon from "@/components/ApperIcon";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const AddTaskModal = ({ isOpen, onClose, projects, onTaskAdded }) => {
const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    priority: "medium",
    status: "todo",
    gitBranch: "",
    codeSnippet: "",
    resourceLinks: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      toast.error("Task title is required")
      return
    }

    setIsSubmitting(true)
    try {
const newTask = await taskService.create({
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      
      onTaskAdded(newTask)
setFormData({
        title: "",
        description: "",
        projectId: "",
        priority: "medium",
        status: "todo",
        gitBranch: "",
        codeSnippet: "",
        resourceLinks: ""
      })
      onClose()
      toast.success("Task created successfully!")
    } catch (error) {
      toast.error("Failed to create task")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
<div
    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div
        className="bg-surface border border-gray-600 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div
            className="flex items-center justify-between p-6 border-b border-gray-600">
            <h2 className="text-xl font-mono font-semibold text-white">Add New Task</h2>
            <button
                onClick={onClose}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                <ApperIcon name="X" size={20} className="text-gray-400" />
            </button>
</div>
        <div className="flex flex-col max-h-[calc(90vh-8rem)]">
            <div className="overflow-y-auto flex-1 px-6">
<form id="add-task-form" onSubmit={handleSubmit} className="py-6 space-y-6">
                {/* Basic Information Section */}
                <div className="space-y-4">
                    <h3
                        className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Basic Information
                                    </h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Task Title
                                          </label>
                        <Input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter task title..."
                            required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Description
                                          </label>
                        <Textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter task description..."
                            rows={3} />
                    </div>
                </div>
                {/* Assignment Section */}
                <div className="space-y-4">
                    <h3
                        className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Assignment & Priority
                                    </h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Project
                                          </label>
<Select name="projectId" value={formData.projectId} onChange={handleChange}>
                            <option value="">Select a project...</option>
                            {projects?.map((project) => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </Select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Priority
                                                </label>
                            <Select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="relative">
                                <option value="low" className="flex items-center">🟢 Low
                                                      </option>
                                <option value="medium" className="flex items-center">🟡 Medium
                                                      </option>
                                <option value="high" className="flex items-center">🟠 High
                                                      </option>
                                <option value="critical" className="flex items-center">🔴 Critical
                                                      </option>
                            </Select>
                            <div className="mt-1 text-xs text-gray-400">
                                {formData.priority === "low" && "🟢 Low priority task"}
                                {formData.priority === "medium" && "🟡 Medium priority task"}
                                {formData.priority === "high" && "🟠 High priority task"}
                                {formData.priority === "critical" && "🔴 Critical priority task"}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Status
                                                </label>
                            <Select name="status" value={formData.status} onChange={handleChange}>
                                <option value="todo">📋 To Do</option>
                                <option value="in-progress">⚡ In Progress</option>
                                <option value="done">✅ Done</option>
                            </Select>
                        </div>
                    </div>
                </div>
                {/* Development Section */}
                <div className="space-y-4">
                    <h3
                        className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Development Details
                                    </h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Git Branch
                                            <span className="text-gray-500 font-normal ml-1">(optional)</span>
                        </label>
                        <Input
                            name="gitBranch"
                            value={formData.gitBranch}
                            onChange={handleChange}
                            placeholder="feature/new-functionality"
                            className="font-mono text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Code Snippet
                                            <span className="text-gray-500 font-normal ml-1">(optional)</span>
                        </label>
                        <Textarea
                            name="codeSnippet"
                            value={formData.codeSnippet}
                            onChange={handleChange}
                            placeholder="// Add relevant code snippet here..."
                            rows={4}
                            className="font-mono text-sm bg-gray-900 border-gray-600 resize-y" />
                    </div>
                </div>
                {/* Resources Section */}
                <div className="space-y-4">
                    <h3
                        className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Resources & Links
                                    </h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Resource Links
                                            <span className="text-gray-500 font-normal ml-1">(optional)</span>
                        </label>
                        <Textarea
                            name="resourceLinks"
                            value={formData.resourceLinks}
                            onChange={handleChange}
                            placeholder="Add documentation links, Stack Overflow references, etc.\nOne link per line:\nhttps://docs.example.com/api\nhttps://stackoverflow.com/questions/..."
                            rows={3}
                            className="text-sm" />
                        <div className="mt-1 text-xs text-gray-400">Add documentation, Stack Overflow links, or other helpful resources (one per line)
                                          </div>
                    </div>
                </div>
</form>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-700 bg-surface">
                <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                <Button type="submit" form="add-task-form" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Task"}
                </Button>
            </div>
        </div>
    </div></div>
  )
}

export default AddTaskModal