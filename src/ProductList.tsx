//import { useState, Fragment } from 'react'
import Product from './Product';
import './style.scss'
import * as stuffData from "./data/stuff.json";

interface Stuff{
  key:string;
  title:string;
  image:string;
  description:string;
}

function ProductList() {

  //good idea for carousel : https://css-tricks.com/css-only-carousel/
  //const [count, setCount] = useState(0)
  //console.log(stuffData.data);
  const list = stuffData.data.map((stuff: Stuff) => {
    let title = stuff.title;
    let content = stuff.description;
    let img = new URL(`./images/${stuff.image}`, import.meta.url).href;
    return <Product key={stuff.key} id={stuff.key} title={title} content={content} image={img}/>;
  })

  const contents = stuffData.data.map((stuff:Stuff) =>{
    let id:string = `#slide-${stuff.key}`
    return <a key={stuff.key} href={id}>{stuff.key}</a>
  })
  return (
    <div className="ProductList">
      <div className="slider">
        <div className="slides">
          {list}
        </div>
        {contents}
      </div>
    </div>
  );
}

export default ProductList;