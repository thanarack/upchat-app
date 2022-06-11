// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  generateHeaderWithToken,
  generateHeader,
} from '../utils/generateHeader';

// Define a service using a base URL and expected endpoints
export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/v1/' }),
  tagTypes: ['Post'],
  endpoints: (build) => ({
    postLogin: build.mutation({
      query: ({ username, password }) => ({
        url: 'login',
        method: 'post',
        headers: generateHeader(),
        body: { username, password },
      }),
    }),
    getProfile: build.mutation({
      query: () => ({
        url: 'profile',
        method: 'get',
        headers: generateHeaderWithToken(),
      }),
    }),
    getRooms: build.mutation({
      query: () => ({
        url: 'rooms',
        method: 'get',
        headers: generateHeaderWithToken(),
      }),
    }),
    getUser: build.mutation({
      query: (id) => ({
        url: `user/${id}`,
        method: 'get',
        headers: generateHeaderWithToken(),
      }),
    }),
    addUserRoom: build.mutation({
      query: (body) => ({
        url: `rooms/add`,
        method: 'post',
        headers: generateHeaderWithToken(),
        body,
      }),
    }),
    getRoomMessage: build.mutation({
      query: ({ channelId, pageNumber }) => ({
        url: `rooms/messages`,
        method: 'get',
        headers: generateHeaderWithToken(),
        params: { channelId, pageNumber: pageNumber || 1 },
      }),
    }),
    getContacts: build.mutation({
      query: (q) => ({
        url: 'contact',
        method: 'get',
        params: { q },
        headers: generateHeaderWithToken(),
      }),
    }),
    postProfileUpdate: build.mutation({
      query: (body) => ({
        url: 'profile/update',
        method: 'post',
        headers: generateHeaderWithToken(),
        body,
      }),
    }),
    postProfileImageUpdate: build.mutation({
      query: (body) => ({
        url: 'profile/avatar',
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
  usePostLoginMutation,
  useGetProfileMutation,
  useGetRoomsMutation,
  useGetUserMutation,
  useAddUserRoomMutation,
  useGetContactsMutation,
  useGetRoomMessageMutation,
  usePostProfileUpdateMutation,
  usePostProfileImageUpdateMutation
} = usersApi;
