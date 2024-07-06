// pages/api/search.js

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req = NextApiRequest, res = NextApiResponse) {
  const { query } = req.query; // Extract query parameter from request

  const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/search?query=${encodeURIComponent(query)}`;

  const data = await fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
       return data
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });

  res.status(200).json(data);

}