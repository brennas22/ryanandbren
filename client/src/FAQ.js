import React from 'react';
import './FAQ.css'; // Import your CSS file

function FAQ() {
  return (
    <div className="faq-container">
      <p className="overline">Things you need to know</p>
      
      <h4>Where is the wedding?</h4>
      <p>Our wedding will take place at Sarma, a restaurant in Somerville, MA (249 Pearl St, Somerville, MA 02145). 
        There will be an afterparty for anyone who still wants to boogie at the Abbey, a bar in Cambridge.</p>
      <p>The festivities will begin promptly at 5 PM and go until 10:30 PM. The after party will be from 10:30 until 2 AM, or whenever they kick us out.</p>
      <h4>What should I wear?</h4>
      <p>This is a FANCY wedding!! Please use it as an excuse to get dressed to the nines, but you can skip the tuxedo, a suit is fine. 
        For folks in dresses, we would love if you wore ankle or full length dresses in <strong> colorful floral prints</strong>. Ryan 
        would like it to be known that the wedding is definitely <em>not</em> Jimmy Buffet themed, but Brenna would like it to be known 
        that it definitely <em>is</em> Jimmy Buffet themed. Upscale Jimmy Buffet. Jimmy Buffet if you forced him to go to the Oscars.</p>
      <h5>Here's some inspo for ya (or check out <a href='https://pin.it/7ASG2YwV9' target='_blank'>this Pinterest board we made!</a>)</h5>
      {/* Pinterest Board Widget */}
      {/* <div className="pinterest-board">
        <a
          data-pin-do="embedBoard"
          data-pin-board-width="400"
          data-pin-scale-height="240"
          data-pin-scale-width="80"
          href="https://www.pinterest.com/brenna0623/wedding-guest-inspiration/"
        ></a>
      </div> */}
     <div className="image-row">
     <a href="https://pin.it/7ASG2YwV9" target="_blank">
        <img src="/inspo1.jpg" alt="Image 1" />
</a>
        <a href="https://pin.it/7ASG2YwV9" target="_blank">
        <img src="/inspo2.jpg" alt="Image 2" />
</a>
        <a href="https://pin.it/7ASG2YwV9" target="_blank">
        <img src="/inspo3.jpg" alt="Image 3" />
        </a>
    </div>

      <h4>Where should I stay?</h4>
      <p>There are many great areas in Cambridge, Somerville, and Boston! Because this is a relatively small wedding, we don't have a hotel
        block, but there are a few hotels near us in East Cambridge that we recommend:
      </p>
      <ul>
        <li><a target='_blank' href='https://maps.app.goo.gl/uScekbjZhijTysWC7'>Holiday Inn Express & Suites Boston - Cambridge, an IHG Hotel</a></li>
        <li><a target='_blank' href='https://maps.app.goo.gl/X7yzGMCwtp36xmBEA'>Hampton Inn Boston/Cambridge</a></li>
        <li><a target='_blank' href='https://maps.app.goo.gl/oHgx8L8mKyCvUmYT9'>Fairfield Inn & Suites Boston Cambridge</a></li>
      </ul>
      <p>Additionally, there's a cute hotel in Union Square, (<a href='https://maps.app.goo.gl/H7uuEu5n1rcvZxC39'>Cambria Hotel Boston 
      Somerville</a>), that is walking distance to Sarma, but please note <em>that walk involves going up a big hill.</em></p>
      <p>There are also quite a few lovely Airbnbs in the area!</p>

      <h4>How do I get to the venue?</h4>
      <p>Boston has great public transportation, and Sarma is right next to the Gilman Square stop on the Green Line E train (easily accessed
        from the Lechmere stop in East Cambridge). Uber and Lyft are also readily available.
      </p>

      <h4>Should I get you a gift?</h4>
      <p>It is not necessary to get us a gift! However, we know saying that is futile because it's a wedding and all that. So if 
        you <em>must</em> get us a gift, what we'd appreciate most is assistance with our honeymoon fund! We're spending 2 weeks in Tuscany
        in October and are very much looking forward to eating our weight in pasta. We'd strongly prefer not to have to keep track of 
        checks or cash during the wedding festivities, so we'd prefer you  <a href='/gifts'>give through our paypal registry</a> or a check via mail (9 Seventh St, Cambridge MA 02141).</p>
      
      <p>But again, your presence is the present! We really really mean it.</p>

      <h4>Can I bring a plus 1 (adult or child)?</h4>
      <p>Our wedding is 21+, so sadly we cannot accommodate your little ones, though we love them. The names of each person invited can
        be found associated with your party code.
      </p>
    </div>
  );
}

export default FAQ;
