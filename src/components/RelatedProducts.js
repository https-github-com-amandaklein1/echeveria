/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import RelatedProductTile from './RelatedProductTile';

const RelatedProducts = () => {

  const [relatedIds, setRelatedIds] = useState([]);
  const [scrollPos, setScrollPos] = useState(0);
  const currentProductId = useSelector(state => state.styleList.product_id); // string 11001

  const fetchRelatedProductsIds = () => {
    axios.get(`/products/${currentProductId}/related`)
      .then(({data}) => {
        setRelatedIds(data);
      })
      .catch((err) => {
        throw err;
      })
  };

  useEffect(() => {
    fetchRelatedProductsIds();
  }, [])

  const handlePrevScroll = () => {
    document.getElementById('tiles').scrollLeft -= 189;
    setScrollPos(scrollPos - 1);
  }

  const handleNextScroll = () => {
    document.getElementById('tiles').scrollLeft += 189;
    setScrollPos(scrollPos + 1);
  }

  return (
    <div>
      <span>Related Products</span>
      <div id="RP-wrapper">
          {scrollPos !== 0 ?
          <span className="prev-arrow" onClick={handlePrevScroll}>&lsaquo;</span> :
          <></>}

          <span className="next-arrow" onClick={handleNextScroll}>&rsaquo;</span>

        <ol id="tiles">
          {relatedIds.map((id) => (
            <RelatedProductTile currentId={currentProductId} relId={id} key={id}/>
          ))}
        </ol>

      </div>
    </div>
  );
};


export default RelatedProducts;