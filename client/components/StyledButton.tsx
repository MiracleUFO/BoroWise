import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const StyledButton = ({
  text,
  method,
  bgColor,
  textColor,
  width,
  height,
  borderRadius,
  disabled,
}: {
  text: string,
  method: () => void,
  bgColor?: string,
  textColor?: string,
  width?: number,
  height?: number,
  borderRadius?: number,
  disabled?: boolean,
}) => {
  const styles = StyleSheet.create({
    button: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 10,
    },
    text: {
      color: 'white',
      fontWeight: '500',
    },
  });

  return (
    <TouchableOpacity onPress={() => method()} style={{
      ...styles.button,
      width: width || '100%',
      height: height || 46,
      backgroundColor: disabled ? '#D9D9D9' : bgColor || '#845FA8',
      borderRadius: borderRadius || 0,
    }}>
      <Text style={{ ...styles.text, color: textColor || 'white' }}>
        {text}
      </Text>
  </TouchableOpacity>
  );
};

export default StyledButton;
