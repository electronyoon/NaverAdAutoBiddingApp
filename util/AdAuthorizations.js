import axios from 'axios';

class AdAuthorizations {

  static URL = 'https://searchad.naver.com/auth/local/naver-cookie';

  static async token() {
    try {
      const response = await axios.post(this.URL, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'NID_AUT=Sw4WLLP3SQviPmUq4yh9ZLsMgZWcPzBuyAMLe65ABA3OYqMhWHIuAh5uBfqGLMc/; NID_SES=AAABg3tb+97yjsVpxhGaqttsqk+dJKYQm0YQ7dA2YMifZp/ZaDAvhVcg3RozfxJTk2cjX4riPZVy7qqB63O3WT0RyFUdAjdHhP+QmwEoXTh3stUbPylVtIaEQfHr9nRgJnnjf2ssi04Tib9PjUJgMZxfNh6+QYl+tQ2fgma75af6Ga2N/3pqK66s5laoM2niOe7gPIgT+7yp4cBD5zzsn88dynzpSxS5RleZnsQpYDfvRjTHcQgP1QWtMCCPSx9xqPopo0mwr+Ro8sVrBPjzxPZylGMTEoNvm+Maeqjdh+1iLLVCRwFwm9y2ypqsCKqC+3w+uuN7Bs28X9BqutgDGB6UNQ37b244MO0O8aQT+lFhrCgRPiLFlveDc1cGQn7DAU2okwrdZoRhWaeHdGWn3FDyiyyMMQMuadI2lMo5U9A+9T8xsEwbgirZD9Dpuk9GlRykZxsBySpzHpOsMgUkk49ulS4++0uHdlqbciNionGmmcNdfhQUhAyelweleKhDKhQg9CtrkFiWhpZTHJykU0Bn138=;'
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