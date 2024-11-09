import { StyleSheet, View, Text as RNText, ScrollView, Pressable, TouchableOpacity, Dimensions } from 'react-native';

import { Avatar, Button, Card, CircularProgressBar, Divider, Icon, Layout, ProgressBar, useTheme } from '@ui-kitten/components';
import Text from '@/components/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomeIcon from '@/utilities/icons/custome-icons';
import { useLocalSearchParams, useRouter, router, Link } from 'expo-router';
import { useRouteInfo } from 'expo-router/build/hooks';
import React, { forwardRef, useState } from 'react';
import { useAppContext } from '@/utilities/context/app-context';
import { EvaStatus } from '@ui-kitten/components/devsupport';
import myChildren from "../../assets/data/childs"
import { Screen } from 'expo-router/build/views/Screen';
import ProgressElement from '@/components/ProgressElement';
import CircularProgressElement from '@/components/CircularProgressElement';
import ChildStatsTab from '@/components/ChildStatsTab';

const TabOneScreen = forwardRef((props, ref: any) => {
    const kittenTheme = useTheme();

    const routerInfo = useRouteInfo();
    const { id }: any = useLocalSearchParams()

    const [selectedChild, setSelectedChild] = useState(myChildren[id - 1]);

    const handleChildSelect = (child: any) => {
        setSelectedChild(child);
    }

    const goBack = () => {
        router.back()
    }



    return (
        <SafeAreaView className='bg-white flex-1'>
            <Screen options={{
                headerShown: false,
                headerTitle: "إحصائيات الطفل"
            }} />
            <Layout level='2' style={styles.container}>
                <View className='w-full flex-row-reverse justify-center items-center gap-x-2 px-4 py-4 mb-1'>

                    <TouchableOpacity onPress={goBack}>
                        <CustomeIcon
                            name='arrow-forward'
                            color={kittenTheme["color-primary-100"]}
                            height={18}
                            width={18}
                        />
                    </TouchableOpacity>
                    {/* <Text category='h5' className='text-sm my-1'>احصائيات "{selectedChild.name}"</Text> */}
                    <Text category='h6' className='flex-1 text-sm my-1'>إحصائيات الطفل </Text>

                </View>
                <ScrollView className='pt-1 px-2 ' contentContainerStyle={styles.mainSV} showsVerticalScrollIndicator={false}>

                    <View className='h-fit flex  flex-col gap-y-2'>

                        {/* <View className='opacity-75'>
                            <Text category='s1'>
                                أهلا بك في أفضل تطبيق لتعلم القرآن الكريم والتجويد المخصص لأبنائك وبناتك
                            </Text>
                        </View> */}


                        <Layout level='1' style={styles.card}>
                            <View className='h-fit flex flex-row-reverse items-center justify-between'>
                                <View className='flex flex-row items-center mb-1'>
                                    <Text category='h6' >
                                        الملف الشخصي والمستوى
                                    </Text>
                                    <Button
                                        size='tiny'
                                        appearance='ghost'
                                        status='basic'
                                        accessoryLeft={(props) =>
                                            <CustomeIcon
                                                name='info-outline'
                                                color={props?.tintColor}
                                                height={18}
                                                width={18}
                                            />}

                                    />
                                </View>
                            </View>
                            <View className='flex flex-row-reverse justify-start gap-x-1'>
                                <Avatar
                                    style={{ margin: 4 }}
                                    size='giant'
                                    source={selectedChild.imageUri}
                                />
                                <View className='flex-1 flex flex-col gap-y-1 p-1'>

                                    <View className='flex flex-row-reverse items-center justify-start gap-x-2'>
                                        <Text category='s1' className='opacity-50'>الاسم:</Text>
                                        <Text category='s1' className='opacity-95'>{selectedChild.name}</Text>
                                    </View>

                                    <View className='flex flex-row-reverse items-center justify-start gap-x-2'>
                                        <Text category='s1' className='opacity-50'>العمر:</Text>
                                        <Text category='s1' className='opacity-95'>{selectedChild.age}</Text>
                                    </View>

                                </View>
                                {/* <Text category='h6' className='text-sm my-1'>{selectedChild.name}</Text> */}
                            </View>


                        </Layout>

                        <Layout level='1' style={styles.card}>
                            <View className='w-full flex flex-row justify-end items-center mb-1'>
                                <Text category='h6' >
                                    الإحصائيات
                                </Text>
                                <Button
                                    size='tiny'
                                    appearance='ghost'
                                    status='basic'
                                    accessoryLeft={(props) =>
                                        <CustomeIcon
                                            name='pie-chart-outline'
                                            color={props?.tintColor}
                                            height={18}
                                            width={18}
                                        />}
                                />
                            </View>
                            <Divider />
                            {
                                selectedChild &&
                                <View className='w-full'>
                                    <ProgressElement status={
                                        selectedChild.analysis.progress > 0.5 ? 'success' : 'danger'
                                    } title='نسبة التقدّم' progress={selectedChild.analysis.progress} />

                                    <View className='w-full flex flex-row items-center justify-around mt-2 py-1 pt-3'>
                                        <CircularProgressElement title='التلقين' status={"success"} progress={selectedChild.analysis.talaqin} />
                                        <CircularProgressElement title='الحفظ' status={"danger"} progress={selectedChild.analysis.hifz} />
                                        <CircularProgressElement title='المراجعة' status={"info"} progress={selectedChild.analysis.review} />
                                    </View>
                                </View>
                            }

                        </Layout>

                        <Layout level='1' style={styles.card}>
                            <View className='w-full flex flex-row justify-end items-center mb-1'>
                                <Text category='h6' >
                                    نصائح  "معين"
                                </Text>
                                <Button
                                    size='tiny'
                                    appearance='ghost'
                                    status='basic'
                                    accessoryLeft={(props) =>
                                        <CustomeIcon
                                            name='bulb-outline'
                                            color={props?.tintColor}
                                            height={18}
                                            width={18}
                                        />}
                                />
                            </View>
                            {
                                selectedChild &&
                                <View className='w-full flex flex-col'>
                                    {
                                        selectedChild.advices.map((advice: string, index: number) => (
                                            <View key={index} className='w-full flex flex-row items-start justify-end gap-x-1'>
                                                <Text category='s1' className='text-msl'>{advice}</Text>
                                                <CustomeIcon name='done-all-outline' color={kittenTheme['color-primary-500']} size={22} />
                                            </View>
                                        )
                                        )
                                    }
                                </View>
                            }
                        </Layout>

                    </View>
                </ScrollView >

            </Layout >
        </SafeAreaView >
    );
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: 10,
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
        paddingHorizontal: 9,
        borderRadius: 4,
        marginBottom: 4,
    }
});


export default TabOneScreen;