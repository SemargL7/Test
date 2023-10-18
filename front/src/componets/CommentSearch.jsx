import React, { useState } from 'react';

function CommentSearch({ setFilterWord, setSortLIFO}) {
    const [searchText, setSearchText] = useState('');
    const [searchType, setSearchType] = useState('text');
    const [isSortNewest, setIsSortNewest] = useState(true);

    const handleInputChange = (e) => {
        setSearchText(e.target.value);
    }

    const handleSearch = () => {
        setFilterWord({ type: searchType, value: searchText });
    }

    const handleSortChange = (e) => {
        setIsSortNewest(e.target.value === 'true');
        setSortLIFO(e.target.value === 'true');
    }

    const handleSearchTypeChange = (e) => {
        setSearchType(e.target.value);
    }

    return (
        <div className="search-nav">
            <div className="search-bar">
                <div>
                    <select className="search-select" onChange={handleSearchTypeChange} value={searchType}>
                        <option value="text">Text</option>
                        <option value="username">Username</option>
                        <option value="email">Email</option>
                    </select>
                </div>
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
