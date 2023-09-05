import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

type TabContent = {
  title: string,
  component: () => React.JSX.Element,
};

const TabContainer = ({
  active,
  setActive,
  tabContent,
}: {
  active: number,
  setActive: (tabIndex: number) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tabContent: TabContent[],
}) => {
  /* const ImproveCreditScoreScreens = [
    {
      title: 'Job',
      component: () => (
      <View style={{ flex: 5 }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ marginBottom: 50 }}
        >
          <JobForm
            accountId={user?.id || 0}
            jobVerified={jobIsVerified}
            setJobType={() => {}}
            setSalaryValue={() => {}}
            submissionPending=''
            setIsJobSubmitted={setIsJobSubmitted}
          />
          <StyledButton text='Add Job' method={() => handleJobVerification()} />
        </ScrollView>
      </View>),
    },
    {
      title: 'Asset',
      component: () => (
      <View style={{ flex: 5 }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ marginBottom: 10 }}
        >
          <AssetForm
            accountId={user?.id || 0}
            assetVerified={isAssetVerified}
            setAssetType={() => {}}
            setAssetWorthValue={() => {}}
            submissionPending=''
            setIsAssetSubmitted={setIsAssetSubmitted}
          />
        <StyledButton text='Add Asset' method={() => handleAssetVerification()} />
        </ScrollView>
    </View>),
    },
  ]; */
  const [activeTab, setActiveTab] = useState(active);

  useEffect(() => {
    setActive(activeTab);
  }, [activeTab]);

  const handleTabChange = (tabIndex: number) => {
    setActiveTab(tabIndex);
  };

  const Content = tabContent[activeTab]?.component;

  return (
    <View style={{ flex: 1, marginVertical: 80 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'black' }}>
        {tabContent.map((tabItem, i) => (
          <TouchableOpacity onPress={() => handleTabChange(i)} key={i}>
            <Text style={{ color: activeTab === i ? 'red' : 'white' }}>{tabItem?.title}</Text>
          </TouchableOpacity>
        ))
        }
      </View>
        <View>
          <Content />
        </View>
    </View>
  );
};

export default TabContainer;
