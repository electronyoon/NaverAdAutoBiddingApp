import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

class AdAuthorizations {

  static URL = process.env.COOKIE_URL;

  static async token() {
    try {
      const response = await axios.post(this.URL, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Cookie': process.env.COOKIE
        }
      })
      return response.data.token;
    } catch (error) {
      console.error('Error:', error);
      return -1;
    }
  }
  
}

export default AdAuthorizations;