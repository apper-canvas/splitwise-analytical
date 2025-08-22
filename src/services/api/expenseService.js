import { toast } from "react-toastify";

class ExpenseService {
  constructor() {
    this.apperClient = null;
    this.tableName = 'expense_c';
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
          { field: { Name: "description_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "currency_c" } },
          { field: { Name: "paid_by_c" } },
          { field: { Name: "split_between_c" } },
          { field: { Name: "split_method_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "receipt_image_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "settled_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "group_id_c" } },
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

      return response.data?.map(expense => ({
        Id: expense.Id,
        description: expense.description_c || expense.Name,
        amount: parseFloat(expense.amount_c) || 0,
        currency: expense.currency_c || 'USD',
        paidBy: expense.paid_by_c || '',
        splitBetween: this.parseSplitBetween(expense.split_between_c),
        splitMethod: expense.split_method_c || 'equal',
        category: expense.category_c || 'general',
        receiptImage: expense.receipt_image_c,
        createdAt: expense.created_at_c || expense.CreatedOn,
        settled: expense.settled_c || false,
        notes: expense.notes_c,
        groupId: expense.group_id_c?.Id || expense.group_id_c
      })) || [];

    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching expenses:", error?.response?.data?.message);
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
          { field: { Name: "description_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "currency_c" } },
          { field: { Name: "paid_by_c" } },
          { field: { Name: "split_between_c" } },
          { field: { Name: "split_method_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "receipt_image_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "settled_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "group_id_c" } },
          { field: { Name: "CreatedOn" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, Id, params);
      
      if (!response || !response.data) {
        return null;
      }

      const expense = response.data;
      return {
        Id: expense.Id,
        description: expense.description_c || expense.Name,
        amount: parseFloat(expense.amount_c) || 0,
        currency: expense.currency_c || 'USD',
        paidBy: expense.paid_by_c || '',
        splitBetween: this.parseSplitBetween(expense.split_between_c),
        splitMethod: expense.split_method_c || 'equal',
        category: expense.category_c || 'general',
        receiptImage: expense.receipt_image_c,
        createdAt: expense.created_at_c || expense.CreatedOn,
        settled: expense.settled_c || false,
        notes: expense.notes_c,
        groupId: expense.group_id_c?.Id || expense.group_id_c
      };

    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching expense with ID ${Id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async create(expenseData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Name: expenseData.description,
          description_c: expenseData.description,
          amount_c: parseFloat(expenseData.amount),
          currency_c: expenseData.currency,
          paid_by_c: expenseData.paidBy,
          split_between_c: JSON.stringify(expenseData.splitBetween),
          split_method_c: expenseData.splitMethod,
          category_c: expenseData.category,
          receipt_image_c: expenseData.receiptImage,
          created_at_c: new Date().toISOString(),
          settled_c: expenseData.settled || false,
          notes_c: expenseData.notes || '',
          group_id_c: parseInt(expenseData.groupId)
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
          console.error(`Failed to create expense ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating expense:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      if (!navigator.onLine) {
        throw new Error("OFFLINE_MODE");
      }
      throw error;
    }
  }

  async update(Id, updateData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Id: parseInt(Id),
          Name: updateData.description,
          description_c: updateData.description,
          amount_c: parseFloat(updateData.amount),
          currency_c: updateData.currency,
          paid_by_c: updateData.paidBy,
          split_between_c: JSON.stringify(updateData.splitBetween),
          split_method_c: updateData.splitMethod,
          category_c: updateData.category,
          receipt_image_c: updateData.receiptImage,
          settled_c: updateData.settled,
          notes_c: updateData.notes,
          group_id_c: parseInt(updateData.groupId)
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
          console.error(`Failed to update expense ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }

    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating expense:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async delete(Id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        RecordIds: [parseInt(Id)]
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
          console.error(`Failed to delete expense ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }

    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting expense:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async settleExpense(Id) {
    return this.update(Id, { settled: true });
  }

  async getFilteredExpenses(filters = {}) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "currency_c" } },
          { field: { Name: "paid_by_c" } },
          { field: { Name: "split_between_c" } },
          { field: { Name: "split_method_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "receipt_image_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "settled_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "group_id_c" } },
          { field: { Name: "CreatedOn" } }
        ],
        where: [],
        orderBy: [{ fieldName: "CreatedOn", sorttype: filters.sortBy === 'date-asc' ? 'ASC' : 'DESC' }]
      };

      // Add filters
      if (filters.groupId) {
        params.where.push({
          FieldName: "group_id_c",
          Operator: "EqualTo",
          Values: [parseInt(filters.groupId)]
        });
      }

      if (filters.category) {
        params.where.push({
          FieldName: "category_c",
          Operator: "EqualTo",
          Values: [filters.category]
        });
      }

      if (filters.settled !== undefined) {
        params.where.push({
          FieldName: "settled_c",
          Operator: "EqualTo",
          Values: [filters.settled]
        });
      }

      if (filters.query) {
        params.where.push({
          FieldName: "description_c",
          Operator: "Contains",
          Values: [filters.query]
        });
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data?.map(expense => ({
        Id: expense.Id,
        description: expense.description_c || expense.Name,
        amount: parseFloat(expense.amount_c) || 0,
        currency: expense.currency_c || 'USD',
        paidBy: expense.paid_by_c || '',
        splitBetween: this.parseSplitBetween(expense.split_between_c),
        splitMethod: expense.split_method_c || 'equal',
        category: expense.category_c || 'general',
        receiptImage: expense.receipt_image_c,
        createdAt: expense.created_at_c || expense.CreatedOn,
        settled: expense.settled_c || false,
        notes: expense.notes_c,
        groupId: expense.group_id_c?.Id || expense.group_id_c
      })) || [];

    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error filtering expenses:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  parseSplitBetween(splitBetweenStr) {
    try {
      return splitBetweenStr ? JSON.parse(splitBetweenStr) : [];
    } catch {
      return [];
    }
  }

  async getTripSummary() {
    // Mock implementation for trip functionality - can be enhanced later
    return [];
  }

  async exportTripData(tripName, format = 'csv') {
    // Mock implementation for export functionality
    return format === 'csv' ? '' : { tripName, totalAmount: 0, expenseCount: 0, expenses: [] };
  }

  // Offline support methods
  async createOfflineDraft(expenseData) {
    const { offlineService } = await import('@/services/offlineService');
    return offlineService.addDraft(expenseData);
  }

  async createWithOfflineSupport(expenseData) {
    try {
      return await this.create(expenseData);
    } catch (err) {
      if (err.message === "OFFLINE_MODE" || !navigator.onLine) {
        return await this.createOfflineDraft(expenseData);
      }
      throw err;
    }
  }
}

const expenseService = new ExpenseService();
export { expenseService };