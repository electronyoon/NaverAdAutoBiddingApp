import CryptoJS from 'crypto-js';

class Signatures {
    static of(timestamp, method, resource, key) {
        return Signatures.ofData(`${timestamp}.${method}.${resource}`, key);
    }

    static ofData(data, key) {
        try {
            const hash = CryptoJS.HmacSHA256(data, key);
            return CryptoJS.enc.Base64.stringify(hash);
        } catch (error) {
            throw new Error('Failed to generate signature.');
        }
    }
}

export default Signatures;

