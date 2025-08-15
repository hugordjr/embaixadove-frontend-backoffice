import { BASE_URL } from "./env";
import { AuthService } from "./auth/authService";

export async function getMission({ page = 1, limit = 10 }: { page?: number; limit?: number }) {
  const url = `${BASE_URL}/missions`;// ?page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}`;
  
  // Usar headers de autenticação se disponível
  const headers = AuthService.getAuthHeaders();
  
  const res = await fetch(url, { 
    headers,
    next: { revalidate: 0 } 
  });
  
  console.log(res);
  if (!res.ok) {
    throw new Error(`Falha ao buscar missões externas: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

export type MissionCreatePayload = {
  title: string;
  description?: string;
  image_base64?: string;
  image_url?: string;
  points: number;
  type: string;
  status: string;
  deadline?: string; // ISO string
  highlighted?: boolean;
  briefing_objective?: string;
  briefing_target_audience?: string;
  briefing_main_message?: string;
  briefing_value_proposition?: string;
  instructions?: string[];
  required_hashtags?: string[];
};

export async function createMission(payload: MissionCreatePayload) {
  const url = BASE_URL + "/missions";
  
  // Usar headers de autenticação
  const headers = AuthService.getAuthHeaders();

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
    next: { revalidate: 0 }
  });

  if (!res.ok) {
    throw new Error(`Falha ao criar missão externa: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

export type MissionUpdatePayload = Partial<MissionCreatePayload>;

export async function updateMission(id: number | string, payload: MissionUpdatePayload) {
  const url = BASE_URL + "/missions/" + String(id);
  //const url = MISSIONS_ENDPOINTS.UPDATE_MISSION(String(id));
  
  // Usar headers de autenticação
  const headers = AuthService.getAuthHeaders();

  const res = await fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify(payload),
    next: { revalidate: 0 }
  });

  if (!res.ok) {
    throw new Error(`Falha ao atualizar missão externa: ${res.status} ${await res.text()}`);
  }
  return res.json();
}


