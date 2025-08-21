import { toast } from "react-toastify";

class OfflineService {
  constructor() {
    this.isOnline = navigator.onLine;
    this.drafts = this.loadDrafts();
    this.listeners = [];
    this.syncInProgress = false;
    
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
  }

  handleOnline() {
    this.isOnline = true;
    this.notifyListeners();
    toast.success("You're back online! Syncing drafts...");
    this.syncDrafts();
  }

  handleOffline() {
    this.isOnline = false;
    this.notifyListeners();
    toast.info("You're offline. Drafts will be saved locally and synced when reconnected.");
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener({
      isOnline: this.isOnline,
      hasDrafts: this.drafts.length > 0,
      syncInProgress: this.syncInProgress
    }));
  }

  loadDrafts() {
    try {
      const stored = localStorage.getItem('expense_drafts');
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error('Failed to load drafts:', err);
      return [];
    }
  }

  saveDrafts() {
    try {
      localStorage.setItem('expense_drafts', JSON.stringify(this.drafts));
    } catch (err) {
      console.error('Failed to save drafts:', err);
    }
  }

  addDraft(expenseData) {
    const draft = {
      id: Date.now().toString(),
      data: expenseData,
      createdAt: new Date().toISOString(),
      type: 'expense'
    };

    this.drafts.push(draft);
    this.saveDrafts();
    this.notifyListeners();
    
    toast.success("Expense saved as draft. It will sync when you're back online.");
    return draft;
  }

  removeDraft(draftId) {
    this.drafts = this.drafts.filter(draft => draft.id !== draftId);
    this.saveDrafts();
    this.notifyListeners();
  }

  async syncDrafts() {
    if (!this.isOnline || this.drafts.length === 0 || this.syncInProgress) {
      return;
    }

    this.syncInProgress = true;
    this.notifyListeners();

    const { expenseService } = await import('@/services/api/expenseService');
    const draftsToSync = [...this.drafts];
    const syncResults = {
      success: 0,
      failed: 0,
      errors: []
    };

    for (const draft of draftsToSync) {
      try {
        if (draft.type === 'expense') {
          await expenseService.create(draft.data);
          this.removeDraft(draft.id);
          syncResults.success++;
        }
      } catch (err) {
        syncResults.failed++;
        syncResults.errors.push({
          draftId: draft.id,
          error: err.message
        });
      }
    }

    this.syncInProgress = false;
    this.notifyListeners();

    if (syncResults.success > 0) {
      toast.success(`Synced ${syncResults.success} expense${syncResults.success > 1 ? 's' : ''} successfully!`);
    }

    if (syncResults.failed > 0) {
      toast.error(`Failed to sync ${syncResults.failed} expense${syncResults.failed > 1 ? 's' : ''}. Please try again.`);
    }
  }

  getDrafts() {
    return [...this.drafts];
  }

  getDraftCount() {
    return this.drafts.length;
  }

  getConnectionState() {
    return {
      isOnline: this.isOnline,
      hasDrafts: this.drafts.length > 0,
      draftCount: this.drafts.length,
      syncInProgress: this.syncInProgress
    };
  }

  clearAllDrafts() {
    this.drafts = [];
    this.saveDrafts();
    this.notifyListeners();
    toast.info("All drafts cleared.");
  }

  // Manual sync trigger
  async forcSync() {
    if (!this.isOnline) {
      toast.error("Cannot sync while offline.");
      return;
    }
    
    if (this.drafts.length === 0) {
      toast.info("No drafts to sync.");
      return;
    }

    await this.syncDrafts();
  }

  // Cleanup method
  destroy() {
    window.removeEventListener('online', this.handleOnline.bind(this));
    window.removeEventListener('offline', this.handleOffline.bind(this));
    this.listeners = [];
  }
}

// Create and export singleton instance
const offlineService = new OfflineService();
export { offlineService };