
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { CgShoppingCart } from "react-icons/cg";

function Cart({style}) {

  const myId = useSelector(state => state.styleList.product_id);

  const [skuDetailByColor, setSkuDetailByColor] = useState({
    mainStyleInfo: [],
    skusByColor: [],
    sizesAndQtyByColor: [],
    qtyBySize: [],
  })

  const [userSelections, setUserSelections] = useState({
    sku: '',
    qty: '',
    size: ''
  })

  function getStyleInfo() {
    axios.get(`products/${myId}`)
      .then(({data}) => (
        setSkuDetailByColor(prevState => ({ ...prevState, "mainStyleInfo": data}))
      ))
      .catch((err) => {
        throw err;
      })
  }


  function getSkuDetail(skus) {

    setSkuDetailByColor(prevState => ({ ...prevState, "sizesAndQtyByColor": Object.values(skus), "skusByColor": Object.keys(skus)}))

  }


  function assignSizeAndQty(sizeQtyObj, sku) {
    const qtyArray = [];

    if (sizeQtyObj !== undefined) {
      setUserSelections(prevState => ({ ...prevState, "sku": sku, "size": sizeQtyObj.size, "qty": 1}))

    if(sizeQtyObj.quantity === 0) {
      qtyArray.push('SOLD OUT')
    }

    if (sizeQtyObj.quantity > 15) {
      for(let i = 1; i < 16; i++) {
      qtyArray.push(i);
    }
    } else {
      for(let i = 1; i < (sizeQtyObj.quantity + 1); i++) {
        qtyArray.push(i);
      }
    }

      setSkuDetailByColor(prevState => ({ ...prevState, "qtyBySize": qtyArray}))
    }
  }

  function getSizeAndQty(sizeIndex) {

    assignSizeAndQty(skuDetailByColor.sizesAndQtyByColor[sizeIndex], skuDetailByColor.skusByColor[sizeIndex])

  }

  function sendOrder(sku, qty) {
    if(!sku) {
      alert('Please select a size!');
    }

    if (sku && qty) {
      alert('Added to cart!');
      axios.post('/cart', {
        sku_id: sku,
        count: qty
      })
      .then(() => {
        setUserSelections(prevState => ({ ...prevState, "sku": '', "size": '', "qty": ''}))
        setSkuDetailByColor(prevState => ({ ...prevState, "qtyBySize": []}))
      })
    }
  }

  useEffect(() => {
    getStyleInfo() // fetch prod desc by id
    getSkuDetail(style.skus) // all qty/size combos
    setUserSelections({ "sku": '', "size": '', "qty": ''})
    setSkuDetailByColor(prevState => ({ ...prevState, "qtyBySize": []}))

  }, [style.style_id])




  return (
    <div className="currentStyleMain">
      <div>
        {
          style.sale_price === null ?
          <div className="price"> {`$${style.original_price}`} </div> : <div className="price">
            <div className="orgPrice">{`$${style.original_price}`}</div>
            <div className="salePrice">{`$${style.sale_price}`}</div>
          </div>
        }
      </div>
      <div className="sizeOptions">
        <div className="dropdown">
          <select value={!userSelections.size ? userSelections.size : undefined} className="dropdownFont" aria-label="size selector" onChange={e => getSizeAndQty(e.target.value)}>
            <option>Select a size...</option>
            {skuDetailByColor.sizesAndQtyByColor.map((sku, index) => (
              <option key={index} value={index}>
                {sku.size}
              </option>
            ))}
          </select>
        </div>
        <select className="dropdownFont" aria-label="quantity selector" value={userSelections.qty} onChange={e => setUserSelections(prevState => ({ ...prevState, "qty": e.target.value}))}>
          <option>QTY</option>
          {skuDetailByColor.qtyBySize.map((qty) => (
            <option key={qty} value={qty}>
              {qty}
            </option>
          ))}
        </select>
      </div>
      <button className="button" type="button" onClick={() => {sendOrder(userSelections.sku, userSelections.qty)
      }}>
        <CgShoppingCart className="bag" /> Add To Bag
      </button>
      <div>
        <div className="styleSlogan">{skuDetailByColor.mainStyleInfo.slogan}</div>
        <p className="styleDescription">{skuDetailByColor.mainStyleInfo.description}</p>
      </div>
  </div>

  )
}

export default Cart;