import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
  FlexAlignType,
} from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import { useState } from 'react';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginBottom: 10,
  },
  inputContainer: {
    width: '100%',
    height: 55,
    flexDirection: 'row',
    borderBottomWidth: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '90%',
    height: 40,
    color: '#626161',
    marginTop: 20,
  },
});

type InputFieldProps = TextInputProps & {
  label?: string,
  iconRight?: keyof typeof Icon.glyphMap,
  iconLeft?: keyof typeof Icon.glyphMap,
  iconLeftColor?: string,
  iconRightColor?: string,
  iconPosition?: 'auto' | FlexAlignType,
  iconPositionBottom?: number,
  secure?: boolean,
  marginBottom?: number,
};

const StyledOpenInput: React.FC<InputFieldProps> = ({
  label,
  iconRight,
  iconLeft,
  iconLeftColor,
  iconRightColor,
  iconPosition,
  iconPositionBottom,
  secure,
  marginBottom,
  ...rest
}) => {
  const [isActive, setIsActive] = useState(false);
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 14, color: '#626161' }}>{label}</Text>
      <View style={{ ...styles.inputContainer, borderBottomColor: isActive ? 'black' : '#626161', marginBottom: marginBottom || 30 }}>
        {iconLeft ? <Icon name={iconLeft} size={18} color={iconLeftColor || '#626161'} style={{ alignSelf: iconPosition, marginTop: iconPositionBottom }} /> : null}
        <TextInput
          style={{ ...styles.input, width: iconLeft || iconRight ? '90%' : '100%' }}
          placeholderTextColor="#a9a8a8"
          secureTextEntry={secure}
          selectTextOnFocus={secure}
          onFocus={() => setIsActive(true)}
          onBlur={() => setIsActive(false)}
          {...rest}
        />
        {iconRight ? <Icon name={iconRight} size={18} color={iconRightColor || '#626161'} style={{ alignSelf: iconPosition, marginTop: iconPositionBottom }} /> : null}
      </View>
    </View>
  );
};

export default StyledOpenInput;
