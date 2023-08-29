import { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import { useAssets } from 'expo-asset';
import { router } from 'expo-router';
import { useAuth } from '@context/auth';
import StyledButton from '@components/StyledButton';
import { ScrollView } from 'react-native-gesture-handler';
import RNSpeedometer from 'react-native-speedometer';
import RepaymentPopup from '@containers/RepaymentPopup';
import { addLoan, getLoansForCreditScore, getIncompleteLoans } from '@utils/loans';
import { getAssetsForUser } from '@utils/creditControllers';
import calculateInstallmentPayment from '@utils/calculateInstallmentPayment';
import calculateNextPaymentDueDate from '@utils/calculateRepaymentDueDate';
import { CREDIT_SCORE_LABELS, DATE_OPTIONS_SHORT } from '@constants/index';
// import pushNotify from '@utils/notifications/pushNotifications';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: '8%',
    backgroundColor: '#F5F5F5',
    color: '#6C6B6B',
    marginTop: 140,
    paddingTop: 20,
    paddingBottom: 30,
  },
  loanItemValue: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    color: '#585757',
  },
});

export default function TabOneScreen() {
  const { user } = useAuth();
  /* const loansHardCode = [
    {
      amount_taken: 50000,
      amount_paid: 10000,
      date_created: new Date().toISOString(),
      loan_status: 'defaulting',
      account_id: user?.id,
      loan_plan_id: 3,
      due_time: '19 Aug 2023',
    },
    {
      amount_taken: 30000,
      amount_paid: 25000,
      date_created: new Date().toISOString(),
      loan_status: 'ongoing',
      account_id: user?.id,
      loan_plan_id: 3,
      due_time: '12 Sept 2023',
    },
  ]; */

  const userAssetsHardCoded = [
    {
      id: user?.id,
      accountId: user?.accountNumber,
      worth: 120000,
      vetted: true,
    },
    {
      id: user?.id,
      accountId: user?.accountNumber,
      worth: 50000,
      vetted: true,
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [incompleteLoans, setIncompleteLoans] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [plansForCreditScore, setLoansForCreditScore] = useState<any[]>([]); // <LoanFromDB> */([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userAssets, setUserAssets] = useState<any[]>([]);

  // eslint-disable-next-line global-require
  const [card, error] = useAssets([require('assets/images/card.png')]);
  // eslint-disable-next-line no-console
  if (error) console.log('Error loading image');

  const [openPaymentModal, setOpenPaymentModal] = useState(false);

  const [openLoanToRepay, setOpenLoanToRepay] = useState<number | null>(null);

  const resetOpenPaymentModal = () => {
    setOpenPaymentModal(false);
    if (openLoanToRepay === 0 || openLoanToRepay === 1) {
      const loansDisplayed = (
        incompleteLoans?.length === 2
          ? incompleteLoans.splice(openLoanToRepay, 1)
          : []
      );
      setOpenLoanToRepay(null);
      setIncompleteLoans([...loansDisplayed]);
    }
  };

  const getIncompleteLoansByAccount = async () => {
    const incompleteLoansByAcc = await getIncompleteLoans(user?.id);
    if (incompleteLoans?.length < 2) {
      const loansToDisplay = incompleteLoansByAcc; /* (incompleteLoansByAcc?.length > 0
        ? incompleteLoansByAcc
        : loansHardCode
      ); */
      setIncompleteLoans([...loansToDisplay]);
    }
  };

  const getUserAssets = async () => {
    const userAssetsFromDB = await getAssetsForUser(user?.id);
    const assetsToUse = userAssetsFromDB?.length > 0 ? userAssetsFromDB : userAssetsHardCoded;
    setUserAssets([...assetsToUse]);
  };

  const getLoansForScore = async () => {
    const loanPlans = await getLoansForCreditScore(user?.creditScore);
    setLoansForCreditScore([...loanPlans]);
  };

  const handleAddLoan = async (loanId: number) => {
    if (incompleteLoans?.length < 2) {
      const totalIncompleteLoansBalance = incompleteLoans?.reduce(
        (acc, loan) => acc + (loan.amount_taken - loan.amount_paid),
        0,
      );
      const totalAssetsWorth = userAssets?.reduce(
        (acc, asset) => Number(acc) + (Number(asset.worth) + Number(asset.worth)),
        0,
      );

      // if ongoing loans remaining balance and loan being requested amount <= than declared assets
      // then allow user request loan
      if (
        (Number(plansForCreditScore[loanId].total_amount) + totalIncompleteLoansBalance)
        <= totalAssetsWorth
      ) {
        const addedLoan = await addLoan(
          plansForCreditScore[loanId].total_amount,
          plansForCreditScore[loanId].id,
          user?.id,
        );
        // console.log('HEYYY', addedLoan);
        if (addedLoan?.length > 0) {
          // console.log('INCOMPLETE LOANS HERE', incompleteLoans);
          getIncompleteLoansByAccount();
          // console.log('\nINCOMPLETE LOANS THERE', incompleteLoans);
          ToastAndroid.showWithGravity(
            'Loan Request Successful',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
        }
      } else {
        ToastAndroid.showWithGravity(
          'Don\'t have enough assets to get loan, please add assets in profile',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
    } else {
      ToastAndroid.showWithGravity(
        'Cannot have more than 2 loans incomplete',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
  };

  useEffect(() => {
    if (user?.creditScore) getLoansForScore();
  }, [user?.creditScore]);

  useEffect(() => {
    if (user?.accountNumber && user?.id) {
      getIncompleteLoansByAccount();
      getUserAssets();
    }
  }, [user?.accountNumber, user?.id]);

  return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View>
            {card?.[0] ? <Image source={card?.[0] as ImageSourcePropType} style={{ width: '100%', height: 183, borderRadius: 10 }} /> : null}
            <View style={{
              position: 'absolute',
              marginHorizontal: 15,
              height: 183,
              width: '100%',
            }}>
              <View style={{ position: 'relative', top: 20 }}>
                <Text style={{ color: 'white', fontSize: 28, fontWeight: '500' }}>
                  NGN{'\u00A0'}
                  {incompleteLoans?.reduce(
                    (acc, loan) => acc + (loan.amount_taken - loan.amount_paid),
                    0,
                  )}
                </Text>
                <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>Loan balance</Text>
              </View>
              <View style={{ position: 'relative', top: 65, left: '50%' }}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ color: 'white', fontSize: 14 }}>Credit Score: </Text>
                  <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>{Math.ceil(Number(user?.creditScore))}/100</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ color: 'white', fontSize: 14 }}>User ID: </Text>
                  <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>{user?.accountNumber}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Incomplete loans */}
          <View style={{
            marginTop: 25,
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}>
            {incompleteLoans.map((loan, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  setOpenLoanToRepay(i);
                  setOpenPaymentModal(true);
                }}
                style={{
                  justifyContent: 'space-around',
                  flexBasis: '48%',
                  backgroundColor: loan.loan_status === 'defaulting' ? '#FFEEEE' : '#FFFFFF',
                  borderColor: '#FFEEEE',
                  borderWidth: 2,
                  shadowColor: 'black',
                  shadowOpacity: 1,
                  padding: 20,
                  borderRadius: 10,
                  height: 154,
                }}
              >
                <Text style={{
                  color: '#626161',
                  fontSize: 12,
                  fontStyle: 'italic',
                  lineHeight: 18,
                }}>
                  {loan.loan_status} loan
                </Text>
                <Text style={{ color: '#6C6B6B' }}>NGN {loan.amount_taken}</Text>
                <View>
                  <Text style={{ color: '#807F7F' }}>balance:</Text>
                  <Text style={{ color: '#6C6B6B', fontWeight: '500' }}>NGN {loan.amount_taken - loan.amount_paid}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                  <Text style={{ fontSize: 14, color: '#807F7F' }}>due: </Text>
                  <Text style={{ fontSize: 14, fontWeight: '500', color: loan.loan_status === 'defaulting' ? '#FF3D00' : '#807F7F' }}>
                    {new Intl.DateTimeFormat('en-GB', DATE_OPTIONS_SHORT).format(calculateNextPaymentDueDate(loan?.date_created, 'quarterly'))}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ marginTop: incompleteLoans?.length > 0 ? 30 : 6, alignItems: 'center' }}>
            {/* eslint-disable-next-line object-curly-newline */}
            <Text style={{ fontSize: 20, lineHeight: 30, color: '#6C6B6B', fontWeight: '500' }}>Your credit score</Text>
             {/* eslint-disable-next-line object-curly-newline */}
              <Text style={{ fontSize: 12, lineHeight: 30, color: '#807F7F', marginBottom: 20 }}>Based on your verified documents, here’s your credit score</Text>
              <RNSpeedometer
                value={Math.ceil(Number(user?.creditScore))}
                size={270}
                labels={CREDIT_SCORE_LABELS}
              />
              <View style={{ marginTop: 60 }}></View>
              <StyledButton bgColor='#845FA8' text='Learn More' method={() => router.push('/modal')} />
              <Text style={{ fontStyle: 'italic', color: '#626161' }}>Upload credentials to increase credit score</Text>
          </View>

          {plansForCreditScore.length
            ? <View style={{ alignItems: 'center', marginTop: 60 }}>
              {/* eslint-disable-next-line object-curly-newline */}
              <Text style={{ fontSize: 20, lineHeight: 30, color: '#6C6B6B', fontWeight: '500' }}>Best Loan Offers</Text>
              {/* eslint-disable-next-line object-curly-newline */}
              <Text style={{ fontSize: 12, lineHeight: 30, color: '#807F7F', marginBottom: 25 }}>Based on your credit score, here are the best loan offers.</Text>

              {/* Loan Plans for Credit Score */}
              {plansForCreditScore?.map((loanPlan, i) => (
                <View
                  key={i}
                  style={{
                    backgroundColor: '#FFFFFF',
                    minWidth: '100%',
                    height: 260,
                    marginBottom: 20,
                    borderRadius: 10,
                    paddingHorizontal: 20,
                    paddingVertical: 25,
                    flexDirection: 'column',
                  }}
                >
                  <View style={{ position: 'absolute', right: 20, borderRadius: 10 }}>
                    <StyledButton text='GET'width={50} height={25} borderRadius={5} method={() => handleAddLoan(i)} disabled={incompleteLoans?.length >= 2} />
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <View>
                      <Text style={styles.loanItemValue}>{loanPlan?.name}</Text>
                      <Text style={{ color: '#807F7F' }}>Cash loan</Text>
                    </View>
                    <Text style={{ color: '#845FA8', fontWeight: '500' }}>Borowise©</Text>
                  </View>
                  <View
                    style={{
                      marginVertical: 8,
                      borderBottomColor: '#626161',
                      borderBottomWidth: StyleSheet.hairlineWidth,
                    }}
                  />
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                    }}
                  >
                    <View style={{ flexBasis: '50%', height: 60 }}>
                      <Text style={{ color: '#807F7F' }}>Amount</Text>
                      <Text style={styles.loanItemValue}>N {loanPlan?.total_amount}</Text>
                    </View>

                    <View style={{ flexBasis: '50%', alignItems: 'flex-end', height: 60 }}>
                      <Text style={{ color: '#807F7F' }}>Period</Text>
                      <Text style={styles.loanItemValue}>{loanPlan?.duration}</Text>
                    </View>

                    <View style={{ flexBasis: '50%', height: 60 }}>
                      <Text style={{ color: '#807F7F' }}>Interest Rate</Text>
                      <Text style={styles.loanItemValue}>{loanPlan?.interest_rate}%</Text>
                    </View>

                    <View style={{ flexBasis: '50%', alignItems: 'flex-end', height: 60 }}>
                      <Text style={{ color: '#807F7F' }}>Instalment</Text>
                      <Text style={styles.loanItemValue}>{loanPlan?.instalment_type}</Text>
                    </View>
                  </View>
                  <Text style={{ color: '#807F7F', textAlign: 'center' }}>
                    You Pay{'\u00A0'}
                    NGN {calculateInstallmentPayment(loanPlan?.total_amount, loanPlan?.interest_rate, 1, loanPlan?.instalment_type)}{'\u00A0'}
                    {loanPlan.instalment_type}
                  </Text>
                </View>
              ))}
            </View>
            : null}
          {openPaymentModal
            ? (<RepaymentPopup open={openPaymentModal} reset={resetOpenPaymentModal} />)
            : null}
        </ScrollView>
      </View>
  );
}
