import React from 'react'
import apiClient from './axios.instance.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// creating new trading signal 

const createSignal = async (signalData) => {
    const response = await apiClient.post('/signals', signalData) ; 
    
    return response.data ; 
}

// fetching all signals - called every 15 seconds by Dashboard 

const getAllSignals = async () => {
    const response = await apiClient.get('/signals');

    return response.data ; 
}

// fetching a single signal ID

const getSignalById = async (id) => {
  const response = await apiClient.get(`/signals/${id}`);
  return response.data;
};

// Delete a signal by id

const deleteSignal = async (id) => {
  const response = await apiClient.delete(`/signals/${id}`);
  return response.data;
};


export { createSignal, getAllSignals, getSignalById, deleteSignal };
