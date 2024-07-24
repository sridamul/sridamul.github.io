import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Prompt: React.FC = () => {
  const [ipDetails, setIpDetails] = useState<{ ip: string; city: string; country: string } | null>(null);

  useEffect(() => {
    const fetchIpDetails = async () => {
      try {
        const response = await axios.get('https://ipapi.co/json/');
        setIpDetails({
          ip: response.data.ip,
          city: response.data.city,
          country: response.data.country_name
        });
      } catch (error) {
        console.error('Error fetching IP details:', error);
      }
    };

    fetchIpDetails();
  }, []);

  return (
    <span className="terminal-prompt">
      {ipDetails 
        ? `[${ipDetails.ip} - ${ipDetails.city}, ${ipDetails.country}]@sridamul.me > ` 
        : '[Unknown User]@sridamul.me > '}
    </span>
  );
};

export default Prompt;
