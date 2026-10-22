import {
  getFollowUpQueue,
  getFollowUpById,
  updateFollowUpStatus,
  saveFollowUpDraft,
} from '../../../src/services/workflowService';

describe('Q3: Clinical Workflow (Follow-Up Rx Renewal in 3 Taps) Integrity', () => {
  it('retrieves follow-up queue with patient vitals and prescription history', async () => {
    const queue = await getFollowUpQueue();
    expect(queue.length).toBeGreaterThanOrEqual(6);

    const first = queue[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('patientName');
    expect(first).toHaveProperty('patientAge');
    expect(first).toHaveProperty('patientGender');
    expect(first).toHaveProperty('urgency');
    expect(first).toHaveProperty('diagnoses');
    expect(first).toHaveProperty('allergies');
    expect(first).toHaveProperty('vitalsTrend');
    expect(first.vitalsTrend.length).toBeGreaterThan(0);
    expect(first).toHaveProperty('lastPrescription');
    expect(first.lastPrescription).toHaveProperty('medication');
    expect(first.lastPrescription).toHaveProperty('dosage');
    expect(first.lastPrescription).toHaveProperty('durationDays');
  });

  it('contains patients with documented allergies for contraindication alert verification', async () => {
    const queue = await getFollowUpQueue();
    const allergicPatients = queue.filter((item) => item.allergies.length > 0);
    expect(allergicPatients.length).toBeGreaterThanOrEqual(1);

    const elena = allergicPatients.find((p) => p.patientName === 'Elena Rostova');
    expect(elena).toBeDefined();
    expect(elena?.allergies).toContain('Penicillin');
  });

  it('persists draft renewal parameters without losing state', async () => {
    const queue = await getFollowUpQueue();
    const testItem = queue[0];

    await saveFollowUpDraft(testItem.id, {
      dosage: '10mg Once Daily',
      durationDays: 45,
      notes: 'Titrated up for blood pressure stabilization',
    });

    const retrieved = await getFollowUpById(testItem.id);
    expect(retrieved?.draftRenewal).toBeDefined();
    expect(retrieved?.draftRenewal?.dosage).toBe('10mg Once Daily');
    expect(retrieved?.draftRenewal?.durationDays).toBe(45);
  });

  it('updates follow-up status to renewed upon clinical sign-off', async () => {
    const queue = await getFollowUpQueue();
    const testItem = queue[1];

    const updated = await updateFollowUpStatus(testItem.id, 'renewed');
    expect(updated).toBeDefined();
    expect(updated?.status).toBe('renewed');

    const check = await getFollowUpById(testItem.id);
    expect(check?.status).toBe('renewed');
  });

  it('supports undo operation restoring status to previous', async () => {
    const queue = await getFollowUpQueue();
    const testItem = queue[2];
    const initialStatus = testItem.status;

    // Change status
    await updateFollowUpStatus(testItem.id, 'skipped');
    let current = await getFollowUpById(testItem.id);
    expect(current?.status).toBe('skipped');

    // Restore via undo
    await updateFollowUpStatus(testItem.id, initialStatus);
    current = await getFollowUpById(testItem.id);
    expect(current?.status).toBe(initialStatus);
  });
});
