import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageSourcePropType,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useAssets } from 'expo-asset';

import { useAuth } from '@context/auth';
import RNSpeedometer from 'react-native-speedometer';
import StyledButton from '@components/StyledButton';
// import TabContainer from '@containers/TabContainer';

import { CREDIT_SCORE_LABELS } from '@constants/index';
import { getCurrentJob, getUsersTotalAssetsWorth, updateCreditScore } from '@utils/creditControllers';
import JobForm from '@containers/JobForm';
import AssetForm from '@containers/AssetForm';
import VerificationModal from '@containers/VerififcationModal';
import calculateCreditScore from '@utils/calculateCreditScore';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 30,
    marginHorizontal: '8%',
    backgroundColor: '#F5F5F5',
    color: '#6C6B6B',
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default function ModalScreen() {
  const { user, updateUserCreditScore } = useAuth();

  const [activeTab, setActiveTab] = useState(0);

  // eslint-disable-next-line global-require
  const [avatar, error] = useAssets([require('assets/images/avatar.png')]);
  // eslint-disable-next-line no-console
  if (error) console.log('Error loading avatar');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [job, setCurrentJob] = useState('');

  const [jobIsVerified, setIsJobVerified] = useState(false);
  const [isAssetVerified, setIsAssetVerified] = useState(false);

  const [openVerificationModal, setOpenVerificationModal] = useState(false);

  const [newJob, setNewJob] = useState('');
  const [newjobSalary, setNewjobSalary] = useState('');
  const [isJobSubmitted, setIsJobSubmitted] = useState(false);

  const [newAsset, setNewAsset] = useState('');
  const [newAssetWorth, setNewAssetWorth] = useState('');
  const [isAssetSubmitted, setIsAssetSubmitted] = useState(false);

  const getCurrentForJobUserDB = async () => {
    const currentJobFromDB = await getCurrentJob(user?.id);
    setCurrentJob(currentJobFromDB?.[0]?.job_type || 'other');
  };

  useEffect(() => {
    getCurrentForJobUserDB();
  }, []);

  const handleCreditScoreUpdate = async () => {
    if (isAssetSubmitted || isJobSubmitted) {
      // update credit score with all user's assets and current job salary
      const totalAssetsWorth = await getUsersTotalAssetsWorth(user?.id);
      const creditScore = calculateCreditScore(Number(newjobSalary), Number(totalAssetsWorth));
      const updatedScore = await updateCreditScore(Number(user?.id), creditScore);
      if (updatedScore?.length > 0) updateUserCreditScore(creditScore);
      setIsAssetSubmitted(false);
      setIsJobSubmitted(false);
    }
  };

  useEffect(() => {
    if (isAssetSubmitted || isJobSubmitted) {
      handleCreditScoreUpdate();
      getCurrentForJobUserDB();
      setIsJobSubmitted(false);
      setIsAssetSubmitted(false);
    }
  }, [isAssetSubmitted, isJobSubmitted]);

  const handleJobVerification = () => {
    const salaryValue = parseFloat(newjobSalary);
    if (
      activeTab === 0
      && newJob
      && (!Number.isNaN(salaryValue) && salaryValue <= 10000000 && salaryValue >= 120000)
    ) {
      setOpenVerificationModal(true);
    }
  };

  const handleAssetVerification = () => {
    const worth = parseFloat(newAssetWorth);
    if (
      activeTab === 1
      && newAsset
      && (!Number.isNaN(worth) && worth <= 10000000 && worth >= 120000)
    ) {
      setOpenVerificationModal(true);
    }
  };

  const handleTabChange = (tabIndex: number) => {
    setActiveTab(tabIndex);
  };

  useEffect(() => {
    if (isAssetVerified || jobIsVerified) setOpenVerificationModal(false);
  }, [jobIsVerified, isAssetVerified]);

  return (
    <>
    {openVerificationModal
      ? <VerificationModal aim={activeTab === 0 ? 'Job' : 'Asset'} accountId={user?.id || 0} setJobVerified={setIsJobVerified} setAssetVerified={setIsAssetVerified} />
      : <View style={styles.container}>
      <StatusBar style={'dark'} />
      <ScrollView>
        <View style={{ alignItems: 'center' }}>
          <Image
            source={avatar?.[0] as ImageSourcePropType}
              style={{ width: 100, height: 100 }}
            />

         {/* eslint-disable-next-line object-curly-newline */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, width: 250 }}>
            <Text style={{ fontSize: 16, color: '#6C6B6B', flexBasis: '40%' }}>Username: </Text>
            <Text style={{ fontSize: 14, fontWeight: '500' }}>{user?.firstName} {user?.lastName}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 250 }}>
            <Text style={{ fontSize: 16, color: '#6C6B6B', flexBasis: '50%' }}>Current Job: </Text>
            <Text style={{ fontSize: 14, fontWeight: '500' }}>{job?.charAt(0).toUpperCase()}{job?.slice(1)?.replace(/_/g, ' ')}</Text>
          </View>
          {/* eslint-disable-next-line object-curly-newline */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 250, marginBottom: 20 }}>
            <Text style={{ fontSize: 16, color: '#6C6B6B', flexBasis: '50%' }}>Credit Score: </Text>
            <Text style={{ fontSize: 14, fontWeight: '500' }}>{Math.ceil(Number(user?.creditScore))}/100</Text>
          </View>
        </View>

        <View style={{ flex: 1, marginTop: 20, alignItems: 'center' }}>
          <View style={{
            marginTop: 5,
            marginBottom: 10,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            backgroundColor: '#D9C3EE',
            borderRadius: 50,
            height: 50,
            width: '80%',
          }}>
            {[0, 1].map((_, i) => (
              <TouchableOpacity onPress={() => handleTabChange(i)} key={i} style={{
                borderRadius: 50, backgroundColor: 'white', flexBasis: '40%', height: 32, justifyContent: 'center',
              }}>
                <Text style={{ color: activeTab === i ? '#845FA8' : '#D9C3EE', fontSize: 16, textAlign: 'center' }}>{i === 0 ? 'Job' : 'Asset'}</Text>
              </TouchableOpacity>
            ))
            }
          </View>
        </View>

        <View style={{
          marginTop: 20, marginBottom: 30, alignItems: 'center', justifyContent: 'center',
        }}>
          {/* eslint-disable-next-line object-curly-newline */}
          <Text style={{ fontSize: 20, lineHeight: 30, color: '#6C6B6B', fontWeight: '500' }}>Improve Credit Score</Text>
          {/* eslint-disable-next-line object-curly-newline */}
          <Text style={{ fontSize: 12, lineHeight: 30, color: '#807F7F', marginBottom: 25 }}>Add new job or asset to improve credit score</Text>
          <RNSpeedometer
            value={Math.ceil(Number(user?.creditScore))}
            size={270}
            labels={CREDIT_SCORE_LABELS}
          />

          {/* TAB HERE */}
          <View style={{ flex: 1, marginTop: 80, alignItems: 'center' }}>
            <View style={{ marginHorizontal: '5%' }}>
              <>
                {activeTab === 0
                  ? <JobForm
                    accountId={user?.id || 0}
                    jobVerified={jobIsVerified}
                    setJobType={setNewJob}
                    setSalaryValue={setNewjobSalary}
                    submissionPending=''
                    setIsJobSubmitted={setIsJobSubmitted}
                    newJob={newJob}
                    newjobSalary={newjobSalary}
                  />
                  : <AssetForm
                    accountId={user?.id || 0}
                    assetVerified={isAssetVerified}
                    setAssetType={setNewAsset}
                    setAssetWorthValue={setNewAssetWorth}
                    submissionPending=''
                    setIsAssetSubmitted={setIsAssetSubmitted}
                    newAsset={newAsset}
                    newAssetWorth={newAssetWorth}
                  />
                }
              </>
            </View>
          </View>
          <StyledButton text={activeTab === 0 ? 'Add Job' : 'Add Asset'} method={() => (activeTab === 0 ? handleJobVerification() : handleAssetVerification())} />
        </View>
      </ScrollView>
    </View>
    }
    </>
  );
}
