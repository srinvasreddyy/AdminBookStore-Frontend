// Use full server URL for production, relative path for development
export const API_BASE = "https://connect.indianbookshouse.in/api/v1";


const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  const token = localStorage.getItem('accessToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export async function apiGet(path) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'GET',
    headers: getHeaders(),
    credentials: 'include',
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Request failed (${response.status}): ${text}`);
  }

  return response.json();
}

export async function apiPost(path, data) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: getHeaders(),
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = `Request failed (${response.status})`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // If response is not JSON, use the text
      const text = await response.text().catch(() => '');
      if (text) errorMessage = text;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function apiPostForm(path, formData) {
  const headers = {};
  
  const token = localStorage.getItem('accessToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const formResponse = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: formData,
  });

  if (!formResponse.ok) {
    let errorMessage = `Request failed (${formResponse.status})`;
    try {
      const errorData = await formResponse.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // If response is not JSON, use the text
      const text = await formResponse.text().catch(() => '');
      if (text) errorMessage = text;
    }
    throw new Error(errorMessage);
  }

  return formResponse.json();
}

// Helper for PATCH requests with FormData (multipart/form-data)
export async function apiPatchForm(path, formData) {
  const headers = {};
  const token = localStorage.getItem('accessToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const formResponse = await fetch(`${API_BASE}${path}`, {
    method: 'PATCH',
    headers,
    credentials: 'include',
    body: formData,
  });

  if (!formResponse.ok) {
    let errorMessage = `Request failed (${formResponse.status})`;
    try {
      const errorData = await formResponse.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      const text = await formResponse.text().catch(() => '');
      if (text) errorMessage = text;
    }
    throw new Error(errorMessage);
  }

  return formResponse.json();
}

export async function apiDelete(path) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'DELETE',
    headers: getHeaders(),
    credentials: 'include',
  });

  if (!response.ok) {
    let errorMessage = `Request failed (${response.status})`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // If response is not JSON, use the text
      const text = await response.text().catch(() => '');
      if (text) errorMessage = text;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function apiPatch(path, data) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'PATCH',
    headers: getHeaders(),
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = `Request failed (${response.status})`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // If response is not JSON, use the text
      const text = await response.text().catch(() => '');
      if (text) errorMessage = text;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

// Contact API functions
export async function getContactForAdmin() {
  return apiGet('/contacts/admin');
}

export async function createContact(contactData) {
  return apiPost('/contacts', contactData);
}

export async function updateContact(contactData) {
  return apiPatch('/contacts', contactData);
}

export async function deleteContact() {
  return apiDelete('/contacts');
}