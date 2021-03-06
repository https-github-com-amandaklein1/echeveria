/* eslint-disable class-methods-use-this */

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import StyleListContainer from '../containers/StyleListContainer';
import StyleVisualContainer from '../containers/styleVisualContainer';
import CartContainer from '../containers/cartContainer';
import RelatedProducts from './components/RelatedProducts';
import UserOutfit from './components/UserOutfit';


const App = ({ match }) => {

  const initialId = match.params.productId || '11001';
  const [currentProduct, setCurrentProduct] = useState(initialId);

  const changeCurrentProduct = (newProductId) => {
    console.log('updating current product');
    setCurrentProduct(newProductId);
  }

  const dispatch = useDispatch();

  useEffect(() => {
    axios.get(`/products/${currentProduct}/styles`)
    .then(({data}) => {
      dispatch({
        type: 'CHANGE_STYLE_LIST',
        styleList: data
      });
    })
    .catch((err) => {
      throw err;
    });
  });

  return (
    <>
      <div>
        <div className="logo">
          <h1>
            <a href="http://localhost:3000">PepManda</a>
          </h1>
        </div>

        <div className="productOverview">
          <StyleVisualContainer />
          <div className="rightSide">
            <div className="styleInfoAndThumbs">
              <StyleListContainer />
            </div>
            <div>
              <CartContainer />
            </div>
          </div>
        </div>
        <div className="relatedView RPUOwrapper">
          <RelatedProducts changeCurrentProduct={changeCurrentProduct}/>
          <UserOutfit changeCurrentProduct={changeCurrentProduct}/>
        </div>
      </div>
    </>
  );
}

export default App;