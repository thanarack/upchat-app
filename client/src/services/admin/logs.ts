import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { generateHeaderWithToken } from '../../utils/generateHeader';

// Define a service using a base URL and expected endpoints
export const adminLogsApi = createApi({
  reducerPath: 'adminLogsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/v1/admin' }),
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
