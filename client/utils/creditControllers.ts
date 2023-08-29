import axios from 'axios';
import { BASE_URL } from '@constants/index';

export const getAssetsForUser = async (accountId: string | number | undefined) => {
  if (accountId) {
    const id = Number(accountId);
    const { data } = await axios.get(`${BASE_URL}/get-assets-by-account/${id}`);
    // eslint-disable-next-line no-console
    console.log('Assets for account id', data);
    if (data?.length > 0) {
      return data;
    }
    return [];
  }
  return [];
};

// for profile display
export const getCurrentJob = async (accountId?: string | number) => {
  if (accountId) {
    const id = Number(accountId);
    const { data } /*: { data: LoanFromDB } */ = await axios.get(`${BASE_URL}/get-current-job/${id}`);
    // eslint-disable-next-line no-console
    console.log('Current job', data);
    if (data?.length > 0) {
      return data;
    }
    return [];
  }
  return [];
};

export const getUsersTotalAssetsWorth = async (accountId?: string | number) => {
  if (accountId) {
    const id = Number(accountId);
    const { data } /*: { data: LoanFromDB } */ = await axios.get(`${BASE_URL}/get-assets-by-account/${id}`);
    // eslint-disable-next-line no-console
    console.log('\n All assets \n', data);
    if (data?.length > 0) {
      return data?.reduce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (acc: any, asst: any) => acc + Number(asst?.worth),
        0,
      );
    }
    return [];
  }
  return [];
};

// this will be removed in favour of a getCreditScore that uses assets and salary all on the backend
// only to be called when job is updated or new asset is added
export const updateCreditScore = async (
  id: number | number,
  score: number | string,
) => {
  const accountId = Number(id);
  const creditScore = Number(score);

  const { data } = await axios.post(`${BASE_URL}/update-credit-score`, {
    params: {
      creditScore,
      accountId,
    },
  });

  if (data?.length > 0) {
    // eslint-disable-next-line no-console
    console.log('Credit Score Updated');
    return data;
  }

  return [];

  // check in documents to know if document has been added before
  // add document
  // add job or asset
  // update document in table with asset or job
  // update users creditScore
};
