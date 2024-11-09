import { StyleSheet, View } from 'react-native'
import React from 'react'
import { EvaStatus } from '@ui-kitten/components/devsupport'
import { ProgressBar, Text } from '@ui-kitten/components'


type ProgressElementProps = {
    title: string,
    progress: number,
    status?: EvaStatus,
    hideContent?: boolean,
}

const ProgressElement = ({
    title,
    progress,
    hideContent = false,
    status = 'primary',
}: ProgressElementProps) => {
    return (
        <View className='w-full flex flex-col justify-start gap-y-2'>
            {
                !hideContent
                &&
                <View className='flex flex-row items-center justify-between gap-y-2'>
                    <Text category='s1' className='font-extrabold'>{progress * 100}%</Text>
                    <Text category='s1' className='text-centers'>{title}</Text>
                </View>
            }
            <ProgressBar status={status} progress={progress} style={{ height: 6 }} />
        </View>
    )
}



export default ProgressElement
