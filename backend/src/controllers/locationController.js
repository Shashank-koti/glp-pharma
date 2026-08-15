import ResponseFormatter from '../utils/ResponseFormatter.js';
import axios from 'axios';

// @desc    Get user location/country based on IP
// @route   GET /api/location
// @access  Public
export const getUserLocation = async (req, res, next) => {
  try {
    // Check for Vercel/Cloudflare geolocation headers first
    let country = req.headers['x-vercel-ip-country'] || req.headers['cf-ipcountry'];

    if (country) {
      return ResponseFormatter.success(res, { country }, 'Location fetched successfully', 200);
    }

    // Fallback: Use external IP API if headers are missing (e.g., local dev or other hosting)
    let ip = req.ip || req.connection.remoteAddress;

    // Clean up IPv6 loopback for local testing
    if (ip === '::1' || ip === '127.0.0.1') {
      // Defaulting to 'US' for local development so it doesn't hide the section.
      // Change to 'IN' temporarily if you want to test the hiding functionality locally!
      return ResponseFormatter.success(res, { country: 'IN', ip }, 'Location fetched successfully (Local Mock)', 200);
    }

    // Try fetching from public API
    try {
      const response = await axios.get(`http://ip-api.com/json/${ip}`);
      if (response.data && response.data.countryCode) {
        country = response.data.countryCode;
      } else {
        country = 'UNKNOWN';
      }
    } catch (err) {
      console.error('Error fetching IP location from external API:', err.message);
      country = 'UNKNOWN';
    }

    return ResponseFormatter.success(res, { country, ip }, 'Location fetched successfully', 200);
  } catch (error) {
    next(error);
  }
};
