import React, { ReactElement, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useSegments } from 'expo-router';
import axios from 'axios';

import { BASE_URL } from '@constants/index';
import calculateCreditScore from '@utils/calculateCreditScore';
import makeUserDBToUser from '@utils/makeUserDBToUser';
import { User, UserFromDB } from 'types';

interface AuthContextType {
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    nin: string,
    phoneNumber: string,
    securityPin: string,
    job: string,
    salaryValue: number
  ) => Promise<{ id: number }[]>;
  addJob: (
    accountId: number,
    jobType: string,
    yearlySalary: number,
    vetted: boolean,
  ) => Promise<unknown[]>;
  addAsset: (
    accountId: number,
    assetType: string,
    worth: number,
    vetted: boolean,
  ) => Promise<unknown[]>,
  verifyAccount: (accountId: number) => Promise<unknown[]>;
  updateUserCreditScore: (updatedScore: number | string) => void;
  signIn: (email: string, password: string) => Promise<UserFromDB[]>;
  signOut: () => void;
  user: User | null | undefined;
}

const AuthContext = React.createContext<AuthContextType>(
  {
    signUp: async () => [],
    signIn: async () => [],
    verifyAccount: async () => [],
    addJob: async () => [],
    addAsset: async () => [],
    signOut: () => {},
    updateUserCreditScore: async () => {},
    user: null,
  },
);

// This hook can be used to access the user info.
export function useAuth() {
  return React.useContext(AuthContext);
}

// This hook will protect the route access based on user authentication.
function useProtectedRoute(user: User | null | undefined) {
  const segments = useSegments();
  React.useEffect(() => {
    AsyncStorage.getItem('borowise-signed-up')
      .then((isSignedUp) => {
        AsyncStorage.getItem('borowise-signed-in')
          .then((isSignedIn) => {
            const inAuthGroup = segments[0] === '(auth)';

            if (!user && !inAuthGroup && isSignedUp !== 'signed-up') {
              // Redirect to the sign-up page.
              router.replace('/sign-up');
            } else if (!user && !inAuthGroup && isSignedIn !== 'signed-in') {
              // Redirect to the sign-in page.
              router.replace('/sign-in');
            } else if (user && inAuthGroup && isSignedUp === 'signed-in') {
              // Redirect away from the sign-in page
              router.replace('/');
            }
          });
      });
  }, [user, segments]);
}

export function AuthProvider(props: { children: ReactElement }) {
  const [user, setAuth] = useState<null | undefined | User>();

  useEffect(() => {
    AsyncStorage.getItem('borowise-user').then((userCache) => {
      console.log('\nUSER CACHE', userCache);
      if (userCache) setAuth(JSON.parse(userCache));
    });
  }, []);

  useProtectedRoute(user);

  async function signIn(email: string, password: string, fromSignUp?: boolean) {
    // eslint-disable-next-line no-console
    console.log('Signing in...');
    // eslint-disable-next-line no-console
    console.log(`${BASE_URL}/sign-in`);

    const { data }: { data: UserFromDB[] } = await axios.post(`${BASE_URL}/sign-in`, {
      params: {
        email,
        password,
      },
    });

    if (data?.length > 0) {
      setAuth(makeUserDBToUser(data?.[0]));
      await AsyncStorage.setItem('borowise-signed-in', 'signed-in');
      await AsyncStorage.setItem('borowise-user', JSON.stringify(makeUserDBToUser(data?.[0])));
      if (!fromSignUp) router.push('/');
      // eslint-disable-next-line no-console
      console.log('User signed in.');
      return data;
    }
    return [];
  }

  async function signUp(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    nin: string,
    phoneNumber: string,
    securityPin: string,
    job: string,
    salaryValue: number,
  ) {
    // eslint-disable-next-line no-console
    console.log('Signing up...');

    // eslint-disable-next-line no-console
    console.log(`${BASE_URL}/sign-up`);

    const accountNumber = Math.ceil(Math.random() * (9999999999 - 1000000000 + 1)) + 1000000000;
    const creditScore = calculateCreditScore(salaryValue, 0);

    const { data } = await axios.post(`${BASE_URL}/sign-up`, {
      params: {
        accountNumber,
        email,
        password,
        firstName,
        lastName,
        nin,
        phoneNumber,
        securityPin,
        creditScore,
      },
    });

    if (data?.length > 0) {
      await AsyncStorage.setItem('borowise-signed-up', 'signed-up');
      // eslint-disable-next-line no-console
      console.log('Signed up');
      await signIn(email, password, true);
      return data;
    }

    return [];
  }

  async function signOut() {
    // eslint-disable-next-line no-console
    console.log('Signing out...');
    // await AsyncStorage.setItem('borowise-signed-in', 'signed-in');
    // await AsyncStorage.removeItem('borowise-signed-up');
    await AsyncStorage.removeItem('borowise-signed-in');
    await AsyncStorage.removeItem('borowise-user');
    setAuth(null);
  }

  async function verifyAccount(accountId: number) {
    // eslint-disable-next-line no-console
    console.log('User is being verified...');
    // eslint-disable-next-line no-console
    console.log(`${BASE_URL}/verify/${accountId}`);

    const { data } = await axios.get(`${BASE_URL}/verify/${accountId}`);

    if (data?.length > 0) {
      // eslint-disable-next-line no-console
      console.log('User verified.');
      await signIn(data?.[0]?.email_address, data?.[0]?.password, true);
      return data;
    }
    return [];
  }

  async function addJob(
    accountId: number,
    jobType: string,
    yearlySalary: number,
    vetted: boolean,
  ) {
    // eslint-disable-next-line no-console
    console.log('Adding Job...', vetted);
    // eslint-disable-next-line no-console
    console.log(`${BASE_URL}/add-job`);

    const { data } = await axios.post(`${BASE_URL}/add-job`, {
      params: {
        accountId,
        jobType,
        yearlySalary,
        vetted,
      },
    });

    if (data?.length > 0) {
      // eslint-disable-next-line no-console
      console.log('\nJob vetted and added\n');
      return data;
    }
    return [];
  }

  async function addAsset(
    accountId: number,
    assetType: string,
    worth: number,
    vetted: boolean,
  ) {
    // eslint-disable-next-line no-console
    console.log('Adding Asset...');
    // eslint-disable-next-line no-console
    console.log(`${BASE_URL}/add-job`);

    const { data } = await axios.post(`${BASE_URL}/add-asset`, {
      params: {
        accountId,
        assetType,
        worth,
        vetted,
      },
    });

    if (data?.length > 0) {
      // eslint-disable-next-line no-console
      console.log('\nAsset vetted and added\n');
      return data;
    }
    return [];
  }

  async function updateUserCreditScore(updatedScore: number | string) {
    if (!Number.isNaN(Number(updatedScore)) && user) {
      setAuth({ ...user, creditScore: updatedScore.toString() });
      await AsyncStorage.setItem('borowise-user', JSON.stringify({ ...user, creditScore: updatedScore.toString() }));
    }
  }

  return (
    <AuthContext.Provider
      value={{
        signUp,
        signIn,
        signOut,
        verifyAccount,
        addJob,
        addAsset,
        user,
        updateUserCreditScore,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
}
