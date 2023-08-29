import { User, UserFromDB } from 'types';

const makeUserDBToUser = (userFromDb: UserFromDB) => {
  const user: User = {
    id: userFromDb?.id,
    firstName: userFromDb?.first_name,
    lastName: userFromDb?.last_name,
    emailAddress: userFromDb?.email_address,
    verified: userFromDb?.verified,
    accountNumber: userFromDb?.account_number,
    accountStatus: userFromDb?.account_status,
    phoneNumber: userFromDb?.phone_number,
    securityPin: userFromDb?.security_pin,
    creditScore: userFromDb?.credit_score,
    dateCreated: userFromDb?.date_created,
  };

  return user;
};

export default makeUserDBToUser;
