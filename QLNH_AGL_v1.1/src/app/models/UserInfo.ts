export class UserInfo {
    constructor(
        public UserInfoID: number,
        public AccountID: number | null,
        public FullName: string,
        public BirthDay: Date,
        public Sex: number,
        public Email: string | null,
        public PhoneNumber: string | null
    ) { }
}
