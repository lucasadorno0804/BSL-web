const BASE_URL = 'https://api-rsbf.onrender.com';

export const api = {
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  },

  async request(endpoint, options) {
    const token = localStorage.getItem('@BSL:token');

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // Create an error that contains the response status to check for 400/409 overlaps
      const error = new Error(data.error || 'Ocorreu um erro na requisição');
      error.status = response.status;
      throw error;
    }

    return data;
  },

  createService: async (serviceData) => {
    const response = await fetch(`${BASE_URL}/schedule/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serviceData)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao criar serviço');
    }
    return response.json();
  },

  createProfessional: async (professionalData) => {
    const response = await fetch(`${BASE_URL}/schedule/professionals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(professionalData)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao adicionar membro à equipe');
    }
    return response.json();
  },

  deleteProfessional: async (id) => {
    const response = await fetch(`${BASE_URL}/schedule/professionals/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao remover membro da equipe');
    }
    return response.json();
  }
};
