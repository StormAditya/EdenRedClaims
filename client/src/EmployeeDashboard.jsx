import React from 'react';
import { CLAIMS, STATUS, CATEGORIES } from './mockData';

export default function EmployeeDashboard({ user, onLogout }) {
    const employeeClaims = CLAIMS.filter(claim => claim.userID === user.userID);

    const getStatusName = (statusID) => {
        const found = STATUS.find(s => s.Status_ID === statusID);
        return found ? found.Status : "Unknown";
    };

    const getCategoryName = (categoryId) => {
        const found = CATEGORIES.find(c => c.Category_ID === categoryId);
        return found ? found.Category : "Unknown";
    };

    return (
        <div className='min-h-screen bg-zinc-950'></div>
    )
}