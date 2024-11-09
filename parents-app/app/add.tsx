import { FlatList, Platform, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Screen } from 'expo-router/build/views/Screen';
import { Avatar, Button, CheckBox, IndexPath, Input, Layout, Radio, RadioGroup, Select, SelectItem, ViewPager, useTheme } from '@ui-kitten/components';
import CustomeIcon from '@/utilities/icons/custome-icons';
import { useRouteInfo } from 'expo-router/build/hooks';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import myChildren from '@/assets/data/childs';
import Text from '@/components/Text';
import * as quranChaperss from '@/assets/data/quran';
import AudioPreviewer from '@/components/AudioPreviewer';
import TalqinSettings from '@/components/Add/TalqinSettings';
import HifzSettings from '@/components/Add/HifzSettings';
import MemorizeSettings from '@/components/Add/MemorizeSettings';

export default function AddScreen() {

  const kittenTheme = useTheme();
  const routerInfo = useRouteInfo();

  // get 
  // const { id }: any = useLocalSearchParams()

  const [selectedChild, setSelectedChild] = useState(myChildren[1]);
  const [quranChapers, setQuranChapers] = React.useState(quranChaperss.default);


  const getQuranChapters = async () => {
    // api call to get quranChapters https://www.mp3quran.net/api/v3/suwar?language=ar
    const { suwar }: any = await fetch('https://www.mp3quran.net/api/v3/suwar?language=ar')
      .then((response) => response.json())

    if (suwar) {
      setQuranChapers(suwar)
    }
  }

  useEffect(() => {
    getQuranChapters();

  }, []);

  const handleChildSelect = (child: any) => {
    setSelectedChild(child);
  }

  const goBack = () => {
    router.back()
  }

  const settings = [
    {
      title: "التلقين",
      tag: 'talqin',
      iconName: 'bulb-outline',
      id: 1,
      // component: <TalqinSettings />,
    },
    {
      title: "الحفظ",
      tag: 'hifz',
      iconName: 'book-outline',
      id: 2,
      // component: <HifzSettings />,
    },
    {
      title: "المراجعة",
      tag: 'memorize',
      iconName: 'book-open-outline',
      id: 3,
      // component: <MemorizeSettings />,
    },
  ]


  const getMokriis = async () => {
    const { reciters } = await fetch('https://www.mp3quran.net/api/v3/reciters?language=ar')
      .then((response) => response.json())
    // console.log("reciters", reciters)
    if (reciters) {
      setMokriis(reciters)
      setRiwayahs(reciters[0].moshaf)
    }

  }

  useEffect(() => {
    try {
      getMokriis();
    } catch (error) {
      console.log('error', error)
    };


  }, [])

  const mokriiSelectionHandler = (index: any) => {
    setSelectedMokriiIndex(index)
    setRiwayahs(mokriis[index].moshaf)

  }

  const [mokriis, setMokriis] = React.useState<any[]>([
    {
      "id": 1,
      "name": "إبراهيم الأخضر",
      "letter": "إ",
      "moshaf": [
        {
          "id": 1,
          "name": "حفص عن عاصم - مرتل",
          "server": "https://server6.mp3quran.net/akdr/",
          "surah_total": 114,
          "moshaf_type": 116,
          "surah_list": "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114"
        }
      ]
    },
  ]);
  const [riwayahs, setRiwayahs] = React.useState([
    {
      "id": 1,
      "name": "حفص عن عاصم - مرتل",
      "server": "https://server6.mp3quran.net/akdr/",
      "surah_total": 114,
      "moshaf_type": 116,
      "surah_list": "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114"
    }
  ]);


  const [selectedSetting, setSelectedSetting] = React.useState(settings[0]);
  const [selectedMokriiIndex, setSelectedMokriiIndex] = React.useState<IndexPath>(new IndexPath(0));
  const [selectedRiwayahIndex, setSelectedRiwayahIndex] = React.useState<IndexPath>(new IndexPath(0));

  const [soundPreviewSource, setSoundPreviewSource] = React.useState('https://server6.mp3quran.net/akdr/001.mp3');
  const displayMokriiValue: string = mokriis[selectedMokriiIndex.row].name;
  const displayRiwayahValue: string = riwayahs[selectedRiwayahIndex.row].name;


  const handleSave = () => {
    router.back()
  }

  useEffect(() => {
    var soundSource = riwayahs[selectedRiwayahIndex.row].server + "001.mp3"
    console.log("soundSource", soundSource)
    setSoundPreviewSource(soundSource)
  }, [selectedRiwayahIndex, selectedMokriiIndex])


  const [selectedIndex, setSelectedIndex] = React.useState(0);

  return (
    <SafeAreaView className='bg-white flex-1'>
      <Screen options={{
        headerShown: false,
        headerTitle: ""
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
          <Text category='h6' className='flex-1 text-sm my-1'>اضافة برنامج لطفلي </Text>

        </View>
        <ScrollView className='pt-1 px-2 ' contentContainerStyle={styles.mainSV} showsVerticalScrollIndicator={false}>

          <View className='h-fit flex  flex-col gap-y-2'>
            <Layout level='1' style={styles.card}>
              <View className='h-fit flex flex-row-reverse items-center justify-between'>
                <View className='flex flex-row items-center'>
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
              <View className='pt-2 flex flex-col justify-start gap-y-2'>
                <Pressable className='bg-gray-300 self-center rounded-full p-8 items-center justify-center my-4'>
                  <CustomeIcon
                    name='person-outline'
                    color={kittenTheme['color-primary-200']}
                    height={33}
                    width={33}
                  />
                </Pressable>
                <View className='flex flex-col gap-y-1 p-1'>
                  <Input
                    textStyle={{
                      textAlign: "right",
                    }}
                    placeholder='الاسم'
                  />

                  <Input
                    textStyle={{
                      textAlign: "right",
                    }}
                    placeholder='العمر'
                    keyboardType='numeric'
                  />

                  <Input
                    textStyle={{
                      textAlign: "right",
                    }}
                    placeholder='المستوى'
                  />


                </View>
              </View>


            </Layout>


            <Layout level='1' style={styles.card}>



              {/* mokrii */}

              <View className='h-fit flex flex-row-reverse items-center justify-between'>
                <View className='flex flex-row items-center mb-1'>
                  <Text category='h6' >
                    اختر المقرئ
                  </Text>
                </View>
              </View>

              <View className='flex flex-col justify-start gap-y-2'>
                <View className='mt-4 flex flex-col gap-y-1 p-1'>

                  <Select
                    size='large'
                    placeholder='Default'
                    value={displayMokriiValue}
                    selectedIndex={selectedMokriiIndex}
                    // onSelect={(index: any) => handleRiwayaSelection(index)}
                    onSelect={mokriiSelectionHandler}
                  >
                    {
                      mokriis.map((mokrii, index) => (
                        <SelectItem key={index} title={mokrii.name} />
                      ))
                    }
                  </Select>

                </View>
              </View>

              {/* Riwayah */}
              <View className=' mt-4 h-fit flex flex-row-reverse items-center justify-between'>
                <View className='flex flex-row items-center mb-1'>
                  <Text category='h6' >
                    اختر الرواية
                  </Text>

                </View>
              </View>


              <View className='flex flex-col justify-start gap-y-2'>
                <View className='mt-4 flex flex-col gap-y-1 p-1'>
                  <Select
                    size='large'
                    placeholder='Default'
                    value={displayRiwayahValue}
                    selectedIndex={selectedRiwayahIndex}
                    // onSelect={(index: any) => handleRiwayaSelection(index)}
                    onSelect={(index: any) => setSelectedRiwayahIndex(index)}
                  >
                    {
                      riwayahs.map((riwaya, index) => (
                        <SelectItem key={index} title={riwaya.name} />
                      ))
                    }

                  </Select>

                </View>
              </View>

              <View className='my-4 w-full'>
                <AudioPreviewer source={soundPreviewSource} />
              </View>
            </Layout>


            <Layout level='1' style={styles.card}>

              <View className='flex flex-row gap-x-2 items-center justify-between'>

                {
                  settings.map((setting, index) => (
                    <Button
                      key={index}
                      size='medium'
                      onPress={() => {
                        setSelectedSetting(setting)
                        setSelectedIndex(index)
                      }}
                      style={styles.button}
                      appearance={
                        selectedSetting.id === setting.id ? 'filled' :
                          'ghost'}
                      status={
                        selectedSetting.id === setting.id ? 'primary' :
                          'basic'}
                      accessoryLeft={(props) =>
                        <CustomeIcon
                          name={setting.iconName}
                          height={18}
                          width={18}
                          {...props}
                        />}>
                      {setting.title}
                    </Button>
                  ))
                }
              </View>
            </Layout>

            <Layout level='1' style={styles.card}>

              <View className='flex flex-col w-full gap-y-2 '>
                <ViewPager
                  selectedIndex={selectedIndex}
                  onSelect={index => {
                    setSelectedIndex(index)
                    setSelectedSetting(settings[index])
                  }}
                >
                  <Layout
                    // level='2'
                    style={styles.tab}
                  >
                    <TalqinSettings quranChapers={quranChapers} />
                  </Layout>

                  <Layout
                    // level='2'
                    style={styles.tab}
                  >
                    <HifzSettings quranChapers={quranChapers} />
                  </Layout>
                  <Layout
                    // level='2'
                    style={styles.tab}
                  >
                    <MemorizeSettings quranChapers={quranChapers} />
                  </Layout>
                </ViewPager>
                {/* {selectedSetting.component} */}
                {/* {
                  selectedSetting.tag === 'talqin'
                    ?
                    <TalqinSettings quranChapers={quranChapers} />
                    :
                    selectedSetting.tag === 'hifz'
                      ?
                      <HifzSettings quranChapers={quranChapers} />
                      :
                      <MemorizeSettings quranChapers={quranChapers} />
                } */}
              </View>
            </Layout>

          </View>

          <View className='mt-4'>
            <Button
              size='large'
              style={{ marginVertical: 4 }}
              onPress={handleSave}
              accessoryLeft={(props) => <CustomeIcon
                name='save-outline'
                height={18}
                width={18}
                {...props}
              />}
            >
              حفظ
            </Button>
          </View>
        </ScrollView >

      </Layout >
    </SafeAreaView >
  );
}

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
    overflow: 'hidden',
  },
  tab: {
    width: '100%',
    paddingHorizontal: 11,
    height: "auto"
    // marginHorizontal: 55,
  },
  button: {
    flex: 1
  }
});

