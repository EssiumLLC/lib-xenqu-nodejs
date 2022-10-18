import {encode} from 'json-web-token';


export function signJwt(secret: string, payload: any): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    encode(secret, payload, 'RS256', (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
}
