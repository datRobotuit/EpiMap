import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Get disease total statistics
export const fetchDiseaseTotals = async (diseaseType) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/report/totals/${diseaseType}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching disease totals:', error);
        throw error;
    }
};

// Get recent disease statistics (last 10 days)
export const fetchRecentDiseaseData = async (diseaseType) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/report/recent/${diseaseType}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching recent disease data:', error);
        throw error;
    }
};

// Get available disease types
export const fetchDiseaseTypes = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/report/types`);
        return response.data;
    } catch (error) {
        console.error('Error fetching disease types:', error);
        throw error;
    }
};

// Get latest report for a province
export const fetchLatestReport = async (provinceName, diseaseType) => {
    try {
        const province = encodeURIComponent(provinceName);
        const type = encodeURIComponent(diseaseType);
        const response = await axios.get(`${API_BASE_URL}/report/latest/${province}/${type}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching latest report:', error);
        throw error;
    }
};

// Get healthcare facilities
export const fetchFacilities = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/facilities`);
        return response.data;
    } catch (error) {
        console.error('Error fetching facilities:', error);
        throw error;
    }
};
// Get top 5 affected areas for a disease
export const fetchTopAffectedAreas = async (diseaseType) => {
    try {
        const type = encodeURIComponent(diseaseType);
        const response = await axios.get(`${API_BASE_URL}/report/top5/${type}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching top affected areas:', error);
        throw error;
    }
};