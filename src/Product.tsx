//import { useState, Fragment, ComponentProps } from 'react'
import './style.scss'
interface ProductProps {
  key: string;
  id:string;
  title: string;
  content:string;
  image:string;
}

function Product(props: ProductProps) {
  //console.log(props)
  let id:string = `slide-${props.id}`
  return (
    <div id={id}>
      <div className="ProductCard">
        <img className="StuffImage" src={props.image} />
        <div className="StuffHeader">{props.title} </div>
        <section className="StuffContent">{props.content}</section>
      </div>
    </div>
  )
}

export default Product;