import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import {
  Pressable,
  Text,
  View,
  Image,
  useColorScheme,
  ImageSourcePropType,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

import Colors from '@constants/Colors';
import { useAssets } from 'expo-asset';
import { useAuth } from '@context/auth';
import { DATE_OPTIONS } from '@constants/index';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    color: '#6C6B6B',
    marginTop: 80,
    marginHorizontal: '8%',
    minHeight: 50,
  },
});

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useAuth();

  // eslint-disable-next-line global-require
  const [avatar, error] = useAssets([require('assets/images/avatar.png')]);
  // eslint-disable-next-line no-console
  if (error) console.log('Error loading avatar');

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { display: 'none' },
        headerStyle: { backgroundColor: '#F5F5F5' },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          header: () => (
              <SafeAreaView style={{ flex: 1 }}>
                 <StatusBar backgroundColor="#F5F5F5" barStyle="dark-content" />
                <View style={styles.container}>
                  <View style={{ }}>
                    <Text style={{ fontSize: 20, color: '#6C6B6B' }}>Hello {user?.firstName},</Text>
                    <Text style={{ fontSize: 14, color: '#4E4D4D' }}>{new Intl.DateTimeFormat('en-GB', DATE_OPTIONS).format(new Date())}</Text>
                  </View>

                  <Link href="/modal" asChild>
                    <Pressable>
                      {({ pressed }) => (
                        avatar?.[0]
                          ? <Image
                              source={avatar?.[0] as ImageSourcePropType}
                              style={{ width: 48, height: 48 }}
                            />
                          : <FontAwesome
                            name="info-circle"
                            size={25}
                            color={Colors[colorScheme ?? 'light'].text}
                            style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                          />
                      )}
                    </Pressable>
                  </Link>
                </View>
              </SafeAreaView>
          ),
        }}
      />
    </Tabs>
  );
}
