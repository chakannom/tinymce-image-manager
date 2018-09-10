import * as crypto from 'crypto';
import { Buffer } from 'buffer';

const createImgproxySignatureUrl = function (
    resizing_type: string,
    width: number,
    height: number,
    gravity: string,
    enlarge: number,
    non_encoding_url: string,
    extension: string,
    settings: any
) {
    console.log(crypto);
    const urlSafeBase64 = string =>
        new Buffer(string)
            .toString('base64')
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
    const hexDecode = hex => Buffer.from(hex, 'hex');

    const encoded_url = urlSafeBase64(non_encoding_url);
    const path = `/${resizing_type}/${width}/${height}/${gravity}/${enlarge}/${encoded_url}.${extension}`;

    const hmac = crypto.createHmac('sha256', hexDecode(settings.key));
    hmac.update(hexDecode(settings.salt));
    hmac.update(path);

    const signature = urlSafeBase64(hmac.digest());

    return `${settings.url}/${signature}${path}`;
};

export default {
    createImgproxySignatureUrl
}