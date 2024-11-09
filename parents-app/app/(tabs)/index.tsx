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
import ProgressElement from '@/components/ProgressElement';
import CircularProgressElement from '@/components/CircularProgressElement';
import ChildStatsTab from '@/components/ChildStatsTab';

const TabOneScreen = forwardRef((props, ref: any) => {
  const { selectedDars, setSelectedDars } = useAppContext();
  const kittenTheme = useTheme();

  const routerInfo = useRouteInfo();
  const [selectedChild, setSelectedChild] = useState(myChildren[0]);

  const handleChildSelect = (child: any) => {
    setSelectedChild(child);
  }




  return (
    <SafeAreaView className='bg-white flex-1'>
      <Layout level='2' style={styles.container}>
        <ScrollView className='pt-1 px-2 ' contentContainerStyle={styles.mainSV} showsVerticalScrollIndicator={false}>
          <Text category='h5' className=' text-center my-1 p-0'>معين</Text>
          <View className='h-fit flex  flex-col gap-y-2'>
            <Layout level='1' style={styles.card}>
              <View className='w-full flex flex-row items-center justify-between'>
                {/* logout icon */}
                <TouchableOpacity>
                  <Icon name='log-out-outline' fill={kittenTheme['color-danger-300']} style={{ width: 19, height: 19 }} />
                </TouchableOpacity>
                <Text category='h6' className='text-sm my-1'>أحمد  فهد الغامدي</Text>
              </View>
            </Layout>

            <View className='opacity-75'>
              <Text category='s1'>
                أهلا بك في أفضل تطبيق لتعلم القرآن الكريم والتجويد المخصص لأبنائك وبناتك
              </Text>
            </View>


            <Layout level='1' style={styles.card}>
              <View className='h-fit flex flex-row-reverse items-center justify-between'>
                <View className='flex flex-row items-center mb-1'>
                  <Text category='h6' >
                    ابنائي
                  </Text>
                  <Button
                    size='tiny'
                    appearance='ghost'
                    status='basic'
                    accessoryLeft={(props) => <CustomeIcon name='children' pack="font-awesome6" color={props?.tintColor} size={props?.height} />}
                  />
                </View>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ width: "100%" }}>
                <View className='w-full flex flex-row-reverse items-center justify-start'>


                  {
                    myChildren.map((child, index) => (
                      <Avatar
                        key={index}
                        style={{ margin: 4 }}
                        size='medium'
                        source={child.imageUri}
                      />
                    ))
                  }
                  <Link href={"/add"} asChild>
                    <TouchableOpacity className='flex flex-row items-center opacity-70'>
                      <CustomeIcon
                        color={kittenTheme['color-primary-500']}
                        name='plus-circle-outline' size={45} />
                    </TouchableOpacity>
                  </Link>

                </View>
              </ScrollView>
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

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ width: "100%" }}>
                <View className='w-full flex flex-row-reverse items-center justify-start py-1'>
                  {
                    myChildren.map((child, index) => (
                      <ChildStatsTab
                        key={index}
                        isSelected={selectedChild.id === child.id}
                        child={child}
                        onPress={() => handleChildSelect(child)}
                      />
                    ))
                  }
                </View>
              </ScrollView>
              <Divider />
              {
                selectedChild &&
                <View className='w-full my-3'>
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

              <View className='mt-2'>

                <Divider />
                <Link href={`../child-stats/${selectedChild.id}`} asChild>
                  <Button

                    // appearance='outline' 
                    appearance='ghost'


                  >المزيد من التفاصيل</Button>
                </Link>

              </View>

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
                    myChildren.map((child, index) => (
                      <View key={index} className=' py-1 pt-4 w-full flex flex-col items-end justify-start gap-y-1'>
                        <ChildStatsTab
                          key={index}
                          child={child}
                        />

                        {
                          child.advices.map((advice: string, index: number) => (
                            <View key={index} className='w-full flex flex-row items-start justify-end gap-x-1 pb-2'>
                              <Text category='s1' className='text-msl flex-1'>{advice}</Text>
                              <CustomeIcon name='done-all-outline' color={kittenTheme['color-primary-500']} size={22} />
                            </View>
                          ))
                        }

                        <View className='w-full pt-4'>
                          <Divider />
                        </View>
                      </View>
                    )
                    )
                  }
                </View>
              }
            </Layout>

          </View>
        </ScrollView>

      </Layout>
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
    borderRadius: 8,
    marginBottom: 4,
  }
});


export default TabOneScreen;