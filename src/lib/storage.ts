export interface VisitRequest {
  id: string;
  name: string;
  grade: string;
  phone: string;
  reason: string;
  date: string;
  time: string;
  method: string;
  prayer: string;
  createdAt: string;
}

const STORAGE_KEY = 'visit_requests';

export function getRequests(): VisitRequest[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function addRequest(request: Omit<VisitRequest, 'id' | 'createdAt'>): void {
  const requests = getRequests();
  requests.push({
    ...request,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

export function deleteRequest(id: string): void {
  const requests = getRequests().filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

// Admin credentials (simple client-side auth)
const ADMIN_ID = 'admin';
const ADMIN_PW = 'jejadeul2024';

export function adminLogin(id: string, pw: string): boolean {
  if (id === ADMIN_ID && pw === ADMIN_PW) {
    sessionStorage.setItem('admin_logged_in', 'true');
    return true;
  }
  return false;
}

export function isAdminLoggedIn(): boolean {
  return sessionStorage.getItem('admin_logged_in') === 'true';
}

export function adminLogout(): void {
  sessionStorage.removeItem('admin_logged_in');
}
