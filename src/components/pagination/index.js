import React, { useEffect, useState, useMemo } from 'react';
import classNames from 'classnames/bind';

import { LongArrowLeftIcon, LongArrowRightIcon } from '../../components/icons';

import styles from './pagination.module.scss';

const cx = classNames.bind(styles);

const Pagination = (props) => {
  const {
    current,
    total,
    perPageShow = 10,
    showPage = 5,
    className,
    onChange,
  } = props;

  const [currentPage, setCurrentPage] = useState(1);

  const totalPage = total > 0 ? Math.ceil(total / perPageShow) : 0;

  const pages = useMemo(() => {
    const showBasis = Math.floor(showPage / 2);

    const lastPageCnt = totalPage - (showPage * Math.floor(totalPage / showPage));
    
    if (totalPage > showPage) {
      if (currentPage - 1 + showBasis >= totalPage) {
        return Array.from(Array(lastPageCnt).keys()).map((num) => {
          return totalPage - lastPageCnt + num;
        });
      }

      if (currentPage >= showBasis) {
        let pageCnt = showPage;
        
        if (currentPage + showBasis >= totalPage) {
          pageCnt = showPage - 1;
        }

        return Array.from(Array(pageCnt).keys()).map((num) => {
          return currentPage - showBasis + num;
        });
      }

      return Array.from(Array(showPage).keys());
    }

    return Array.from(Array(totalPage).keys());
  }, [currentPage, totalPage, showPage]);

  useEffect(() => {
    setCurrentPage(() => current);
  }, [current]);

  const atChangePage = (page) => {
    if (page > totalPage || page <= 0) {
      return;
    }

    setCurrentPage(() => page);

    if (onChange) {
      onChange(page, perPageShow);
    }
  };

  if (pages.length === 0) {
    return null;
  }

  return (
    <div className={cx('pagination_container', {[className]: className})}>
      <ul>
        <li className={cx('arrow', {disabled: currentPage === 1})}>
          <button onClick={() => atChangePage(currentPage - 1)}>
            <i>{<LongArrowLeftIcon />}</i>
          </button>
        </li>
        {pages.map((page, idx) => {
          const pageVal = page + 1;

          return (
            <li key={idx} className={cx({active: currentPage === pageVal})}>
              <button onClick={() => atChangePage(pageVal)}>
                <span>{pageVal}</span>
              </button>
            </li>
          );
        })}
        <li className={cx('arrow', {disabled: currentPage === totalPage})}>
          <button onClick={() => atChangePage(currentPage + 1)}>
            <i>{<LongArrowRightIcon />}</i>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
