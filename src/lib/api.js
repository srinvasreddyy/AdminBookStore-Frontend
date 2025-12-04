// Use full server URL for production, relative path for development
// export const API_BASE = "https://connect.indianbookshouse.in/api/v1"; 
export const API_BASE = "http://localhost:8000/api/v1";

export async function apiGet(path) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
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
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = `Request failed (${response.status})`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
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
      const text = await formResponse.text().catch(() => '');
      if (text) errorMessage = text;
    }
    throw new Error(errorMessage);
  }

  return formResponse.json();
}

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
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    let errorMessage = `Request failed (${response.status})`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
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
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = `Request failed (${response.status})`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      const text = await response.text().catch(() => '');
      if (text) errorMessage = text;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

// --- Category API functions ---

// Fetches the hierarchical tree (for Category Management UI)
export async function getAllCategories() {
  return apiGet('/categories');
}

// Fetches a flat list (for Dropdowns/Filters)
export async function getCategoryList() {
  return apiGet('/categories/list');
}

export async function getCategoryById(categoryId) {
  return apiGet(`/categories/${categoryId}`);
}

export async function createCategory(categoryData, imageFile = null) {
  const formData = new FormData();
  formData.append('name', categoryData.name);
  if (categoryData.description) formData.append('description', categoryData.description);
  if (categoryData.parentId) formData.append('parentId', categoryData.parentId);
  
  if (imageFile) {
    formData.append('backgroundImage', imageFile);
  }
  
  // Using apiPostForm for multipart/form-data
  return apiPostForm('/categories', formData);
}

export async function updateCategory(categoryId, categoryData, imageFile = null) {
  const formData = new FormData();
  if (categoryData.name) formData.append('name', categoryData.name);
  if (categoryData.description !== undefined) formData.append('description', categoryData.description);
  
  if (imageFile) {
    formData.append('backgroundImage', imageFile);
  }
  
  return apiPatchForm(`/categories/${categoryId}`, formData);
}

export async function deleteCategory(categoryId) {
  return apiDelete(`/categories/${categoryId}`);
}

// --- REMOVED SUBCATEGORY FUNCTIONS (Merged into Category) ---

// Book API functions
export async function getBooksByCategory(categoryId, params = {}) {
  const queryParams = new URLSearchParams({
    category: categoryId,
    limit: '50',
    ...params
  });
  return apiGet(`/books?${queryParams}`);
}

export async function getBookById(bookId) {
  return apiGet(`/books/${bookId}`);
}

// Cart API functions
export async function getCart() {
  return apiGet('/cart');
}

export async function addItemToCart(bookId, quantity) {
  return apiPost('/cart/add-item', { bookId, quantity });
}

export async function removeItemFromCart(bookId) {
  return apiDelete(`/cart/remove-item/${bookId}`);
}

export async function clearCart() {
  return apiPost('/cart/clear');
}

// Order API functions
export async function initiateOrder(orderData) {
  return apiPost('/orders/initiate', orderData);
}

export async function getUserOrders(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiGet(`/orders${query ? `?${query}` : ''}`);
}

export async function getOrderById(orderId) {
  return apiGet(`/orders/${orderId}`);
}

// Payment API functions
export async function getRazorpayKey() {
  return apiGet('/payments/key');
}

export async function reportPaymentFailure(razorpayOrderId, reason) {
  return apiPost('/payments/failure', { razorpayOrderId, reason });
}

// User API functions
export async function getCurrentUser() {
  return apiGet('/users/current-user');
}

export async function forgotPassword(email) {
  return apiPost('/users/forgot-password', { email });
}

export async function verifyPasswordOTP(email, otp) {
  return apiPost('/users/verify-otp', { email, otp });
}

export async function resetPassword(email, otp, newPassword) {
  return apiPost('/users/reset-password', { email, otp, newPassword });
}

// Discount API functions
export async function validateCoupon(couponCode, cartSubtotal) {
  return apiPost('/discounts/validate', { couponCode, cartSubtotal });
}

// Contact API functions
export async function getContactDetails() {
  return apiGet('/contacts');
}

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

// Specials API
export async function getSpecials() {
  return apiGet('/specials');
}

export async function createSpecial(specialData) {
  const formData = new FormData();
  formData.append('title', specialData.title);
  if (specialData.description) formData.append('description', specialData.description);
  
  if (specialData.images && specialData.images.length > 0) {
    specialData.images.forEach((image) => {
      formData.append('images', image);
    });
  }
  
  return apiPostForm('/specials', formData);
}

export async function updateSpecial(id, specialData) {
  const formData = new FormData();
  if (specialData.title) formData.append('title', specialData.title);
  if (specialData.description) formData.append('description', specialData.description);
  
  if (specialData.images && specialData.images.length > 0) {
    const newImages = specialData.images.filter(img => img instanceof File);
    newImages.forEach((image) => {
      formData.append('images', image);
    });
  }
  
  return apiPatchForm(`/specials/${id}`, formData);
}

export async function deleteSpecial(id) {
  return apiDelete(`/specials/${id}`);
}

// Free Content API
export async function getFreeContent() {
  return apiGet('/free-content');
}

export async function createFreeContent(contentData) {
  const formData = new FormData();
  formData.append('title', contentData.title);
  if (contentData.description) formData.append('description', contentData.description);
  
  if (contentData.pdf) formData.append('pdf', contentData.pdf);
  if (contentData.coverImage) formData.append('coverImage', contentData.coverImage);
  
  return apiPostForm('/free-content', formData);
}

export async function updateFreeContent(id, contentData) {
  const formData = new FormData();
  if (contentData.title) formData.append('title', contentData.title);
  if (contentData.description) formData.append('description', contentData.description);
  
  if (contentData.pdf instanceof File) formData.append('pdf', contentData.pdf);
  if (contentData.coverImage instanceof File) formData.append('coverImage', contentData.coverImage);
  
  return apiPatchForm(`/free-content/${id}`, formData);
}

export async function deleteFreeContent(id) {
  return apiDelete(`/free-content/${id}`);
}