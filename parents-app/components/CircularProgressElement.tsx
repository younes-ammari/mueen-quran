import { StyleSheet, View } from 'react-native'
import React from 'react'
import { EvaStatus } from '@ui-kitten/components/devsupport'
import { CircularProgressBar, Text } from '@ui-kitten/components'

type CircularProgressElementProps = {
    title: string,
    progress: number,
    status?: EvaStatus,
  }

  const CircularProgressElement = ({
    title,
    progress,
    status = 'primary',
  }: CircularProgressElementProps) => {
    return (
      <View className='w-fit flex items-center flex-col justify-start gap-y-1'>
        <CircularProgressBar status={status} progress={progress} />
        <Text category='s1' className='text-centers'>{title}</Text>
      </View>
    )
  }


export default CircularProgressElement


const styles = StyleSheet.create({})