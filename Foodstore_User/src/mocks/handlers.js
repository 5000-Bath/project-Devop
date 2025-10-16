// handlers.js
import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock order 1
  http.get('/api/orders/1', () => {
    return HttpResponse.json({
      id: 1,
      status: 'PENDING',
      orderItems: [
        {
          id: 101,
          product: {
            name: 'Test Item 1',
            price: 100,
            imageUrl: '/img1.jpg',
          },
          quantity: 1,
        },
      ],
      createdAt: new Date().toISOString(),
    });
  }),

  // Mock order 2
  http.get('/api/orders/2', () => {
    return HttpResponse.json({
      id: 2,
      status: 'COMPLETED',
      orderItems: [
        {
          id: 102,
          product: {
            name: 'Test Item 2',
            price: 200,
            imageUrl: '/img2.jpg',
          },
          quantity: 2,
        },
      ],
      createdAt: new Date().toISOString(),
    });
  }),

  // Mock for a "Not Found" response
  http.get('/api/orders/999', () => {
    return new HttpResponse(null, {
      status: 404,
      statusText: 'Not Found',
    });
  }),
];