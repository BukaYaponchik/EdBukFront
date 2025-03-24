import React from 'react';
import Header from '../../../Components/Header/Header';

const School: React.FC = () => {
    return (
        <>
            <Header />
            <div className="page-content">
                <h2>У вас нет Активных занятий</h2>
            </div>
        </>
    );
};

export default School;