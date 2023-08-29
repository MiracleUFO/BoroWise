import { useAuth } from '@context/auth';
import StyledOpenInput from '@components/StyledOpenInput';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { SelectList as Select } from 'react-native-dropdown-select-list';
import { ALLOWED_ASSETS } from '@constants/index';

const AssetForm = ({
  accountId,
  setAssetType,
  setAssetWorthValue,
  submissionPending,
  assetVerified,
  setIsAssetSubmitted,
  newAsset,
  newAssetWorth,
}: {
  accountId: number,
  setAssetType: (assetType: string) => void,
  setAssetWorthValue: (assetWorth: string) => void,
  submissionPending: string,
  assetVerified: boolean,
  setIsAssetSubmitted?: (stuff: boolean) => void,
  newAsset?: string,
  newAssetWorth?: string,
}) => {
  const [asset, setAsset] = useState(newAsset || '');
  const [worth, setAssetWorth] = useState(newAssetWorth || '');

  const { addAsset } = useAuth();

  const handleYearlySalary = (value: string) => {
    const salary = value ? parseFloat(value) : 0;
    const max = 10000000;

    if (salary > max) {
      setAssetWorth(max.toString());
      setAssetWorthValue(max.toString());
    } else {
      setAssetWorth(salary ? salary.toString() : '');
      setAssetWorthValue(salary ? salary.toString() : '');
    }
  };

  const handleAddAsset = async () => {
    console.log('UMMMMMMM');
    const isAdded = await addAsset(accountId, asset?.toLowerCase()?.replace(' ', '_'), parseFloat(worth), assetVerified);
    if (setIsAssetSubmitted && isAdded?.length > 0) setIsAssetSubmitted(true);
  };

  useEffect(() => {
    if (assetVerified) handleAddAsset();
  }, [assetVerified]);

  return (
    <View>
      <Text>Asset Information</Text>
      <View>
          <Text style={{
            color: '#845FA8',
            marginTop: 20,
            marginBottom: 30,
            fontWeight: '500',
          }}>⁂Asset worth must be between 120K and 10M</Text>
        </View>
      <Text style={{ fontSize: 14, marginBottom: 10, color: '#626161' }}>Asset Type</Text>
      <Select
        setSelected={(text: string) => {
          setAsset(text);
          setAssetType(text);
        }}
        data={ALLOWED_ASSETS}
        save='value'
        searchPlaceholder='Asset Category'
        boxStyles={{ marginBottom: 30 }}
      />
      <StyledOpenInput
        label='Asset Worth ₦'
        placeholder='0.00'
        keyboardType='numeric'
        value={worth}
        onChangeText={(text) => handleYearlySalary(text)}
        maxLength={8}
        editable={submissionPending !== 'pending'}
      />
    </View>
  );
};

export default AssetForm;
