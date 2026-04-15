import {Card} from "./App.tsx";

type ProductProps = {
    id: string,
    name: string,
    price: number,
    image?: string,
    onAddToCart?: () => void
}

function Product({name, onAddToCart}: ProductProps) {
    return <Card>
        {name}
        <button onClick={onAddToCart}>Add to cart</button>
    </Card>
}

export type {ProductProps}
export {Product}
