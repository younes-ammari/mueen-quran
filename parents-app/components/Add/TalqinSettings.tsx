import { Pressable, StyleSheet, View } from 'react-native'
import React from 'react'
import { CheckBox, IndexPath, Input, Select, SelectItem } from '@ui-kitten/components';
import Text from '../Text';

type TalqinSettingsProps = {
    quranChapers: Array<any>,
}

export default function TalqinSettings({
    quranChapers,
}: TalqinSettingsProps) {



    const talqinWays = [
        {
            name: "سمعي",
            id: '1',
        },
        {
            name: "مرئي",
            id: '2',
        },
        {
            name: "مرئي وسمعي",
            id: '3',
        },
    ];

    const activities = [
        {
            name: "ألغاز",
            id: '1',
        },
        {
            name: "ألعاب تفاعلية",
            id: '2',
        }
    ];

    const weekdays = [
        {
            name: "السبت",
            id: '1',
        },
        {
            name: "الأحد",
            id: '2',
        },
        {
            name: "الاثنين",
            id: '3',
        },
        {
            name: "الثلاثاء",
            id: '4',
        },
        {
            name: "الأربعاء",
            id: '5',
        },
        {
            name: "الخميس",
            id: '6',
        },
        {
            name: "الجمعة",
            id: '7',
        }
    ];

    const [selectedIndex, setSelectedIndex] = React.useState<IndexPath>(new IndexPath(0));
    const displayQuranChapterValue: string = (selectedIndex.row + 1) + "-" + quranChapers[selectedIndex.row].name;

    const [allVerses, setAllVerses] = React.useState(false);

    const [selectedTalqinWayIndex, setSelectedTalqinWayIndex] = React.useState<IndexPath>(new IndexPath(0));
    const displayTalqinWayValue: string = talqinWays[selectedTalqinWayIndex.row].name;

    const [selectedActivityIndex, setSelectedActivityIndex] = React.useState<IndexPath>(new IndexPath(0));
    const displayActivityValue: string = activities[selectedActivityIndex.row].name;


    const [selectedWeekdays, setSelectedWeekdays] = React.useState([0]);



    return (
        <View>
            <View className='mb-1 mt-2'>
                <Text category='h6' className='mb-2' >
                    اختر السورة
                </Text>
            </View>


            <Select
                size='large'
                placeholder='Default'
                value={displayQuranChapterValue}
                selectedIndex={selectedIndex}
                onSelect={(index: any) => setSelectedIndex(index)}
            >
                {
                    quranChapers.map((chapter, index) => (
                        <SelectItem key={index} title={(index + 1) + "-" + chapter.name}
                        />
                    ))
                }

            </Select>

            <Pressable
                onPress={() => setAllVerses(!allVerses)}
                className='my-2 justify-end flex flex-row items-center gap-x-2'>
                <Text category='h6' >
                    كل الآيات
                </Text>
                <CheckBox
                    checked={allVerses}
                    onChange={nextChecked => setAllVerses(nextChecked)}
                />
            </Pressable>

            {!allVerses
                &&
                <View className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                    <View className='col-span-1 gap-y-1'>
                        <Text>
                            إلى الآية
                        </Text>
                        <Input
                            textStyle={{
                                textAlign: "right",
                            }}
                            placeholder='رقم الآية'
                            keyboardType='numeric'
                        />
                    </View>

                    <View className='col-span-1 gap-y-1'>
                        <Text>
                            من الآية
                        </Text>
                        <Input
                            textStyle={{
                                textAlign: "right",
                            }}
                            placeholder='رقم الآية'
                            keyboardType='numeric'
                        />
                    </View>

                </View>
            }

            <View className='my-2'>
                <Text category='h6' className='mb-2' >
                    اختر طريقة التلقين
                </Text>

                <Select
                    size='large'
                    placeholder='Default'
                    value={displayTalqinWayValue}
                    selectedIndex={selectedTalqinWayIndex}
                    onSelect={(index: any) => setSelectedTalqinWayIndex(index)}
                >
                    {
                        talqinWays.map((way, index) => (
                            <SelectItem key={index} title={way.name} />
                        ))
                    }
                </Select>
            </View>

            <View className='my-2'>
                <Text category='h6' className='mb-2' >
                    اختر النشاط التفاعلي
                </Text>

                <Select
                    size='large'
                    placeholder='Default'
                    value={displayActivityValue}
                    selectedIndex={selectedActivityIndex}
                    onSelect={(index: any) => setSelectedActivityIndex(index)}
                >
                    {
                        activities.map((activity, index) => (
                            <SelectItem key={index} title={activity.name} />
                        ))
                    }
                </Select>
            </View>

            <View className='my-2'>
                <Text category='h6' className='mb-2' >
                    اختر الوقت المناسب
                </Text>

                <Input
                    textStyle={{
                        textAlign: "right",
                    }}
                    placeholder='16:00'
                    keyboardType='numeric'
                />

            </View>

            <View className='my-2'>
                <Text category='h6' className='mb-2' >
                    مدت الجلسة  (بالدقائق)
                </Text>

                <Input
                    textStyle={{
                        textAlign: "right",
                    }}
                    placeholder='20'
                    keyboardType='numeric'
                />
            </View>


            <View className='my-2'>
                <Text category='h6' className='mb-2' >
                    اختر أيام الأسبوع
                </Text>
                <View className='grid grid-cols-2 sm:grid-cols-4 place-items-end'>

                    {
                        weekdays.map((weekday, index) => (
                            <Pressable key={index}
                                className='my-2 justify-end flex flex-row items-center gap-x-2'
                                onPress={() => {
                                    if (selectedWeekdays.includes(index)) {
                                        setSelectedWeekdays(selectedWeekdays.filter((item) => item !== index))
                                    } else {
                                        setSelectedWeekdays([...selectedWeekdays, index])
                                    }
                                }}

                            >
                                <Text category='s1' >
                                    {weekday.name}
                                </Text>
                                <CheckBox
                                    key={index}
                                    checked={selectedWeekdays.includes(index)}
                                    onChange={nextChecked => {
                                        if (nextChecked) {
                                            setSelectedWeekdays([...selectedWeekdays, index])
                                        } else {
                                            setSelectedWeekdays(selectedWeekdays.filter((item) => item !== index))
                                        }
                                    }}
                                >
                                    {/* {weekday.name} */}
                                </CheckBox>
                            </Pressable>
                        ))
                    }

                </View>
            </View>



        </View>

    )
}

const styles = StyleSheet.create({})