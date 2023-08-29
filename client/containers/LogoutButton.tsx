import { View, Button, Pressable } from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import { useAuth } from '@context/auth';

const LogoutButton = ({
  icon,
}: {
  icon?: boolean,
}) => {
  const { signOut } = useAuth();

  return (
    <View style={{ borderRadius: 50, maxWidth: 150 }}>
      {icon
        ? <Pressable onPress={signOut}><Icon name='log-out-outline' size={36} color='#b4151c' style={{ transform: [{ rotate: '-90deg' }] }} /></Pressable>
        : <Button
        onPress={signOut}
        title="Sign Out"
        color="#b4151c"
        accessibilityLabel="Learn more about this purple button"
      />}
    </View>
  );
};

export default LogoutButton;
