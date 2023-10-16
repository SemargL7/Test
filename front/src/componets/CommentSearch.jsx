
function CommentSearch(){
    return(
        <div className="search-nav">
            <div className="search-bar">
                <input/>
                <button>Find</button>
            </div>
            <div>
                <select className="search-select">
                    <option>Newest</option>
                    <option>Latest</option>
                </select>
            </div>
        </div>

    )
}
export default CommentSearch;
