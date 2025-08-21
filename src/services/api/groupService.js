import groupsData from "@/services/mockData/groups.json";

// Simple delay function to simulate API calls
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class GroupService {
  constructor() {
    this.groups = [...groupsData];
  }

  async getAll() {
    await delay(300);
    return [...this.groups];
  }

  async getById(Id) {
    await delay(200);
    const group = this.groups.find(g => g.Id === parseInt(Id));
    if (!group) {
      throw new Error("Group not found");
    }
    return { ...group };
  }

  async create(groupData) {
    await delay(400);
    
    // Find highest existing Id and add 1
    const maxId = this.groups.reduce((max, group) => 
      Math.max(max, group.Id), 0);
    
    const newGroup = {
      Id: maxId + 1,
      ...groupData,
      createdAt: new Date().toISOString(),
      recentActivity: "Just now"
    };
    
    this.groups.push(newGroup);
    return { ...newGroup };
  }

  async update(Id, updateData) {
    await delay(350);
    
    const index = this.groups.findIndex(g => g.Id === parseInt(Id));
    if (index === -1) {
      throw new Error("Group not found");
    }
    
    this.groups[index] = { ...this.groups[index], ...updateData };
    return { ...this.groups[index] };
  }

  async delete(Id) {
    await delay(200);
    
    const index = this.groups.findIndex(g => g.Id === parseInt(Id));
    if (index === -1) {
      throw new Error("Group not found");
    }
    
    this.groups.splice(index, 1);
    return { success: true };
  }

  async addMember(groupId, memberData) {
    await delay(300);
    
    const group = await this.getById(groupId);
    const updatedMembers = [...group.members, memberData];
    
    return this.update(groupId, { members: updatedMembers });
  }

  async removeMember(groupId, memberId) {
    await delay(300);
    
    const group = await this.getById(groupId);
    const updatedMembers = group.members.filter(member => member.id !== memberId);
    
    return this.update(groupId, { members: updatedMembers });
  }

  async updateRecentActivity(groupId) {
    await delay(200);
    return this.update(groupId, { 
      recentActivity: new Date().toLocaleDateString()
    });
  }

  async getUserGroups(userId) {
    await delay(250);
    return this.groups.filter(group =>
      group.members.some(member => member.id === userId)
    );
  }
}

export const groupService = new GroupService();