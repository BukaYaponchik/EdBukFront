import React from 'react';
import Header from '../../../Components/Header/Header';

const Courses: React.FC = () => {
    return (
        <>
            <Header />
            <div className="page-content">
                <h2>У вас нет Активных курсов</h2>
            </div>
        </>
    );
};

export default Courses;