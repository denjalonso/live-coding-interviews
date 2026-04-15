import React from 'react'
import './App.css';
import {Product, type ProductProps} from "./Product.tsx";

export const Grid = ({children}: React.PropsWithChildren) => <div style={{display: 'grid'}}>{children}</div>
export const Card = ({children}: React.PropsWithChildren) => <div style={{gridRow: 'auto'}}>{children}</div>


type Products = ProductProps[]

const products: Products = [
    {id: '1', name: 'Product 1', price: 100, image: 'some-url-img'},
    {id: '2', name: 'Product 2', price: 200, image: 'some-url-img'},
    {id: '3', name: 'Product 3', price: 300, image: 'some-url-img'},
    {id: '4', name: 'Product 4', price: 400, image: 'some-url-img'},
    {id: '5', name: 'Product 5', price: 500},
    {id: '6', name: 'Product 6', price: 600, image: 'some-url-img'},
]

function ProductGrid({children}: React.PropsWithChildren) {
    return <Grid>
        {children}
    </Grid>
}

type CartProducts = {
    quantity: number
    total: number
} & Products[]

interface CartProps {
    products?: CartProducts
}

function Cart({products}: CartProps) {
    return <ul>
        {products?.map(p => <li key={p.id}>{`${p.name} | ${p.price}`}</li>)}
    </ul>;
}

function App() {
    const [cartProducts, setCartProducts] = React.useState<CartProducts>([])
    return (
        <>
            <ProductGrid>
                {products.map(p => {
                    return <Product key={p.id} {...p}
                                    onAddToCart={() => setCartProducts(cartProducts => [...cartProducts, p])}/>
                })}
            </ProductGrid>
            <Cart products={cartProducts}/>
        </>
    );
}

export default App;
