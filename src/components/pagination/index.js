import React, { useReducer, useEffect } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Button, ButtonGroup, Intent, MenuItem } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
import PropTypes from "prop-types";
import { setParams } from "store/actions/record";

const items = [5, 10, 25, 50];

const style = {
  pagination: {
    marginTop: "1rem"
  }
};

const getState = ({ currentPage, size, total }) => {
  const totalPages = Math.ceil(total / size);

  console.log(currentPage, size, total);

  let startPage, endPage;
  if (totalPages <= 10) {
    startPage = 1;
    endPage = totalPages;
  } else {
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

  let correctCurrentpage = currentPage;
  if (currentPage > totalPages) {
    correctCurrentpage = totalPages;
  }
  if (currentPage <= 0) {
    correctCurrentpage = 1;
  }

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
    case "SELECT_CHANGE":
      return getState({
        ...state,
        size: action.size,
        currentPage: 1
      });
    case "TOTAL_CHANGE":
      return getState({
        ...state,
        total: action.total
      });

    default:
      throw new Error();
  }
};

const Pagination = ({
  initialPage,
  onPageChange,
  params,
  setParams,
  count
}) => {
  const [state, dispatch] = useReducer(
    reducer,
    { currentPage: initialPage, total: count, size: params.rowsPerPage },
    getState
  );

  useEffect(() => {
    dispatch({ type: "TOTAL_CHANGE", total: count });
    if (
      state.currentPage !== count / state.size &&
      count % state.size === 0 &&
      state.currentPage > 1
    ) {
      console.log("page change: ", state.currentPage);
      dispatch({ type: "PAGE_CHANGE", page: state.currentPage - 1 });
      onPageChange(state.currentPage - 1);
    }
  }, [count]);

  const handleClick = item => {
    if (item !== params.rowsPerPage) {
      setParams({ rowsPerPage: item, page: 1 });
      dispatch({ type: "SELECT_CHANGE", size: item });
    }
  };

  return (
    <div>
      <ButtonGroup style={style.pagination}>
        <Select
          filterable={false}
          items={items}
          itemRenderer={(item, { handleClick, modifiers, query }) => {
            if (!modifiers.matchesPredicate) {
              return null;
            }
            return (
              <MenuItem
                active={modifiers.active}
                label={item.toString()}
                onClick={handleClick}
                key={item}
              />
            );
          }}
          onItemSelect={handleClick}
        >
          <Button text={params.rowsPerPage} rightIcon="double-caret-vertical" />
        </Select>
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
  onPageChange: PropTypes.func,
  setParams: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired
};

Pagination.defaultProps = {
  initialPage: 1,
  size: 25
};

const mapStateToProps = state => ({
  params: state.record.params,
  count: state.record.count
});

const mapDispatchToProps = {
  setParams: setParams
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  Pagination
);
