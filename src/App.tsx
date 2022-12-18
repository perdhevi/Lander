import { useState } from 'react'
import './style.scss'
//import photoUrl from './images/myPhoto.jpg';
import ProductList from './ProductList';
import { BlogList } from './BlogList';
import linkedIn from './images/linkedin.svg'
import twitter from './images/twitter.svg'
//import myThree from './myThree';

function App() {
  const [count, setCount] = useState(0)
  //  myThree();
  return (
    <div className="App">
      <div className="detail">
        {/* <div className="half" >
          <img id="myPhoto" src={photoUrl} />

        </div> */}
        <section className="detailContent">
          <div className="textContent">
            Hi There,
          </div>
          <div className="textMyName">
            <div className="textContent">
              I'm
            </div>
            <div className="myName">
              <b className="myName">Raditya</b>
            </div>
          </div>
          <div className="textContent">
            A fullstack  Developer, that would be  a little bit of  back-end, a bit of front-end, a bit of mobile and a whole lot of small utilities
          </div>
        </section>

      </div>

      <div className="stuffs" >

        <ProductList />
      </div>

      <div className="blog">
        <BlogList />
      </div>
  
      <footer className='footer'>
        <a id="contactMe" />
        <div className="contactMe">

          <a className="socialButton" href="https://www.linkedin.com/in/raditya-perdhevi">
            <img src={linkedIn} alt='LinkedIn' width="40px" height="40px"/>
          </a>

          <a className="socialButton" href="https://twitter.com/perdhevi">
            <img src={twitter} alt='Twitter' width="40px" height="40px"/>
          </a>          
        </div>
      </footer>
    </div>
  )
}

export default App
