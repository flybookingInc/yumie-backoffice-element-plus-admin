import { defineStore } from 'pinia'
import { doc, updateDoc, getFirestore } from 'firebase/firestore'
import { store } from '@/store'
import { useUserStore } from '@/store/modules/user'
import request from '@/config/axios'
import type {
  CreateExtrasItemRequest,
  CreateHotelPhotoRequest,
  CreateHotelRequest,
  DeleteExtrasItemRequest,
  DeleteHotelPhotoRequest,
  DeleteHotelRequest,
  GetExtrasItemByIdRequest,
  GetHotelPhotosRequest,
  UpdateExtraItemEnabledValueRequest,
  UpdateHotelPhotosRequest,
  UpdateHotelRequest
} from './types/api'
import { AxiosResponse } from 'axios'

/**
 * Defines a Vuex store for API-related functionality.
 * @file This file contains the Vuex store for API-related functionality.
 * @packageDocumentation
 */

/**
 * Defines the Pinia store for API-related functionality.
 */
export const useApiStore = defineStore('api_store', () => {
  /**
   * Updates the enable value of the extras feature in the Firestore database.
   * @param data - The data needed to update the extras feature's enable value.
   * @param data.value - The new value for the extras feature's enable field.
   */
  const updateEnableExtrasValue = (data: { value: boolean }) => {
    const { currentHotelId } = useUserStore(store)
    const { value } = data
    const docRef = doc(getFirestore(), 'qk-list', currentHotelId!)
    updateDoc(docRef, {
      'extras.enableExtras': value
    })
  }

  /**
   * Updates the enable value of an extra item in the Firestore database.
   * @param data - The data needed to update the extra item's enable value.
   * @param data.value - The new value for the extra item's enable field.
   * @param data.extraId - The ID of the extra item to update.
   */
  const updateExtraItemEnabledValue = (data: UpdateExtraItemEnabledValueRequest) => {
    const { currentHotelId } = useUserStore(store)
    const { value, extraId } = data
    const docRef = doc(getFirestore(), 'qk-list', currentHotelId!)
    updateDoc(docRef, {
      [`extras.items.${extraId}.enable`]: value
    })
  }

  /**
   * Updates an extras item.
   * @param data - The data to update the extras item with.
   * @param data.name - The new name for the extras item.
   * @param data.price - The new price for the extras item.
   * @param data.description - The new description for the extras item.
   * @param data.image - The new image for the extras item.
   * @returns A Promise that resolves to an AxiosResponse.
   */
  const updateExtrasItem = async (data: CreateExtrasItemRequest): Promise<AxiosResponse> => {
    return await request.put({
      url: '/updateExtrasItem',
      data: data
    })
  }

  /**
   * Retrieves an extras item by ID.
   * @param data - The request data.
   * @param data.id - The ID of the extras item to retrieve.
   * @returns A Promise that resolves to an AxiosResponse.
   */
  const getExtrasItemById = async (data: GetExtrasItemByIdRequest): Promise<AxiosResponse> => {
    return await request.post({
      url: '/getExtrasItemById',
      data: data
    })
  }

  /**
   * Deletes an extras item.
   * @param data - The request data.
   * @param data.id - The ID of the extras item to delete.
   * @returns A promise that resolves to the Axios response.
   */
  const deleteExtrasItem = async (data: DeleteExtrasItemRequest): Promise<AxiosResponse> => {
    return await request.delete({
      url: '/deleteExtrasItem',
      data: data
    })
  }

  /**
   * Retrieves hotel data from the server.
   * @param hotelId - The ID of the hotel to retrieve data for.
   * @returns A Promise that resolves with the hotel data.
   * @throws {Error} - If the hotelId is not provided or is not a string.
   */
  const getHotel = async (hotelId: string): Promise<AxiosResponse> => {
    if (!hotelId || typeof hotelId !== 'string') {
      throw new Error('飯店ID錯誤')
    }
    return await request.get({
      url: '/getHotel',
      params: {
        hotelId: hotelId
      }
    })
  }

  /**
   * Retrieves a list of hotels from the server for the current user's premission.
   */
  const getHotels = async (): Promise<AxiosResponse> => {
    return await request.get({
      url: '/getHotels'
    })
  }

  const updateHotel = async (data: UpdateHotelRequest): Promise<AxiosResponse> => {
    return await request.put({
      url: '/updateHotel',
      data: data
    })
  }

  const deleteHotel = async (data: DeleteHotelRequest): Promise<AxiosResponse> => {
    return await request.delete({
      url: '/deleteHotel',
      data: {
        hotelId: data.hotelId
      }
    })
  }

  const createHotel = async (data: CreateHotelRequest): Promise<AxiosResponse> => {
    return await request.post({
      url: '/createHotel',
      data: data
    })
  }

  const getHotelPhotos = async (data: GetHotelPhotosRequest): Promise<AxiosResponse> => {
    return await request.get({
      url: '/getHotelPhotos',
      params: data
    })
  }

  const createHotelPhoto = async (data: CreateHotelPhotoRequest): Promise<AxiosResponse> => {
    return await request.post({
      url: '/createHotelPhoto',
      data: data
    })
  }

  const updateHotelPhoto = async (data: UpdateHotelPhotosRequest): Promise<AxiosResponse> => {
    return await request.put({
      url: '/updateHotelPhotos',
      data: data
    })
  }

  const deleteHotelPhoto = async (data: DeleteHotelPhotoRequest): Promise<AxiosResponse> => {
    return await request.delete({
      url: '/deleteHotelPhoto',
      data: data
    })
  }

  return {
    updateEnableExtrasValue,
    updateExtraItemEnabledValue,
    updateExtrasItem,
    getExtrasItemById,
    deleteExtrasItem,
    getHotel,
    getHotels,
    updateHotel,
    deleteHotel,
    createHotel,
    getHotelPhotos,
    createHotelPhoto,
    deleteHotelPhoto,
    updateHotelPhoto
  }
})
