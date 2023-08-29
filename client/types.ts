export type UserFromDB = {
  id: number,
  account_number: string,
  account_status: string,
  credit_score: string,
  date_created: string,
  email_address: string,
  first_name: string,
  last_name: string,
  phone_number: string,
  security_pin: string,
  verified: boolean,
};

export type User = {
  id: number,
  accountNumber: string,
  accountStatus: string,
  creditScore: string,
  dateCreated: string,
  emailAddress: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
  securityPin: string,
  verified: boolean,
};

/*
export type LoanPlanFromDB = {

};

export type LoanPlan = {

}

export type LoanFromDB = {

}

export type Loan = {

}
*/
