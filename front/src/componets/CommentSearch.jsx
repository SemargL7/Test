import React, { useState } from 'react';

function CommentSearch({ setFilterWord, setSortLIFO }) {
    const [searchText, setSearchText] = useState('');
    const [isSortNewest, setIsSortNewest] = useState(true); // Додайте стан для сортування

    const handleInputChange = (e) => {
        setSearchText(e.target.value);
    }

    const handleSearch = () => {
        setFilterWord(searchText);
    }

    const handleSortChange = (e) => {
        setIsSortNewest(e.target.value === 'true');
        setSortLIFO(e.target.value === 'true');
    }

    return (
        <div className="search-nav">
            <div className="search-bar">
                <input
                    type="text"
                    value={searchText}
                    onChange={handleInputChange}
                />
                <button onClick={handleSearch}>Find</button>
            </div>
            <div>
                <select className="search-select" onChange={handleSortChange} value={isSortNewest}>
                    <option value={true}>Newest</option>
                    <option value={false}>Latest</option>
                </select>
            </div>
        </div>
    );
}

export default CommentSearch;
