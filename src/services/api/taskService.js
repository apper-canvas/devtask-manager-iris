import tasksData from "@/services/mockData/tasks.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TaskService {
  constructor() {
    this.tasks = [...tasksData]
    this.activeTaskId = null
  }

  async getAll() {
    await delay(300)
    return [...this.tasks]
  }

  async getById(id) {
    await delay(200)
    const task = this.tasks.find(task => task.Id === parseInt(id))
    if (!task) {
      throw new Error("Task not found")
    }
    return { ...task }
  }

  async create(taskData) {
    await delay(400)
    const newTask = {
      ...taskData,
      Id: Math.max(...this.tasks.map(t => t.Id), 0) + 1
    }
    this.tasks.unshift(newTask)
    return { ...newTask }
  }

  async update(id, taskData) {
    await delay(300)
    const index = this.tasks.findIndex(task => task.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Task not found")
    }
    this.tasks[index] = { ...taskData, Id: parseInt(id) }
    return { ...this.tasks[index] }
  }

async delete(id) {
    await delay(250)
    const index = this.tasks.findIndex(task => task.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Task not found")
    }
    const deletedTask = this.tasks.splice(index, 1)[0]
    return { ...deletedTask }
  }

  async deleteByProjectId(projectId) {
    await delay(250)
    const tasksToDelete = this.tasks.filter(task => task.projectId === parseInt(projectId))
    this.tasks = this.tasks.filter(task => task.projectId !== parseInt(projectId))
    return tasksToDelete
  }
async setActive(id) {
    await delay(200)
    const taskId = parseInt(id)
    const task = this.tasks.find(task => task.Id === taskId)
    if (!task) {
      throw new Error("Task not found")
    }
    
    // Remove active status from all tasks
    this.tasks.forEach(task => {
      task.isActive = false
    })
    
    // Set the selected task as active
    const index = this.tasks.findIndex(task => task.Id === taskId)
    this.tasks[index] = { ...this.tasks[index], isActive: true }
    this.activeTaskId = taskId
    
    return { ...this.tasks[index] }
  }

  async getActiveTask() {
    await delay(100)
return this.tasks.find(task => task.isActive) || null
  }

  // Filtering methods
  async filter({ search = '', status = 'all', priority = 'all', projectId = 'all' }) {
    await delay(200)
    let filteredTasks = [...this.tasks]

    // Search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase()
      filteredTasks = filteredTasks.filter(task => 
        task.title.toLowerCase().includes(searchLower) ||
        (task.description && task.description.toLowerCase().includes(searchLower))
      )
    }

    // Status filter
    if (status !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.status === status)
    }

    // Priority filter
    if (priority !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.priority === priority)
    }

    // Project filter
    if (projectId !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.projectId === parseInt(projectId))
    }

    return filteredTasks
  }

  async searchTasks(query) {
    await delay(200)
    if (!query.trim()) return [...this.tasks]
    
    const searchLower = query.toLowerCase()
    return this.tasks.filter(task => 
      task.title.toLowerCase().includes(searchLower) ||
      (task.description && task.description.toLowerCase().includes(searchLower))
    )
  }

  async getTasksByStatus(status) {
    await delay(200)
    if (status === 'all') return [...this.tasks]
    return this.tasks.filter(task => task.status === status)
  }

  async getTasksByPriority(priority) {
    await delay(200)
    if (priority === 'all') return [...this.tasks]
    return this.tasks.filter(task => task.priority === priority)
  }

  async getTasksByProject(projectId) {
    await delay(200)
    if (projectId === 'all') return [...this.tasks]
    return this.tasks.filter(task => task.projectId === parseInt(projectId))
  }
}

export const taskService = new TaskService()