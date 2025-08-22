import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import ApperIcon from "@/components/ApperIcon"
import TaskCard from "@/components/molecules/TaskCard"
import AddTaskModal from "@/components/molecules/AddTaskModal"
import TaskDetailsModal from "@/components/molecules/TaskDetailsModal"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { taskService } from "@/services/api/taskService"
import { projectService } from "@/services/api/projectService"
const Tasks = () => {
const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [projectFilter, setProjectFilter] = useState("all")
  
  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [tasksData, projectsData] = await Promise.all([
        taskService.getAll(),
        projectService.getAll()
      ])
      setTasks(tasksData)
      setProjects(projectsData)
    } catch (err) {
      setError("Failed to load tasks")
    } finally {
      setLoading(false)
    }
  }

useEffect(() => {
    loadData()
  }, [])

  // Reload data when window gains focus to catch external changes
  useEffect(() => {
    const handleFocus = () => {
      loadData()
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

const handleTaskAdded = (newTask) => {
    setTasks(prev => [newTask, ...prev])
  }

  const handleTaskUpdate = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task.Id === updatedTask.Id ? updatedTask : task
    ))
  }

  const handleTaskDelete = async (taskId) => {
    try {
      await taskService.delete(taskId)
      setTasks(prev => prev.filter(task => task.Id !== taskId))
      setIsDetailsModalOpen(false)
      toast.success("Task deleted successfully!")
    } catch (error) {
      toast.error("Failed to delete task")
    }
  }

const handleTaskClick = (task) => {
    setSelectedTask(task)
    setIsDetailsModalOpen(true)
  }

const handleTaskDetailsUpdated = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task.Id === updatedTask.Id ? updatedTask : task
    ))
    setSelectedTask(updatedTask) // Update selected task to reflect changes
  }

// Filter out tasks that reference deleted projects
const validTasks = tasks.filter(task => {
    if (!task.projectId) return true
    return projects.some(project => project.Id === task.projectId)
})

  // Apply all filters to valid tasks
  const filteredTasks = validTasks.filter(task => {
    // Search filter
    const searchMatch = !searchQuery.trim() || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
    
    // Status filter
    const statusMatch = statusFilter === "all" || task.status === statusFilter
    
    // Priority filter  
    const priorityMatch = priorityFilter === "all" || task.priority === priorityFilter
    
    // Project filter
    const projectMatch = projectFilter === "all" || task.projectId?.toString() === projectFilter
    
    return searchMatch && statusMatch && priorityMatch && projectMatch
  })

  const getFilterCount = (status) => {
    // Get tasks filtered by everything except status
    const baseFilteredTasks = validTasks.filter(task => {
      const searchMatch = !searchQuery.trim() || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
      const priorityMatch = priorityFilter === "all" || task.priority === priorityFilter
      const projectMatch = projectFilter === "all" || task.projectId?.toString() === projectFilter
      return searchMatch && priorityMatch && projectMatch
    })
    
    if (status === "all") return baseFilteredTasks.length
    return baseFilteredTasks.filter(task => task.status === status).length
  }
  if (loading) return <Loading message="Loading tasks..." />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-mono font-bold text-white mb-2">Tasks</h1>
          <p className="text-gray-400">Manage and track all your development tasks</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Task
        </Button>
</div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <ApperIcon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search tasks by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <ApperIcon name="CheckSquare" size={16} className="text-gray-400" />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="min-w-[140px]"
            >
              <option value="all">All Status ({getFilterCount("all")})</option>
              <option value="todo">Todo ({getFilterCount("todo")})</option>
              <option value="inProgress">In Progress ({getFilterCount("inProgress")})</option>
              <option value="done">Done ({getFilterCount("done")})</option>
            </Select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center space-x-2">
            <ApperIcon name="Flag" size={16} className="text-gray-400" />
            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="min-w-[120px]"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </Select>
          </div>

          {/* Project Filter */}
          <div className="flex items-center space-x-2">
            <ApperIcon name="FolderOpen" size={16} className="text-gray-400" />
            <Select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="min-w-[160px]"
            >
              <option value="all">All Projects</option>
{projects.map(project => {
                const projectTaskCount = validTasks.filter(task => task.projectId === project.Id).length
                return (
                  <option key={project.Id} value={project.Id}>
                    {project.name} ({projectTaskCount})
                  </option>
                )
              })}
            </Select>
          </div>

          {/* Clear Filters */}
          {(searchQuery || statusFilter !== "all" || priorityFilter !== "all" || projectFilter !== "all") && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setSearchQuery("")
                setStatusFilter("all")
                setPriorityFilter("all")
                setProjectFilter("all")
                toast.success("Filters cleared")
              }}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="X" size={14} />
              <span>Clear Filters</span>
            </Button>
          )}
        </div>

        {/* Active Filter Summary */}
        {(searchQuery || statusFilter !== "all" || priorityFilter !== "all" || projectFilter !== "all") && (
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>Showing {filteredTasks.length} of {validTasks.length} tasks</span>
            {searchQuery && <span>• Search: "{searchQuery}"</span>}
            {statusFilter !== "all" && <span>• Status: {statusFilter === "inProgress" ? "In Progress" : statusFilter}</span>}
            {priorityFilter !== "all" && <span>• Priority: {priorityFilter}</span>}
{projectFilter !== "all" && <span>• Project: {projects.find(p => p.Id.toString() === projectFilter)?.name}</span>}
          </div>
        )}
      </div>

      {/* Tasks List */}
      {filteredTasks.length > 0 ? (
        <div className="grid gap-4">
{filteredTasks.map(task => {
            const project = projects.find(p => p.Id === task.projectId)
            return (
<TaskCard
                key={task.Id}
                task={task}
                project={project}
                onTaskUpdate={handleTaskUpdate}
                onTaskClick={handleTaskClick}
              />
            )
          })}
        </div>
) : (
        <Empty
          title={
            searchQuery || statusFilter !== "all" || priorityFilter !== "all" || projectFilter !== "all" 
              ? "No matching tasks found" 
              : "No tasks yet"
          }
          description={
            searchQuery || statusFilter !== "all" || priorityFilter !== "all" || projectFilter !== "all"
              ? "Try adjusting your search terms or filters to find the tasks you're looking for."
              : "Create your first task to get started with your development workflow"
          }
          action={() => setIsAddModalOpen(true)}
          actionLabel="Create Task"
          icon="CheckSquare"
        />
      )}

<AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        projects={projects}
        onTaskAdded={handleTaskAdded}
      />
      
<TaskDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        task={selectedTask}
        onTaskUpdated={handleTaskDetailsUpdated}
        onTaskDeleted={handleTaskDelete}
      />
    </div>
  )
}

export default Tasks