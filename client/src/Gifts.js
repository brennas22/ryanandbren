import React from 'react';
import './Gifts.css'; // Import your CSS file
import giftList from './GiftList.js'; // import the projects data
import { Link } from 'react-router-dom';



function Gifts() {
  return (
    <div className='outer-container'>

  
    <div className="faq-container">
      <p className="overline">Regarding gifts</p>
      
      <p>It is not necessary to get us a gift! However, we know saying that is futile because it's a wedding and all that. So if 
        you <em>must</em> get us a gift, what we'd appreciate most is assistance with our honeymoon fund! We're spending 2 weeks in Tuscany
        in October and are very much looking forward to eating our weight in pasta. We'd strongly prefer not to have to keep track of 
        checks or cash during the wedding festivities, so we'd prefer you give through our paypal registry below, or a check via mail (9 Seventh St, Cambridge MA 02141).</p>
      <p>But again, your presence is the present! We really really mean it.</p>
     

      <div className="portfolio-container">
      {giftList.map((giftList, index) => (
        <div className="portfolio-card" key={index}>
          <div className="portfolio-image">
            <img src={giftList.image} alt={giftList.title} />
          </div>
          <div className="portfolio-content">
            <h3>{giftList.title}</h3>
            <h4>{giftList.subtitle}</h4>
            <p>{giftList.description}</p>
            <Link to={giftList.link} className="read-more" target='_blank'>
              Read More
            </Link>
          </div>
        </div>
      ))}
    </div>
    </div>
    </div>
  );
}

export default Gifts;
