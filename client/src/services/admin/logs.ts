import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { generateHeaderWithToken } from '../../utils/generateHeader';

// Define a service using a base URL and expected endpoints
export const adminLogsApi = createApi({
  reducerPath: 'adminLogsApi',
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NODE_ENV === 'production'
        ? 'http://206.189.38.110:4000/'
        : 'http://localhost:4000/v1/',
  }),
  tagTypes: ['Post'],
  endpoints: (build) => ({
    getAdminLogs: build.mutation({
      query: () => ({
        url: 'logs',
        method: 'get',
        headers: generateHeaderWithToken(),
      }),
    }),
  }),
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const { useGetAdminLogsMutation } = adminLogsApi;
