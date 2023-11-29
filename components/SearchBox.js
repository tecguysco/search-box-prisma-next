import { useRouter } from "next/router";
import { useState } from "react";
import styles from "styles/SearchBox.module.css";

const SearchHistoryItem = ({ term, index, onDeleteSearchTerm }) => {
  const link = "/searchpage?searchStr=" + term.searchStr + "&history=true";
  return (
    <div className="btn btn-secondary m-2">
      <a href={link} className={styles.termA}>
        {term.searchStr}
      </a>
      <span
        style={{
          marginLeft: 8,
        }}
        onClick={() => onDeleteSearchTerm(index)}
      >
        x
      </span>
    </div>
  );
};

const SearchBox = ({ history, onDeleteSearchTerm }) => {
  const [search, setSearch] = useState("");
  const router = useRouter()

  const findSearch = (e) => {
    setSearch(e.target.value);
  };

  const preventDefault = f => e => {
    e.preventDefault()
    f(e)
  }

  const handleSubmit = preventDefault(() => {
    router.push({
      pathname: '/searchpage',
      query: {searchStr: search.toLowerCase()}
    })
  })

  return (
    <div className="col-lg-12 p-4">
      <div className="card mb-4">
        <div className="card-header">Search</div>
        <div className="card-body">
          <form onSubmit={handleSubmit} method="post" className="d-flex flex-row">
            <input
              onChange={findSearch}
              className="form-control"
              type="text"
              placeholder="Enter search term..."
              aria-label="Enter search term..."
              aria-describedby="button-search"
            />

            <button
              className="mx-2 btn btn-primary"
              id="button-search"
              type="submit"
              disabled={!(search?.length > 0)}
            >
              Go!
            </button>
          </form>
          <div className="mt-4">
            {history?.map((term, index) => (
              <SearchHistoryItem
                key={index}
                term={term}
                index={index}
                onDeleteSearchTerm={onDeleteSearchTerm}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
