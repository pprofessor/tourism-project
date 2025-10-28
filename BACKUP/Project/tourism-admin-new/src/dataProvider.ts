import { DataProvider, fetchUtils } from 'react-admin';

const apiUrl = 'http://localhost:8083';
const httpClient = fetchUtils.fetchJson;

export const dataProvider: DataProvider = {
  getList: (resource, params) => {
    // برای stats
    if (resource === 'stats') {
      return httpClient(`${apiUrl}/stats/dashboard`).then(({ json }) => ({
        data: [json], // قرار دادن در آرایه
        total: 1,
      }));
    }
    
    const url = `${apiUrl}/${resource}`;
    return httpClient(url).then(({ json }) => ({
      data: json,
      total: json.length,
    }));
  },

  getOne: (resource, params) => {
    // برای stats
    if (resource === 'stats') {
      return httpClient(`${apiUrl}/stats/dashboard`).then(({ json }) => ({
        data: json,
      }));
    }
    
    return httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
      data: json,
    }));
  },

  getMany: (resource, params) => {
    const url = `${apiUrl}/${resource}`;
    return httpClient(url).then(({ json }) => ({
      data: json.filter((item: any) => params.ids.includes(item.id)),
    }));
  },

  getManyReference: (resource, params) => {
    const url = `${apiUrl}/${resource}`;
    return httpClient(url).then(({ json }) => ({
      data: json,
      total: json.length,
    }));
  },

  update: (resource, params) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: 'PUT',
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json })),

  create: (resource, params) =>
    httpClient(`${apiUrl}/${resource}`, {
      method: 'POST',
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json })),

  delete: (resource, params) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: 'DELETE',
    }).then(({ json }) => ({ data: json })),

  updateMany: (resource, params) => {
    const promises = params.ids.map(id =>
      httpClient(`${apiUrl}/${resource}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(params.data),
      })
    );
    return Promise.all(promises).then(() => ({ data: params.ids }));
  },

  deleteMany: (resource, params) => {
    const promises = params.ids.map(id =>
      httpClient(`${apiUrl}/${resource}/${id}`, {
        method: 'DELETE',
      })
    );
    return Promise.all(promises).then(() => ({ data: params.ids }));
  }
};