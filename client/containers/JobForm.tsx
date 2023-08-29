import { useAuth } from '@context/auth';
import StyledOpenInput from '@components/StyledOpenInput';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { SelectList as Select } from 'react-native-dropdown-select-list';
import { ALLOWED_JOBS } from '@constants/index';

const JobForm = ({
  accountId,
  setJobType,
  setSalaryValue,
  submissionPending,
  jobVerified,
  setIsJobSubmitted,
  newJob,
  newjobSalary,
}: {
  accountId: number,
  setJobType: (jobType: string) => void,
  setSalaryValue: (salaryValue: string) => void,
  submissionPending: string,
  jobVerified: boolean,
  setIsJobSubmitted?: (stuff: boolean) => void,
  newJob?: string,
  newjobSalary?: string,
}) => {
  const [job, setJob] = useState(newJob || '');
  const [yearlySalary, setYearlySalary] = useState(newjobSalary || '');
  const { addJob } = useAuth();

  const handleYearlySalary = (value: string) => {
    const salary = value ? parseFloat(value) : 0;
    const max = 10000000;

    if (salary > max) {
      setYearlySalary(max.toString());
      setSalaryValue(max.toString());
    } else {
      setYearlySalary(salary ? salary.toString() : '');
      setSalaryValue(salary ? salary.toString() : '');
    }
  };

  const handleAddJob = async () => {
    const jobAdded = await addJob(accountId, job?.toLowerCase()?.replace(' ', '_'), parseFloat(yearlySalary), jobVerified);
    if (setIsJobSubmitted && jobAdded?.length > 0) setIsJobSubmitted(jobAdded?.length > 0);
  };

  useEffect(() => {
    if (jobVerified) handleAddJob();
  }, [jobVerified]);

  return (
    <View>
      <Text>Job Information</Text>
      <View>
          <Text style={{
            color: '#845FA8',
            marginTop: 20,
            marginBottom: 30,
            fontWeight: '500',
          }}>⁂Yearly salary must be between 120K and 10M</Text>
        </View>
      <Text style={{ fontSize: 14, marginBottom: 10, color: '#626161' }}>Job Type</Text>
      <Select
        setSelected={(text: string) => {
          setJob(text);
          setJobType(text);
        }}
        data={ALLOWED_JOBS}
        save='value'
        searchPlaceholder='Job Category'
        boxStyles={{ marginBottom: 30 }}
      />
      <StyledOpenInput
        label='Yearly Salary ₦'
        placeholder='0.00'
        keyboardType='numeric'
        value={yearlySalary}
        onChangeText={(text) => handleYearlySalary(text)}
        maxLength={8}
        editable={submissionPending !== 'pending'}
      />
    </View>
  );
};

export default JobForm;
