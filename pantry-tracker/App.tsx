import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { I18nProvider, useI18n } from './src/i18n';
import { HomeScreen } from './src/screens/HomeScreen';
import { colors } from './src/theme';

function Root() {
  const { ready } = useI18n();
  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.bg,
        }}
      >
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }
  return <HomeScreen />;
}

export default function App() {
  return (
    <I18nProvider>
      <StatusBar style="dark" />
      <Root />
    </I18nProvider>
  );
}
