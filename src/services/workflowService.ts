import { FollowUpQueueItem } from '../types';
import followUpsData from '../data/followUps.json';

const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

let inMemoryQueue: FollowUpQueueItem[] = JSON.parse(JSON.stringify(followUpsData));

export async function getFollowUpQueue(): Promise<FollowUpQueueItem[]> {
  await delay();
  return [...inMemoryQueue];
}

export async function getFollowUpById(id: string): Promise<FollowUpQueueItem | undefined> {
  await delay();
  return inMemoryQueue.find(item => item.id === id);
}

export async function updateFollowUpStatus(
  id: string,
  status: 'pending' | 'renewed' | 'rescheduled' | 'skipped'
): Promise<FollowUpQueueItem | undefined> {
  await delay(100);
  const index = inMemoryQueue.findIndex(item => item.id === id);
  if (index !== -1) {
    inMemoryQueue[index] = {
      ...inMemoryQueue[index],
      status,
    };
    return inMemoryQueue[index];
  }
  return undefined;
}

export async function saveFollowUpDraft(
  id: string,
  draft: { dosage: string; durationDays: number; notes?: string }
): Promise<void> {
  await delay(50);
  const item = inMemoryQueue.find(i => i.id === id);
  if (item) {
    item.draftRenewal = draft;
  }
}
