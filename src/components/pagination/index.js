import { useReducer } from "react";
import { Button, ButtonGroup, Intent } from "@blueprintjs/core";
import PropTypes from "prop-types";

const getState = ({ currentPage, size, total }) => {
  const totalPages = Math.ceil(total / size);

  // create an array of pages to ng-repeat in the pager control
  let startPage, endPage;
  if (totalPages <= 10) {
    // less than 10 total pages so show all
    startPage = 1;
    endPage = totalPages;
  } else {
    // more than 10 total pages so calculate start and end pages
    if (currentPage <= 6) {
      startPage = 1;
      endPage = 10;
    } else if (currentPage + 4 >= totalPages) {
      startPage = totalPages - 9;
      endPage = totalPages;
    } else {
      startPage = currentPage - 5;
      endPage = currentPage + 4;
    }
  }
  const pages = [...Array(endPage + 1 - startPage).keys()].map(
    i => startPage + i
  );

  // Too large or small currentPage
  let correctCurrentpage = currentPage;
  if (currentPage > totalPages) correctCurrentpage = totalPages;
  if (currentPage <= 0) correctCurrentpage = 1;

  return {
    currentPage: correctCurrentpage,
    size,
    total,
    pages,
    totalPages
  };
};

const reducer = (state, action) => {
  switch (action.type) {
    case "PAGE_CHANGE":
      return getState({
        currentPage: action.page,
        size: state.size,
        total: state.total
      });

    default:
      throw new Error();
  }
};

const Pagination = ({ initialPage, total, size, onPageChange }) => {
  const [state, dispatch] = useReducer(
    reducer,
    { currentPage: initialPage, total, size },
    getState
  );

  if (state.totalPages === 1) return null;

  return (
    <div>
      <h3>{JSON.stringify(state)}</h3>

      <br />

      <ButtonGroup>
        <Button
          disabled={state.currentPage === 1}
          onClick={() => {
            dispatch({ type: "PAGE_CHANGE", page: 1 });
            onPageChange(1);
          }}
        >
          First
        </Button>
        {state.pages.map(page => (
          <Button
            key={page}
            intent={state.currentPage === page ? Intent.PRIMARY : Intent.NONE}
            disabled={state.currentPage === page}
            onClick={() => {
              dispatch({ type: "PAGE_CHANGE", page });
              onPageChange(page);
            }}
          >
            {page}
          </Button>
        ))}
        <Button
          disabled={state.currentPage === state.totalPages}
          onClick={() => {
            dispatch({ type: "PAGE_CHANGE", page: state.totalPages });
            onPageChange(state.totalPages);
          }}
        >
          Last
        </Button>
      </ButtonGroup>
    </div>
  );
};

Pagination.propTypes = {
  initialPage: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onPageChange: PropTypes.func
};

Pagination.defaultProps = {
  initialPage: 1,
  size: 25
};

export default Pagination;
