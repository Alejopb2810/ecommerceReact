import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import getConfig from '../../Utils/getConfig'
import { getUserCart } from '../../store/slices/cart.slice'
import './styles/productDescription.css'

const ProductDescripcion = ({ product }) => {
    const dispatch = useDispatch()
    const cart = useSelector(state => state.cart)
    const [counter, setCounter] = useState(1)

    const handleMinus = () => {
        if (counter - 1 > 0) {
            setCounter(counter - 1)
        }
    }

    const handlePlus = () => {
        setCounter(counter + 1)
    }

    const handleCart = () => {
        const URL = 'https://e-commerce-api.academlo.tech/api/v1/cart'
        const data = {
            id: product.id,
            quantity: counter
        }
        axios.post(URL, data, getConfig())
            .then(res => {
                console.log(res.data)
                dispatch(getUserCart())
            })
            .catch(err => {
                if (err.response.status === 400) {
                    const URLPatch = 'https://e-commerce-api.academlo.tech/api/v1/cart'
                    const prevQuantity = cart.filter(e => e.id === product.id)[0].productsInCart.quantity
                    const data = {
                        id: product.id,
                        newQuantity: prevQuantity + counter
                    }
                    axios.patch(URLPatch, data, getConfig())
                        .then(res => {
                            console.log(res.data)
                            dispatch(getUserCart())
                        })
                        .catch(err => console.log(err))
                }
            })
    }

    return (
        <article className='description-container'>
            <h2 className='description__name'>{product?.title}</h2>
            <p className='description__paragraph'>{product?.description}</p>
            <section className='description__qualities'>
                <span className='description__span'>Price: </span>
                <h3 className='description__price'>${product?.price}</h3>
            </section>
            <section className='description__quantity'>
                <h3 className='description__title'>Quantity</h3>
                <div className='description__counter'>
                    <div className='description__minus' onClick={handleMinus}>-</div>
                    <div className='description__count'>{counter}</div>
                    <div className='description__plus' onClick={handlePlus}>+</div>
                </div>
            </section>
            <div>
                <button className='description__cart' onClick={handleCart}>Add to Cart <i className="fa-solid fa-cart-shopping"></i></button>
            </div>
        </article>
    )
}

export default ProductDescripcion