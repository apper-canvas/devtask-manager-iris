import { toast } from "react-toastify";

class TaskService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'task_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "project_id_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } },
          { field: { Name: "git_branch_c" } },
          { field: { Name: "code_snippet_c" } },
          { field: { Name: "resource_links_c" } }
        ],
        orderBy: [
          {
            fieldName: "Id",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Transform to match UI expectations
      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c || task.Name,
        description: task.description_c,
        projectId: task.project_id_c?.Id || task.project_id_c,
        priority: task.priority_c,
        status: task.status_c,
        createdAt: task.created_at_c,
        updatedAt: task.updated_at_c,
        gitBranch: task.git_branch_c,
        codeSnippet: task.code_snippet_c,
        resourceLinks: task.resource_links_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "project_id_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } },
          { field: { Name: "git_branch_c" } },
          { field: { Name: "code_snippet_c" } },
          { field: { Name: "resource_links_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response || !response.data) {
        return null;
      }

      const task = response.data;
      // Transform to match UI expectations
      return {
        Id: task.Id,
        title: task.title_c || task.Name,
        description: task.description_c,
        projectId: task.project_id_c?.Id || task.project_id_c,
        priority: task.priority_c,
        status: task.status_c,
        createdAt: task.created_at_c,
        updatedAt: task.updated_at_c,
        gitBranch: task.git_branch_c,
        codeSnippet: task.code_snippet_c,
        resourceLinks: task.resource_links_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching task with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async create(taskData) {
    try {
      const params = {
        records: [{
          Name: taskData.title,
          title_c: taskData.title,
          description_c: taskData.description,
          project_id_c: taskData.projectId ? parseInt(taskData.projectId) : null,
          priority_c: taskData.priority,
          status_c: taskData.status,
          created_at_c: new Date().toISOString(),
          updated_at_c: new Date().toISOString(),
          git_branch_c: taskData.gitBranch || null,
          code_snippet_c: taskData.codeSnippet || null,
          resource_links_c: taskData.resourceLinks || null
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create task ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const createdTask = successfulRecords[0].data;
          // Transform to match UI expectations
          return {
            Id: createdTask.Id,
            title: createdTask.title_c || createdTask.Name,
            description: createdTask.description_c,
            projectId: createdTask.project_id_c?.Id || createdTask.project_id_c,
            priority: createdTask.priority_c,
            status: createdTask.status_c,
            createdAt: createdTask.created_at_c,
            updatedAt: createdTask.updated_at_c,
            gitBranch: createdTask.git_branch_c,
            codeSnippet: createdTask.code_snippet_c,
            resourceLinks: createdTask.resource_links_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating task:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error);
      }
    }
    return null;
  }

  async update(id, taskData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: taskData.title,
          title_c: taskData.title,
          description_c: taskData.description,
          project_id_c: taskData.projectId ? parseInt(taskData.projectId) : null,
          priority_c: taskData.priority,
          status_c: taskData.status,
          updated_at_c: new Date().toISOString(),
          git_branch_c: taskData.gitBranch || null,
          code_snippet_c: taskData.codeSnippet || null,
          resource_links_c: taskData.resourceLinks || null
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update task ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedTask = successfulUpdates[0].data;
          // Transform to match UI expectations
          return {
            Id: updatedTask.Id,
            title: updatedTask.title_c || updatedTask.Name,
            description: updatedTask.description_c,
            projectId: updatedTask.project_id_c?.Id || updatedTask.project_id_c,
            priority: updatedTask.priority_c,
            status: updatedTask.status_c,
            createdAt: updatedTask.created_at_c,
            updatedAt: updatedTask.updated_at_c,
            gitBranch: updatedTask.git_branch_c,
            codeSnippet: updatedTask.code_snippet_c,
            resourceLinks: updatedTask.resource_links_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating task:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error);
      }
    }
    return null;
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete task ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting task:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error);
      }
    }
    return false;
  }

  async deleteByProjectId(projectId) {
    try {
      // First, get all tasks for this project
      const params = {
        fields: [
          { field: { Name: "Id" } }
        ],
        where: [
          {
            FieldName: "project_id_c",
            Operator: "EqualTo",
            Values: [parseInt(projectId)]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success || !response.data || response.data.length === 0) {
        return [];
      }

      // Delete all tasks
      const taskIds = response.data.map(task => task.Id);
      const deleteParams = {
        RecordIds: taskIds
      };

      const deleteResponse = await this.apperClient.deleteRecord(this.tableName, deleteParams);
      
      if (!deleteResponse.success) {
        console.error(deleteResponse.message);
        return [];
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting tasks by project ID:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async setActive(id) {
    // Note: Active task functionality may need custom implementation
    // For now, we'll just update the task status to inProgress
    try {
      const task = await this.getById(id);
      if (task) {
        return await this.update(id, {
          ...task,
          status: 'inProgress',
          isActive: true
        });
      }
      return null;
    } catch (error) {
      console.error("Error setting task as active:", error);
      return null;
    }
  }

  async getActiveTask() {
    // This would need custom implementation based on requirements
    // For now, return the most recently updated in-progress task
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "project_id_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
        ],
        where: [
          {
            FieldName: "status_c",
            Operator: "EqualTo",
            Values: ["inProgress"]
          }
        ],
        orderBy: [
          {
            fieldName: "updated_at_c",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 1,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success || !response.data || response.data.length === 0) {
        return null;
      }

      const task = response.data[0];
      return {
        Id: task.Id,
        title: task.title_c || task.Name,
        description: task.description_c,
        projectId: task.project_id_c?.Id || task.project_id_c,
        priority: task.priority_c,
        status: task.status_c,
        createdAt: task.created_at_c,
        updatedAt: task.updated_at_c,
        isActive: true
      };
    } catch (error) {
      console.error("Error getting active task:", error);
      return null;
    }
  }
}

export const taskService = new TaskService();