import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { generateHeaderWithToken } from '../../utils/generateHeader';

// Define a service using a base URL and expected endpoints
export const adminRoomsApi = createApi({
  reducerPath: 'adminRoomsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/v1/admin' }),
  tagTypes: ['Post'],
  endpoints: (build) => ({
    getAdminRooms: build.mutation({
      query: () => ({
        url: 'rooms',
        method: 'get',
        headers: generateHeaderWithToken(),
      }),
    }),
    getAdminDeleteRooms: build.mutation({
      query: (channelId) => ({
        url: 'delete/rooms',
        method: 'get',
        headers: generateHeaderWithToken(),
        params: { channelId },
      }),
    }),
    postAdminUpdateRooms: build.mutation({
      query: ({ channelId, title }) => ({
        url: 'update/rooms',
        method: 'post',
        headers: generateHeaderWithToken(),
        body: { channelId, title },
      }),
    }),
  }),
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAdminRoomsMutation,
  useGetAdminDeleteRoomsMutation,
  usePostAdminUpdateRoomsMutation,
} = adminRoomsApi;
