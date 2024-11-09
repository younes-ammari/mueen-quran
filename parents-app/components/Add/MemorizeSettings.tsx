import { StyleSheet, View } from 'react-native'
import React from 'react'
import Text from '../Text'
import { IndexPath, Input, Radio, RadioGroup, Select, SelectItem } from '@ui-kitten/components';

type MemorizeSettingsProps = {
    quranChapers: Array<any>,
}


export default function MemorizeSettings({
    quranChapers,
}: MemorizeSettingsProps) {
    const [selectedQuranChapterStartIndex, setSelectedQuranChapterStartIndex] = React.useState<IndexPath>(new IndexPath(0));
    const displayQuranChapterStartValue: string = (selectedQuranChapterStartIndex.row + 1) + "-" + quranChapers[selectedQuranChapterStartIndex.row].name;

    const [selectedQuranChapterEndIndex, setSelectedQuranChapterEndIndex] = React.useState<IndexPath>(new IndexPath(0));
    const displayQuranChapterEndValue: string = (selectedQuranChapterEndIndex.row + 1) + "-" + quranChapers[selectedQuranChapterEndIndex.row].name;

    const [selectedMemorizeIndex, setSelectedMemorizeIndex] = React.useState(0);
    return (
        <View>
            <View className='mb-1 mt-2'>
                <Text category='h6' className='mb-2' >
                    ختر نوع المراجعة
                </Text>


                <RadioGroup
                    selectedIndex={selectedMemorizeIndex}
                    onChange={index => setSelectedMemorizeIndex(index)}
                >
                    <Radio style={{ flexDirection: 'row-reverse' }}>
                        مراجعة من المحفوظ
                    </Radio>
                    <Radio style={{ flexDirection: 'row-reverse' }}>
                        تخصيص
                    </Radio>
                </RadioGroup>
            </View>

            {
                selectedMemorizeIndex === 1
                    ?
                    <View>
                        <View className='mb-2'>
                            <Text category='h6' className='mb-2' >
                                من السورة
                            </Text>
                            <Select
                                size='large'
                                placeholder='Default'
                                value={displayQuranChapterStartValue}
                                selectedIndex={selectedQuranChapterStartIndex}
                                // onSelect={(index: any) => handleRiwayaSelection(index)}
                                onSelect={(index: any) => setSelectedQuranChapterStartIndex(index)}
                            >
                                {
                                    quranChapers.map((chapter, index) => (
                                        <SelectItem key={index} title={(index + 1) + "-" + chapter.name} />
                                    ))
                                }

                            </Select>

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

                        <View className='mb-2'>
                            <Text category='h6' className='mb-2' >
                                إلى السورة
                            </Text>
                            <Select
                                size='large'
                                placeholder='Default'
                                value={displayQuranChapterEndValue}
                                selectedIndex={selectedQuranChapterEndIndex}
                                // onSelect={(index: any) => handleRiwayaSelection(index)}
                                onSelect={(index: any) => setSelectedQuranChapterEndIndex(index)}
                            >
                                {
                                    quranChapers.map((chapter, index) => (
                                        <SelectItem key={index} title={(index + 1) + "-" + chapter.name} />
                                    ))
                                }

                            </Select>

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
                        </View>
                    </View>
                    :

                    <View className='my-2'>
                        <Text category='h6' className='mb-2' >
                            كم بعد حصة الحفظ؟
                        </Text>

                        <Input
                            textStyle={{
                                textAlign: "right",
                            }}
                            placeholder='3'
                            keyboardType='numeric'
                        />

                    </View>
            }

        </View>

    )
}

const styles = StyleSheet.create({})