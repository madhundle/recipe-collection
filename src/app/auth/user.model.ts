export class User {
  constructor(public email: string, 
              public id: string, 
              private _token: string,
              private _tokenExpiryDate: Date) {}

  get token() {
    // Check if the token does not have an expiration or is expired
    // If it is invalid, return null
    if (!this._tokenExpiryDate || new Date() > this._tokenExpiryDate) {
      return null;
    }
    // If the token if valid, return it
    return this._token;
  }
}