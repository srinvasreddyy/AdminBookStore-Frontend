// Use full server URL for production, relative path for development
export const API_BASE = "https://connect.indianbookshouse.in/api/v1";
// export const API_BASE = "http://localhost:8000/api/v1";

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

// Client API functions
export async function getClients() {
  return apiGet('/clients');
}

export async function createClient(clientData, logoFile = null) {
  if (logoFile) {
    const formData = new FormData();
    formData.append('name', clientData.name);
    formData.append('url', clientData.url);
    formData.append('logo', logoFile);
    return apiPostForm('/clients', formData);
  }
  return apiPost('/clients', clientData);
}

export async function updateClient(clientId, clientData, logoFile = null) {
  if (logoFile) {
    const formData = new FormData();
    formData.append('name', clientData.name);
    formData.append('url', clientData.url);
    formData.append('logo', logoFile);
    return apiPatchForm(`/clients/${clientId}`, formData);
  }
  return apiPatch(`/clients/${clientId}`, clientData);
}

export async function deleteClient(clientId) {
  return apiDelete(`/clients/${clientId}`);
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

// Category API functions
export async function getAllCategories() {
  return apiGet('/categories');
}

export async function getCategoryById(categoryId) {
  return apiGet(`/categories/${categoryId}`);
}

export async function createCategory(categoryData, imageFile = null) {
  if (imageFile) {
    const formData = new FormData();
    formData.append('name', categoryData.name);
    if (categoryData.description) formData.append('description', categoryData.description);
    formData.append('backgroundImage', imageFile);
    return apiPostForm('/categories', formData);
  }
  return apiPost('/categories', categoryData);
}

export async function updateCategory(categoryId, categoryData, imageFile = null) {
  if (imageFile) {
    const formData = new FormData();
    if (categoryData.name) formData.append('name', categoryData.name);
    if (categoryData.description !== undefined) formData.append('description', categoryData.description);
    formData.append('backgroundImage', imageFile);
    return apiPatchForm(`/categories/${categoryId}`, formData);
  }
  return apiPatch(`/categories/${categoryId}`, categoryData);
}

export async function deleteCategory(categoryId) {
  return apiDelete(`/categories/${categoryId}`);
}

// Subcategory API functions
export async function getAllSubCategories() {
  return apiGet('/categories/subs');
}

export async function createSubCategory(subCategoryData) {
  return apiPost('/categories/subs', subCategoryData);
}

export async function updateSubCategory(subCategoryId, subCategoryData) {
  return apiPatch(`/categories/subs/${subCategoryId}`, subCategoryData);
}

export async function deleteSubCategory(subCategoryId) {
  return apiDelete(`/categories/subs/${subCategoryId}`);
}