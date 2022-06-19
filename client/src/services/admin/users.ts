import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { generateHeaderWithToken } from '../../utils/generateHeader';

// Define a service using a base URL and expected endpoints
export const adminUsersApi = createApi({
  reducerPath: 'adminUsersApi',
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.REACT_APP_ENVIRONMENT === 'production'
        ? 'http://206.189.38.110:4000/v1/admin/'
        : 'http://localhost:4000/v1/admin/',
  }),
  tagTypes: ['Post'],
  endpoints: (build) => ({
    getAdminUsers: build.mutation({
      query: (params) => ({
        url: 'users',
        method: 'get',
        headers: generateHeaderWithToken(),
        params,
      }),
    }),
    getAdminDeleteUsers: build.mutation({
      query: (userId) => ({
        url: 'delete/users',
        method: 'get',
        headers: generateHeaderWithToken(),
        params: { userId },
      }),
    }),
    postAdminNewUsers: build.mutation({
      query: (body) => ({
        url: 'new/users',
        method: 'post',
        headers: generateHeaderWithToken(),
        body,
      }),
    }),
    getAdminUsersPosition: build.mutation({
      query: (params) => ({
        url: 'users/position',
        method: 'get',
        headers: generateHeaderWithToken(),
        params,
      }),
    }),
    getAdminDeleteUserPosition: build.mutation({
      query: (positionId) => ({
        url: 'delete/users/position',
        method: 'get',
        headers: generateHeaderWithToken(),
        params: { positionId },
      }),
    }),
    postAdminNewUserPosition: build.mutation({
      query: (body) => ({
        url: 'new/users/position',
        method: 'post',
        headers: generateHeaderWithToken(),
        body,
      }),
    }),
    postAdminUpdateUserPosition: build.mutation({
      query: (body) => ({
        url: 'update/users/position',
        method: 'post',
        headers: generateHeaderWithToken(),
        body,
      }),
    }),
  }),
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAdminUsersMutation,
  useGetAdminDeleteUsersMutation,
  usePostAdminNewUsersMutation,
  useGetAdminUsersPositionMutation,
  useGetAdminDeleteUserPositionMutation,
  usePostAdminNewUserPositionMutation,
  usePostAdminUpdateUserPositionMutation,
} = adminUsersApi;
