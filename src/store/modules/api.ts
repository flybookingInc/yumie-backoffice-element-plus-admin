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
  UpdateHotelRequest,
  createPlanRequest,
  createRoomTypeRequest,
  deletePlanRequest,
  deleteRoomTypeRequest,
  getExtrasItemsRequest,
  getPlanRequest,
  getPlansRequest,
  getRoomTypeRequest,
  getRoomTypesRequest,
  updatePlanRequest,
  updatePlanStatusRequest,
  updateRoomTypeRequest
} from './types/api'
import { AxiosResponse, isAxiosError } from 'axios'
import { ElMessage } from 'element-plus'

/**
 * Defines a Vuex store for API-related functionality.
 * @file This file contains the Vuex store for API-related functionality.
 * @packageDocumentation
 */

/**
 * Defines the Pinia store for API-related functionality.
 */
export const useApiStore = defineStore('api_store', () => {
  // show error message
  const showErrorMessage = (err: any) => {
    if (isAxiosError(err)) {
      const { response } = err
      if (response && response?.status >= 300) {
        ElMessage.error(response.data)
        return
      }
    }
  }

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
    return await request
      .put({
        url: '/updateExtrasItem',
        data: data
      })
      .catch((err) => {
        showErrorMessage(err)
        throw err
      })
  }

  /**
   * Retrieves a list of extras items.
   * @param data - The request data.
   * @param data.hotelId - The ID of the hotel to retrieve extras items for.
   * @param data.roomId - The ID of the room to retrieve extras items for.
   * @returns A Promise that resolves to an AxiosResponse.
   */
  const getExtrasItems = async (data: getExtrasItemsRequest): Promise<AxiosResponse> => {
    return await request
      .get({
        url: '/getExtrasItems',
        params: data
      })
      .catch((err) => {
        showErrorMessage(err)
        throw err
      })
  }

  /**
   * Retrieves an extras item by ID.
   * @param data - The request data.
   * @param data.id - The ID of the extras item to retrieve.
   * @returns A Promise that resolves to an AxiosResponse.
   */
  const getExtrasItem = async (data: GetExtrasItemByIdRequest): Promise<AxiosResponse> => {
    return await request
      .post({
        url: '/getExtrasItem',
        data: data
      })
      .catch((err) => {
        showErrorMessage(err)
        throw err
      })
  }

  /**
   * Deletes an extras item.
   * @param data - The request data.
   * @param data.id - The ID of the extras item to delete.
   * @returns A promise that resolves to the Axios response.
   */
  const deleteExtrasItem = async (data: DeleteExtrasItemRequest): Promise<AxiosResponse> => {
    return await request
      .delete({
        url: '/deleteExtrasItem',
        data: data
      })
      .catch((err) => {
        showErrorMessage(err)
        throw err
      })
  }

  /**
   * Retrieves hotel data from the server.
   * @param hotelId - The ID of the hotel to retrieve data for.
   * @returns A Promise that resolves with the hotel data.
   * @throws {Error} - If the hotelId is not provided or is not a string.
   */
  const getHotel = async (hotelId: string): Promise<AxiosResponse> => {
    return await request
      .get({
        url: '/getHotel',
        params: {
          hotelId: hotelId
        }
      })
      .catch((err) => {
        showErrorMessage(err)
        throw err
      })
  }

  /**
   * Retrieves a list of hotels from the server for the current user's premission.
   */
  const getHotels = async (): Promise<AxiosResponse> => {
    return await request
      .get({
        url: '/getHotels'
      })
      .catch((err) => {
        showErrorMessage(err)
        throw err
      })
  }

  const updateHotel = async (data: UpdateHotelRequest): Promise<AxiosResponse> => {
    return await request
      .put({
        url: '/updateHotel',
        data: data
      })
      .catch((err) => {
        showErrorMessage(err)
        throw err
      })
  }

  const deleteHotel = async (data: DeleteHotelRequest): Promise<AxiosResponse> => {
    return await request
      .delete({
        url: '/deleteHotel',
        data: {
          hotelId: data.hotelId
        }
      })
      .catch((err) => {
        showErrorMessage(err)
        throw err
      })
  }

  const createHotel = async (data: CreateHotelRequest): Promise<AxiosResponse> => {
    return await request
      .post({
        url: '/createHotel',
        data: data
      })
      .catch((err) => {
        showErrorMessage(err)
        throw err
      })
  }

  const getHotelPhotos = async (data: GetHotelPhotosRequest): Promise<AxiosResponse> => {
    return await request
      .get({
        url: '/getHotelPhotos',
        params: data
      })
      .catch((err) => {
        showErrorMessage(err)
        throw err
      })
  }

  const createHotelPhoto = async (data: CreateHotelPhotoRequest): Promise<AxiosResponse> => {
    return await request
      .post({
        url: '/createHotelPhoto',
        data: data
      })
      .catch((err) => {
        showErrorMessage(err)
        throw err
      })
  }

  const updateHotelPhoto = async (data: UpdateHotelPhotosRequest): Promise<AxiosResponse> => {
    return await request
      .put({
        url: '/updateHotelPhotos',
        data: data
      })
      .catch((err) => {
        showErrorMessage(err)
        throw err
      })
  }

  const deleteHotelPhoto = async (data: DeleteHotelPhotoRequest): Promise<AxiosResponse> => {
    return await request
      .delete({
        url: '/deleteHotelPhoto',
        data: data
      })
      .catch((err) => {
        showErrorMessage(err)
        throw err
      })
  }

  // get room types for specify hotel id
  const getRoomTypes = async (data: getRoomTypesRequest): Promise<AxiosResponse> => {
    return await request
      .get({
        url: '/getRoomTypes',
        params: data
      })
      .catch((err) => {
        showErrorMessage(err)
        throw err
      })
  }

  // get room type by id
  const getRoomType = async (data: getRoomTypeRequest): Promise<AxiosResponse> => {
    return await request
      .get({
        url: '/getRoomType',
        params: data
      })
      .catch((err) => {
        showErrorMessage(err)
        throw err
      })
  }

  // create room type
  const createRoomType = async (data: createRoomTypeRequest): Promise<AxiosResponse> => {
    return await request
      .post({
        url: '/createRoomType',
        data: data
      })
      .catch((err) => {
        showErrorMessage(err)
        throw err
      })
  }

  // update room type
  const updateRoomType = async (data: updateRoomTypeRequest): Promise<AxiosResponse> => {
    return await request
      .put({
        url: '/updateRoomType',
        data: data
      })
      .catch((err) => {
        showErrorMessage(err)
        throw err
      })
  }

  // delete room type
  const deleteRoomType = async (data: deleteRoomTypeRequest): Promise<AxiosResponse> => {
    return await request
      .delete({
        url: '/deleteRoomType',
        data: data
      })
      .catch((err) => {
        showErrorMessage(err)
        throw err
      })
  }

  // get plans
  const getPlans = async (data: getPlansRequest): Promise<AxiosResponse> => {
    return await request
      .get({
        url: '/getPlans',
        params: data
      })
      .catch((err) => {
        showErrorMessage(err)
        throw err
      })
  }

  // get plan
  const getPlan = async (data: getPlanRequest): Promise<AxiosResponse> => {
    return await request
      .get({
        url: '/getPlan',
        params: data
      })
      .catch((err) => {
        showErrorMessage(err)
        throw err
      })
  }

  // update plan
  const updatePlan = async (data: updatePlanRequest): Promise<AxiosResponse> => {
    return await request
      .put({
        url: '/updatePlan',
        data: data
      })
      .catch((err) => {
        showErrorMessage(err)
        throw err
      })
  }

  // create plan
  const createPlan = async (data: createPlanRequest): Promise<AxiosResponse> => {
    return await request
      .post({
        url: '/createPlan',
        data: data
      })
      .catch((err) => {
        showErrorMessage(err)
        throw err
      })
  }

  // delete plan
  const deletePlan = async (data: deletePlanRequest): Promise<AxiosResponse> => {
    return await request
      .delete({
        url: '/deletePlan',
        data: data
      })
      .catch((err) => {
        showErrorMessage(err)
        throw err
      })
  }

  // update plan status
  const updatePlanStatus = async (data: updatePlanStatusRequest): Promise<AxiosResponse> => {
    return await request
      .put({
        url: '/updatePlanStatus',
        data: data
      })
      .catch((err) => {
        showErrorMessage(err)
        throw err
      })
  }

  return {
    showErrorMessage,
    updateEnableExtrasValue,
    updateExtraItemEnabledValue,
    updateExtrasItem,
    getExtrasItems,
    getExtrasItemById: getExtrasItem,
    deleteExtrasItem,
    getHotel,
    getHotels,
    updateHotel,
    deleteHotel,
    createHotel,
    getHotelPhotos,
    createHotelPhoto,
    deleteHotelPhoto,
    updateHotelPhoto,
    getRoomTypes,
    getRoomType,
    createRoomType,
    updateRoomType,
    deleteRoomType,
    getPlans,
    getPlan,
    updatePlan,
    createPlan,
    deletePlan,
    updatePlanStatus
  }
})
