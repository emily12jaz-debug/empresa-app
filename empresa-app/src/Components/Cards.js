import React from 'react';
import Card from './Card';

import silla1 from '../Assets/Images/silla1.png';
import silla2 from '../Assets/Images/silla2.jpg';
import silla3 from '../Assets/Images/silla3.jpg';

const butacas = [
  {
    id: 1,
    title: 'Butac Ergo. 1',
    image: silla1,
    price: '$1000'
  },
  {
    id: 2,
    title: 'Butac Ergo. 2',
    image: silla2,
    price: '$2000'
  },
  {
    id: 3,
    title: 'Butac Ergo. 3',
    image: silla3,
    price: '$3000'
  }
];

export default function Cards() {
  return (
    <div className="container my-4">
      <div className="row g-4 justify-content-center">
        {butacas.map((item) => (
          <div className="col-12 col-md-4" key={item.id}>
            <Card
              title={item.title}
              image={item.image}
              price={item.price}
            />
          </div>
        ))}
      </div>
    </div>
  );
}