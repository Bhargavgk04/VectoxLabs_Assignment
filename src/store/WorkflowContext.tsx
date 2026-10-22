import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { FollowUpQueueItem } from '../types';
import { getFollowUpQueue, updateFollowUpStatus, saveFollowUpDraft } from '../services/workflowService';

interface WorkflowContextValue {
  queue: FollowUpQueueItem[];
  loading: boolean;
  completedCount: number;
  totalCount: number;
  undoItem: { item: FollowUpQueueItem; previousStatus: FollowUpQueueItem['status'] } | null;
  renewPrescription: (id: string, adjustedDosage?: string, adjustedDuration?: number) => Promise<void>;
  rescheduleFollowUp: (id: string) => Promise<void>;
  skipFollowUp: (id: string) => Promise<void>;
  executeUndo: () => Promise<void>;
  clearUndo: () => void;
  saveDraft: (id: string, draft: { dosage: string; durationDays: number; notes?: string }) => void;
  refreshQueue: () => Promise<void>;
}

const WorkflowContext = createContext<WorkflowContextValue | undefined>(undefined);

export function WorkflowProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [queue, setQueue] = useState<FollowUpQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [undoItem, setUndoItem] = useState<{ item: FollowUpQueueItem; previousStatus: FollowUpQueueItem['status'] } | null>(null);

  const refreshQueue = useCallback(async () => {
    setLoading(true);
    try {
      const items = await getFollowUpQueue();
      setQueue(items);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshQueue();
  }, [refreshQueue]);

  const completedCount = queue.filter(i => i.status === 'renewed').length;
  const totalCount = queue.length;

  const renewPrescription = async (id: string, adjustedDosage?: string, adjustedDuration?: number) => {
    const existing = queue.find(i => i.id === id);
    if (!existing) return;

    const prevStatus = existing.status;
    const updated = await updateFollowUpStatus(id, 'renewed');
    if (updated) {
      if (adjustedDosage || adjustedDuration) {
        await saveFollowUpDraft(id, {
          dosage: adjustedDosage || existing.lastPrescription.dosage,
          durationDays: adjustedDuration || existing.lastPrescription.durationDays,
        });
      }
      setQueue(prev => prev.map(item => (item.id === id ? { ...updated, status: 'renewed' } : item)));
      setUndoItem({ item: existing, previousStatus: prevStatus });
    }
  };

  const rescheduleFollowUp = async (id: string) => {
    const existing = queue.find(i => i.id === id);
    if (!existing) return;
    const prevStatus = existing.status;
    const updated = await updateFollowUpStatus(id, 'rescheduled');
    if (updated) {
      setQueue(prev => prev.map(item => (item.id === id ? updated : item)));
      setUndoItem({ item: existing, previousStatus: prevStatus });
    }
  };

  const skipFollowUp = async (id: string) => {
    const existing = queue.find(i => i.id === id);
    if (!existing) return;
    const prevStatus = existing.status;
    const updated = await updateFollowUpStatus(id, 'skipped');
    if (updated) {
      setQueue(prev => prev.map(item => (item.id === id ? updated : item)));
      setUndoItem({ item: existing, previousStatus: prevStatus });
    }
  };

  const executeUndo = async () => {
    if (!undoItem) return;
    const { item, previousStatus } = undoItem;
    const restored = await updateFollowUpStatus(item.id, previousStatus);
    if (restored) {
      setQueue(prev => prev.map(i => (i.id === item.id ? { ...restored, status: previousStatus } : i)));
    }
    setUndoItem(null);
  };

  const clearUndo = useCallback(() => {
    setUndoItem(null);
  }, []);

  const saveDraft = useCallback((id: string, draft: { dosage: string; durationDays: number; notes?: string }) => {
    saveFollowUpDraft(id, draft);
    setQueue(prev => {
      const existing = prev.find(item => item.id === id);
      if (
        existing &&
        existing.draftRenewal?.dosage === draft.dosage &&
        existing.draftRenewal?.durationDays === draft.durationDays &&
        existing.draftRenewal?.notes === draft.notes
      ) {
        return prev;
      }
      return prev.map(item => (item.id === id ? { ...item, draftRenewal: draft } : item));
    });
  }, []);

  return (
    <WorkflowContext.Provider
      value={{
        queue,
        loading,
        completedCount,
        totalCount,
        undoItem,
        renewPrescription,
        rescheduleFollowUp,
        skipFollowUp,
        executeUndo,
        clearUndo,
        saveDraft,
        refreshQueue,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow(): WorkflowContextValue {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
}
