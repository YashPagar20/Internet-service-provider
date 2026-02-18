import api from './api';

export const getPlans = async () => {
    const response = await api.get('/plans');
    return response.data;
};

export const createPlan = async (planData) => {
    const response = await api.post('/plans', planData);
    return response.data;
};

export const updatePlan = async (id, planData) => {
    const response = await api.put(`/plans/${id}`, planData);
    return response.data;
};

export const deletePlan = async (id) => {
    const response = await api.delete(`/plans/${id}`);
    return response.data;
};
