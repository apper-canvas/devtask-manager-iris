import { toast } from "react-toastify";
import { taskService } from "@/services/api/taskService";

class ProjectService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'project_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "description_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "repository_url_c" } }
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
      return response.data.map(project => ({
        Id: project.Id,
        name: project.Name,
        description: project.description_c,
        color: project.color_c,
        createdAt: project.created_at_c,
        repositoryUrl: project.repository_url_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching projects:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      if (!id) {
        throw new Error("Project ID is required");
      }

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "description_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "repository_url_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response || !response.data) {
        console.error(`Project not found with ID: ${id}`);
        throw new Error(`Project not found with ID: ${id}`);
      }

      const project = response.data;
      // Transform to match UI expectations
      return {
        Id: project.Id,
        name: project.Name,
        description: project.description_c,
        color: project.color_c,
        createdAt: project.created_at_c,
        repositoryUrl: project.repository_url_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching project with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async create(projectData) {
    try {
      const params = {
        records: [{
          Name: projectData.name,
          description_c: projectData.description,
          color_c: projectData.color,
          created_at_c: new Date().toISOString(),
          repository_url_c: projectData.repositoryUrl || null
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
          console.error(`Failed to create project ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const createdProject = successfulRecords[0].data;
          // Transform to match UI expectations
          return {
            Id: createdProject.Id,
            name: createdProject.Name,
            description: createdProject.description_c,
            color: createdProject.color_c,
            createdAt: createdProject.created_at_c,
            repositoryUrl: createdProject.repository_url_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating project:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error);
      }
    }
    return null;
  }

  async update(id, projectData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: projectData.name,
          description_c: projectData.description,
          color_c: projectData.color,
          repository_url_c: projectData.repositoryUrl || null
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
          console.error(`Failed to update project ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedProject = successfulUpdates[0].data;
          // Transform to match UI expectations
          return {
            Id: updatedProject.Id,
            name: updatedProject.Name,
            description: updatedProject.description_c,
            color: updatedProject.color_c,
            createdAt: updatedProject.created_at_c,
            repositoryUrl: updatedProject.repository_url_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating project:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error);
      }
    }
    return null;
  }

  async delete(id) {
    try {
      if (!id) {
        throw new Error("Project ID is required for deletion");
      }

      // Delete all tasks associated with this project first
      await taskService.deleteByProjectId(id);
      
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
          console.error(`Failed to delete project ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting project:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  }
}

export const projectService = new ProjectService();