import React, { useState } from 'react';
import Header from '../../../Components/Header/Header';
import './Shop.css';

const Shop: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'electronics' | 'books'>('electronics');

    return (
        <>
            <Header />
            <div className="shop-page">
                <div className="shop-sidebar">
                    <button
                        className={`shop-tab ${activeTab === 'electronics' ? 'active' : ''}`}
                        onClick={() => setActiveTab('electronics')}
                    >
                        Курсы
                    </button>
                    <button
                        className={`shop-tab ${activeTab === 'books' ? 'active' : ''}`}
                        onClick={() => setActiveTab('books')}
                    >
                        Школа
                    </button>
                </div>
            </div>
        </>
    );
};

export default Shop;