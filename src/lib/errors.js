export class AccountDisabledError extends Error {
  constructor(message) {
    super(message); // (1)
    this.name = "AccountDisabledError"; // (2)
  }
}

export class AuthenticatinError extends Error {
  constructor(message) {
    super(message); // (1)
    this.name = "AuthenticatinError"; // (2)
  }
}

export class FetchError extends Error {
  constructor(message) {
    super(message); // (1)
    this.name = "FetchError"; // (2)
  }
}
