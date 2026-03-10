// lib/api.ts
const API_URL = '';  // vide car le proxy gère tout

export async function sendMessage(message: string, historique: any[] = []) {
  const res = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ message, historique })
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

export async function getSession() {
  const res = await fetch(`${API_URL}/api/session`, {
    credentials: 'include'
  });
  return res.json();
}

export async function getFitscore() {
  const res = await fetch(`${API_URL}/api/fitscore`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  });
  return res.json();
}

export async function getAdmission() {
  const res = await fetch(`${API_URL}/api/admission`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  });
  return res.json();
}

export async function newChat() {
  const res = await fetch(`${API_URL}/api/new_chat`, {
    method: 'POST',
    credentials: 'include'
  });
  return res.json();
}