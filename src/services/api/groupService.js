import { toast } from "react-toastify";

class GroupService {
  constructor() {
    this.apperClient = null;
    this.tableName = 'group_c';
    this.initializeClient();
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getAll() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "members_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "recent_activity_c" } },
          { field: { Name: "CreatedOn" } }
        ],
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data?.map(group => ({
        Id: group.Id,
        name: group.Name,
        members: this.parseMembers(group.members_c),
        type: group.type_c || 'Friends',
        createdAt: group.created_at_c || group.CreatedOn,
        recentActivity: group.recent_activity_c || 'Just now'
      })) || [];

    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching groups:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async getById(Id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "members_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "recent_activity_c" } },
          { field: { Name: "CreatedOn" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, Id, params);
      
      if (!response || !response.data) {
        throw new Error("Group not found");
      }

      const group = response.data;
      return {
        Id: group.Id,
        name: group.Name,
        members: this.parseMembers(group.members_c),
        type: group.type_c || 'Friends',
        createdAt: group.created_at_c || group.CreatedOn,
        recentActivity: group.recent_activity_c || 'Just now'
      };

    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching group with ID ${Id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async create(groupData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Name: groupData.name,
          members_c: JSON.stringify(groupData.members || []),
          type_c: groupData.type || 'Friends',
          created_at_c: new Date().toISOString(),
          recent_activity_c: 'Just now'
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
          console.error(`Failed to create group ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }

    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating group:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  parseMembers(membersStr) {
    try {
      return membersStr ? JSON.parse(membersStr) : [];
    } catch {
      return [];
    }
  }
}

export const groupService = new GroupService();