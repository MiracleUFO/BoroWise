import * as React from 'react';
import {
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import Button from '@components/StyledButton';
import Modal from '@components/Modal';
import StyledOpenInput from '@components/StyledOpenInput';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: '5%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
  separator: {
    marginVertical: 30,
    height: 0,
    width: '80%',
  },
});

export default function RepaymentPopup({
  open,
  reset,
}: { open: boolean, reset: () => void; }) {
  const [isModalVisible, setIsModalVisible] = React.useState(open);
  const closeModal = () => {
    setIsModalVisible(false);
    reset();
  };

  const payLoan = () => {
    ToastAndroid.showWithGravity(
      'Loan paid!',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    closeModal();
  };

  return (
    <>
      {isModalVisible
        ? <View style={styles.container}>
          <Text style={styles.title}>Loan Repayment</Text>
          <View style={styles.separator} />
          <Modal isVisible={isModalVisible}>
            <Modal.Container>
              <View style={{ position: 'absolute', right: 20 }}>
                <Button text='x' method={closeModal} width={20} height={20} borderRadius={9} />
              </View>
              <Modal.Header title='Repay Loan' />
              <Modal.Body>
                <StyledOpenInput placeholder='Bank Name' marginBottom={5} />
                <StyledOpenInput placeholder='Account Number' marginBottom={5} keyboardType='numeric' />
                <StyledOpenInput placeholder='Security Pin' marginBottom={5} keyboardType='numeric' />
                <StyledOpenInput placeholder='Repayment Amount' marginBottom={5} keyboardType='numeric' />
              </Modal.Body>
              <Modal.Footer>
                <Button text='🔒 Pay' method={payLoan} borderRadius={18} />
              </Modal.Footer>
            </Modal.Container>
          </Modal>
        </View>
        : null}
    </>
  );
}
