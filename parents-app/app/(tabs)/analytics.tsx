import { Pressable, StyleSheet, View, Text as RNText, TouchableOpacity, ScrollView } from 'react-native';

import { useEffect, useState } from 'react';
import { Button, Divider, Icon, IconElement, IconProps, Layout, TopNavigation, TopNavigationAction, useTheme } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useNavigation } from 'expo-router';
import Text from '@/components/Text';
import { Foundation, Ionicons } from '@expo/vector-icons';
import CustomeIcon from '@/utilities/icons/custome-icons';
import { useAppContext } from '@/utilities/context/app-context';
import CircularProgressElement from '@/components/CircularProgressElement';
import ProgressElement from '@/components/ProgressElement';
import myChildren from '@/assets/data/childs';
import ChildStatsTab from '@/components/ChildStatsTab';
// import { LogBox } from 'react-native';
// LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
// LogBox.ignoreAllLogs(); //Ignore all log notifications



export default function TabPlayerScreen() {
    const kittenTheme = useTheme();
    const { selectedDars, setSelectedDars } = useAppContext();

    const navigation = useNavigation();
    const BackIcon = (props: IconProps): IconElement => (
        <Icon
            {...props}
            name='arrow-back'
        />
    );

    const BackAction = (): React.ReactElement => (
        <TopNavigationAction icon={BackIcon} onPress={goBack} />
    );

    const goBack = () => {
        navigation.goBack();
    }
    const [selectedChild, setSelectedChild] = useState(myChildren[0]);

    const handleChildSelect = (child: any) => {
        setSelectedChild(child);
    }




    return (
        <SafeAreaView className='bg-white flex-1'>

            <Layout level='2' style={styles.container}>
                <ScrollView className='pt-3 px-2 pb-10' contentContainerStyle={styles.mainSV} showsVerticalScrollIndicator={false}>
                    <Text category='h2'>
                        الإحصائيات
                    </Text>

                    <View className='opacity-75'>
                        <Text category='s1'>
                            أهلا بك في أفضل تطبيق لتعلم القرآن الكريم والتجويد المخصص لأبنائك وبناتك
                        </Text>
                    </View>


                    <View className='w-full flex flex-col items-end justify-start py-1'>
                        {
                            myChildren.map((child, index) => (
                                <Layout level='1'
                                    key={index} style={styles.card}
                                >
                                    <View className='w-full items-end'
                                    >
                                        <ChildStatsTab
                                            size='medium'
                                            category='h6'
                                            child={child}
                                            onPress={() => handleChildSelect(child)}
                                        />
                                        <View className='w-full'>
                                            <ProgressElement status={
                                                child.analysis.progress > 0.5 ? 'success' : 'danger'
                                            } title='نسبة التقدّم' progress={child.analysis.progress} />

                                            <Divider />
                                            <View className='w-full flex flex-row items-center justify-around mt-2 py-1 pt-3'>
                                                <CircularProgressElement title='التلقين' status={"success"} progress={child.analysis.talaqin} />
                                                <CircularProgressElement title='الحفظ' status={"danger"} progress={child.analysis.hifz} />
                                                <CircularProgressElement title='المراجعة' status={"info"} progress={child.analysis.review} />
                                            </View>
                                        </View>

                                        <View className='mt-4 w-full'>

                                            <Divider />
                                            <Link href={`../child-stats/${selectedChild.id}`} asChild>
                                                <Button
                                                    // appearance='outline' 
                                                    appearance='ghost'
                                                >
                                                    <Text>
                                                        المزيد من التفاصيل
                                                    </Text>

                                                </Button>
                                            </Link>

                                        </View>

                                    </View>
                                </Layout>
                            ))
                        }
                    </View>


                </ScrollView>

            </Layout>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        paddingTop: 0,
    },
    mainSV: {
        paddingBottom: 9,
        paddingHorizontal: 6,
        maxWidth: 888,
        width: '100%',
        alignSelf: 'center',
        // backgroundColor: 'red'
    },
    card: {
        padding: 6,
        width: "100%",
        paddingHorizontal: 9,
        borderRadius: 8,
        marginBottom: 8,
    }
});

