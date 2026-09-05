import {
  HistoricalWork,
  HISTORICAL_WORKS,
  VerifiedQuote,
  VERIFIED_QUOTES,
  HistoricalAudio,
  HISTORICAL_AUDIOS,
  FootstepLocation,
  FOOTSTEP_LOCATIONS,
  ChanhHiepActionModel,
  CHANH_HIEP_ACTION_MODELS,
  FrontInitiative,
  FRONT_INITIATIVE_DATA
} from '../data/hcmVerifiedMuseumData';

const KEY_WORKS = 'mttq_chanhhiep_hcm_works_v1';
const KEY_QUOTES = 'mttq_chanhhiep_hcm_quotes_v1';
const KEY_AUDIOS = 'mttq_chanhhiep_hcm_audios_v1';
const KEY_FOOTSTEPS = 'mttq_chanhhiep_hcm_footsteps_v1';
const KEY_CHANH_HIEP_ACTIONS = 'mttq_chanhhiep_hcm_chanh_hiep_actions_v4';
const KEY_FRONT_INITIATIVES = 'mttq_chanhhiep_hcm_front_initiatives_v5';

// --- WORKS STORE ---
export function loadStoredWorks(): HistoricalWork[] {
  if (typeof window === 'undefined') return HISTORICAL_WORKS;
  try {
    const raw = localStorage.getItem(KEY_WORKS);
    if (!raw) return HISTORICAL_WORKS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : HISTORICAL_WORKS;
  } catch (err) {
    console.error('Error loading stored works:', err);
    return HISTORICAL_WORKS;
  }
}

export function saveStoredWorks(data: HistoricalWork[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY_WORKS, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving stored works:', err);
  }
}

// --- QUOTES STORE ---
export function loadStoredQuotes(): VerifiedQuote[] {
  if (typeof window === 'undefined') return VERIFIED_QUOTES;
  try {
    const raw = localStorage.getItem(KEY_QUOTES);
    if (!raw) return VERIFIED_QUOTES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : VERIFIED_QUOTES;
  } catch (err) {
    console.error('Error loading stored quotes:', err);
    return VERIFIED_QUOTES;
  }
}

export function saveStoredQuotes(data: VerifiedQuote[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY_QUOTES, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving stored quotes:', err);
  }
}

// --- AUDIOS STORE ---
export function loadStoredAudios(): HistoricalAudio[] {
  if (typeof window === 'undefined') return HISTORICAL_AUDIOS;
  try {
    const raw = localStorage.getItem(KEY_AUDIOS);
    if (!raw) return HISTORICAL_AUDIOS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : HISTORICAL_AUDIOS;
  } catch (err) {
    console.error('Error loading stored audios:', err);
    return HISTORICAL_AUDIOS;
  }
}

export function saveStoredAudios(data: HistoricalAudio[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY_AUDIOS, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving stored audios:', err);
  }
}

// --- FOOTSTEPS STORE ---
export function loadStoredFootsteps(): FootstepLocation[] {
  if (typeof window === 'undefined') return FOOTSTEP_LOCATIONS;
  try {
    const raw = localStorage.getItem(KEY_FOOTSTEPS);
    if (!raw) return FOOTSTEP_LOCATIONS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : FOOTSTEP_LOCATIONS;
  } catch (err) {
    console.error('Error loading stored footsteps:', err);
    return FOOTSTEP_LOCATIONS;
  }
}

export function saveStoredFootsteps(data: FootstepLocation[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY_FOOTSTEPS, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving stored footsteps:', err);
  }
}

// --- CHANH HIEP ACTIONS STORE ---
export function loadStoredChanhHiepActions(): ChanhHiepActionModel[] {
  if (typeof window === 'undefined') return CHANH_HIEP_ACTION_MODELS;
  try {
    const raw = localStorage.getItem(KEY_CHANH_HIEP_ACTIONS);
    if (!raw) return CHANH_HIEP_ACTION_MODELS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : CHANH_HIEP_ACTION_MODELS;
  } catch (err) {
    console.error('Error loading stored Chanh Hiep actions:', err);
    return CHANH_HIEP_ACTION_MODELS;
  }
}

export function saveStoredChanhHiepActions(data: ChanhHiepActionModel[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY_CHANH_HIEP_ACTIONS, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving stored Chanh Hiep actions:', err);
  }
}

export const loadStoredActions = loadStoredChanhHiepActions;
export const saveStoredActions = saveStoredChanhHiepActions;

// --- FRONT INITIATIVES STORE ---
export function loadStoredInitiatives(): FrontInitiative[] {
  if (typeof window === 'undefined') return FRONT_INITIATIVE_DATA;
  try {
    const raw = localStorage.getItem(KEY_FRONT_INITIATIVES);
    if (!raw) return FRONT_INITIATIVE_DATA;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Filter out old AI mock items starting with 'init-'
      const sanitized = parsed.filter((item: FrontInitiative) => !item.id?.startsWith('init-'));
      return sanitized.length > 0 ? sanitized : FRONT_INITIATIVE_DATA;
    }
    return FRONT_INITIATIVE_DATA;
  } catch (err) {
    console.error('Error loading stored Front Initiatives:', err);
    return FRONT_INITIATIVE_DATA;
  }
}

export function syncInitiativesToHcmActions(initiatives: FrontInitiative[]): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(KEY_CHANH_HIEP_ACTIONS);
    let existingActions: ChanhHiepActionModel[] = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(existingActions)) existingActions = [];

    // Keep actions created directly in Chanh Hiep actions
    const manualActions = existingActions.filter((a) => !a.id.startsWith('hcm-action-'));

    // Build new synced actions from initiatives that have postToHcmSpace !== false
    const syncedActions: ChanhHiepActionModel[] = initiatives
      .filter((init) => init.postToHcmSpace !== false && init.status !== 'DRAFT')
      .map((init) => ({
        id: `hcm-action-${init.id}`,
        title: init.title,
        targetGroup: (init.unit || 'Ủy ban MTTQ Việt Nam phường Chánh Hiệp') as any,
        neighborhood: 'Phường Chánh Hiệp',
        summary: init.summary || '',
        practicalResult: init.impact || init.summary || '',
        inspirationalQuote: init.linkedHcmTopicTitle || 'Dân vận kém thì việc gì cũng kém. Dân vận khéo thì việc gì cũng thành công.',
        updatedDate: init.date || new Date().toLocaleDateString('vi-VN'),
        imageUrl: init.imageUrl,
        linkedInitiativeIds: [init.id]
      }));

    const finalActions = [...manualActions, ...syncedActions];
    localStorage.setItem(KEY_CHANH_HIEP_ACTIONS, JSON.stringify(finalActions));
  } catch (err) {
    console.error('Error syncing initiatives to HCM Actions:', err);
  }
}

export function saveStoredInitiatives(data: FrontInitiative[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY_FRONT_INITIATIVES, JSON.stringify(data));
    syncInitiativesToHcmActions(data);
  } catch (err) {
    console.error('Error saving stored Front Initiatives:', err);
  }
}
