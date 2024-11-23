export class AccountDetail {
    constructor(
      public AccountID: number,
      public Username: string,
      public Password: string, // Added Password field
      public AccountType: string,
      public FullName: string,
      public BirthDay: Date,
      public Sex: string,
      public Email: string | null,
      public PhoneNumber: string | null
    ) {}
  }
  