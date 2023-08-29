import axios from 'axios';
import { BASE_URL } from '@constants/index';

export const getLoansForCreditScore = async (
  creditScore: string | number | undefined,
) => {
  if (creditScore) {
    const minCreditScore = Number(creditScore);
    // eslint-disable-next-line no-console
    console.log(`${BASE_URL}/get-loan-plans-by-credit/${minCreditScore}`);
    const { data } = await axios.get(`${BASE_URL}/get-loan-plans-by-credit/${minCreditScore}`);
    if (data?.length > 0) {
      return data;
    }
    return [];
  }
  return [];
};

export const getIncompleteLoans = async (
  accountId: number | undefined,
) => {
  if (accountId) {
    const id = Number(accountId);
    const { data } = await axios.get(`${BASE_URL}/get-incomplete-loans-by-account/${id}`);
    // eslint-disable-next-line no-console
    console.log('Incomplete loans', data);
    if (data?.length > 0) {
      return data;
    }
    return [];
  }
  return [];
};

export const addLoan = async (
  amountTaken: number | string | undefined,
  loanPlanId: number | undefined,
  accountId: number | undefined,
) => {
  if (amountTaken && loanPlanId && accountId) {
    const { data } = await axios.post(`${BASE_URL}/add-loan`, {
      params: {
        amountTaken: Number(amountTaken),
        loanPlanId,
        accountId,
      },
    });

    if (data?.length > 0) return data;
    return [];
  }
  return [];
};
