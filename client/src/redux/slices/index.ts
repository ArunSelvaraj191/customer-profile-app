import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../stores";
import axios, { AxiosError } from "axios";
import { Customer } from '../../types/index'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const addNewCustomer = createAsyncThunk(
  "posts/add-customer",
  async (newCustomer: Customer) => {
    try {
      const response = await axiosInstance.post<Customer>("/", newCustomer);
      return { customer: response?.data?.customer, message: response?.data?.message, status: response?.status, alreadyExist: response?.data?.alreadyExist };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error("Axios error:", axiosError.message);
        throw axiosError;
      } else {
        console.error("Unknown error:", error);
        throw error;
      }
    }
  }
);
export const updateExistCustomer = createAsyncThunk(
  "posts/update-customer",
  async (existCustomer: Customer) => {
    try {
      const response = await axiosInstance.post<Customer>("/update", existCustomer);
      return { customer: response?.data?.customer, message: response?.data?.message, status: response?.status };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error("Axios error:", axiosError.message);
        throw axiosError;
      } else {
        console.error("Unknown error:", error);
        throw error;
      }
    }
  }
);
export const deleteCustomer = createAsyncThunk(
  "posts/delete-customer",
  async (_id: string) => {
    try {
      const response = await axiosInstance.post<Customer>(`/delete/${_id}`);
      return { message: response?.data?.message, status: response?.status };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error("Axios error:", axiosError.message);
        throw axiosError;
      } else {
        console.error("Unknown error:", error);
        throw error;
      }
    }
  }
);

export const fetchCustomers = createAsyncThunk("customers/fetch-customer", async () => {
  try {
    const response = await axiosInstance.get<Customer[]>("/");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error("Axios error:", axiosError.message);
      throw axiosError;
    } else {
      console.error("Unknown error:", error);
      throw error;
    }
  }
});

const customerSlice = createSlice({
  name: "customers",
  initialState: {
    customers: [] as Customer[],
    status: "idle",
    error: null as string | null | undefined,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default customerSlice.reducer;

export const selectAllCustomers = (state: RootState) => state.customers.customers;
export const selectCustomersStatus = (state: RootState) => state.customers.status;
