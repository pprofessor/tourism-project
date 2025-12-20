import { DataProvider, fetchUtils } from 'react-admin';

// ============ تنظیمات API ============
const apiUrl = 'http://localhost:8080';
const httpClient = fetchUtils.fetchJson;

// ============ Helper Functions ============

/**
 * افزودن هدرهای احراز هویت به درخواست‌ها
 */
const httpClientWithAuth = (url: string, options: any = {}) => {
  const token = localStorage.getItem('admin_token') || localStorage.getItem('token');

  const authHeaders = token ? {
    'Authorization': `Bearer ${token}`,
  } : {};

  return httpClient(url, {
    ...options,
    headers: new Headers({
      'Content-Type': 'application/json',
      ...authHeaders,
      ...(options.headers || {}),
    }),
  });
};

/**
 * ساخت URL با پارامترهای جستجو و صفحه‌بندی
 */
const buildUrlWithParams = (baseUrl: string, params: any) => {
  const { page, perPage, sort, filter } = params;
  const query = new URLSearchParams();

  // صفحه‌بندی
  if (page && perPage) {
    query.append('page', page.toString());
    query.append('limit', perPage.toString());
  }

  // مرتب‌سازی
  if (sort && sort.field) {
    query.append('sortBy', sort.field);
    query.append('sortOrder', sort.order === 'ASC' ? 'asc' : 'desc');
  }

  // فیلترها
  if (filter) {
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, String(value));
      }
    });
  }

  const queryString = query.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

// ============ DataProvider اصلی ============
export const dataProvider: DataProvider = {

  // ============ دریافت لیست ============
  getList: (resource, params) => {
    // برای آمار داشبورد
    if (resource === 'stats') {
      return httpClientWithAuth(`${apiUrl}/stats/dashboard`).then(({ json }) => ({
        data: [json], // قرار دادن در آرایه برای سازگاری با react-admin
        total: 1,
      }));
    }

    // مقادیر پیش‌فرض برای صفحه‌بندی
    const page = params.pagination?.page || 1;
    const perPage = params.pagination?.perPage || 10;

    // برای سفیران
    if (resource === 'ambassadors') {
      const url = buildUrlWithParams(`${apiUrl}/admin/ambassadors`, {
        page,
        perPage,
        sort: params.sort,
        filter: params.filter,
      });

      return httpClientWithAuth(url).then(({ json }) => ({
        data: json.data || json,
        total: json.total || (Array.isArray(json) ? json.length : 0),
      }));
    }

    // برای کاربران
    if (resource === 'users') {
      const url = buildUrlWithParams(`${apiUrl}/admin/users`, {
        page,
        perPage,
        sort: params.sort,
        filter: params.filter,
      });

      return httpClientWithAuth(url).then(({ json }) => ({
        data: json.data || json,
        total: json.total || (Array.isArray(json) ? json.length : 0),
      }));
    }

    // برای هتل‌ها
    if (resource === 'hotels') {
      const url = buildUrlWithParams(`${apiUrl}/admin/hotels`, {
        page,
        perPage,
        sort: params.sort,
        filter: params.filter,
      });

      return httpClientWithAuth(url).then(({ json }) => ({
        data: json.data || json,
        total: json.total || (Array.isArray(json) ? json.length : 0),
      }));
    }

    // برای سایر منابع
    const url = buildUrlWithParams(`${apiUrl}/${resource}`, {
      page,
      perPage,
      sort: params.sort,
      filter: params.filter,
    });

    return httpClientWithAuth(url).then(({ json }) => ({
      data: json.data || json,
      total: json.total || (Array.isArray(json) ? json.length : 0),
    }));
  },

  // ============ دریافت یک آیتم ============
  getOne: (resource, params) => {
    // برای آمار
    if (resource === 'stats') {
      return httpClientWithAuth(`${apiUrl}/stats/dashboard`).then(({ json }) => ({
        data: json,
      }));
    }

    // برای سفیران
    if (resource === 'ambassadors') {
      return httpClientWithAuth(`${apiUrl}/admin/ambassadors/${params.id}`).then(({ json }) => ({
        data: json,
      }));
    }

    // برای کاربران
    if (resource === 'users') {
      return httpClientWithAuth(`${apiUrl}/admin/users/${params.id}`).then(({ json }) => ({
        data: json,
      }));
    }

    // برای هتل‌ها
    if (resource === 'hotels') {
      return httpClientWithAuth(`${apiUrl}/admin/hotels/${params.id}`).then(({ json }) => ({
        data: json,
      }));
    }

    // برای سایر منابع
    return httpClientWithAuth(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
      data: json,
    }));
  },

  // ============ دریافت چند آیتم ============
  getMany: (resource, params) => {
    // برای سفیران
    if (resource === 'ambassadors') {
      return httpClientWithAuth(`${apiUrl}/admin/ambassadors`).then(({ json }) => {
        const data = Array.isArray(json) ? json : (json.data || []);
        return {
          data: data.filter((item: any) => params.ids.includes(item.id)),
        };
      });
    }

    // برای سایر منابع
    const url = `${apiUrl}/${resource}`;
    return httpClientWithAuth(url).then(({ json }) => {
      const data = Array.isArray(json) ? json : (json.data || []);
      return {
        data: data.filter((item: any) => params.ids.includes(item.id)),
      };
    });
  },

  // ============ دریافت با reference ============
  getManyReference: (resource, params) => {
    // مقادیر پیش‌فرض برای صفحه‌بندی
    const page = params.pagination?.page || 1;
    const perPage = params.pagination?.perPage || 10;

    const url = buildUrlWithParams(`${apiUrl}/${resource}`, {
      page,
      perPage,
      sort: params.sort,
      filter: { ...params.filter, [params.target]: params.id },
    });

    return httpClientWithAuth(url).then(({ json }) => ({
      data: json.data || json,
      total: json.total || (Array.isArray(json) ? json.length : 0),
    }));
  },

  // ============ به‌روزرسانی ============
  update: (resource, params) => {
    // برای سفیران
    if (resource === 'ambassadors') {
      return httpClientWithAuth(`${apiUrl}/admin/ambassadors/${params.id}`, {
        method: 'PUT',
        body: JSON.stringify(params.data),
      }).then(({ json }) => ({ data: json }));
    }

    // برای کاربران
    if (resource === 'users') {
      return httpClientWithAuth(`${apiUrl}/admin/users/${params.id}`, {
        method: 'PUT',
        body: JSON.stringify(params.data),
      }).then(({ json }) => ({ data: json }));
    }

    // برای هتل‌ها
    if (resource === 'hotels') {
      return httpClientWithAuth(`${apiUrl}/admin/hotels/${params.id}`, {
        method: 'PUT',
        body: JSON.stringify(params.data),
      }).then(({ json }) => ({ data: json }));
    }

    // برای سایر منابع
    return httpClientWithAuth(`${apiUrl}/${resource}/${params.id}`, {
      method: 'PUT',
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json }));
  },

  // ============ ایجاد ============
  create: (resource, params) => {
    // برای سفیران
    if (resource === 'ambassadors') {
      return httpClientWithAuth(`${apiUrl}/admin/ambassadors`, {
        method: 'POST',
        body: JSON.stringify(params.data),
      }).then(({ json }) => ({ data: json }));
    }

    // برای سایر منابع
    return httpClientWithAuth(`${apiUrl}/${resource}`, {
      method: 'POST',
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json }));
  },

  // ============ حذف ============
  delete: (resource, params) => {
    // برای سفیران
    if (resource === 'ambassadors') {
      return httpClientWithAuth(`${apiUrl}/admin/ambassadors/${params.id}`, {
        method: 'DELETE',
      }).then(({ json }) => ({ data: json }));
    }

    // برای سایر منابع
    return httpClientWithAuth(`${apiUrl}/${resource}/${params.id}`, {
      method: 'DELETE',
    }).then(({ json }) => ({ data: json }));
  },

  // ============ به‌روزرسانی چندتایی ============
  updateMany: (resource, params) => {
    const promises = params.ids.map(id =>
      httpClientWithAuth(`${apiUrl}/${resource}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(params.data),
      })
    );
    return Promise.all(promises).then(() => ({ data: params.ids }));
  },

  // ============ حذف چندتایی ============
  deleteMany: (resource, params) => {
    const promises = params.ids.map(id =>
      httpClientWithAuth(`${apiUrl}/${resource}/${id}`, {
        method: 'DELETE',
      })
    );
    return Promise.all(promises).then(() => ({ data: params.ids }));
  }
};