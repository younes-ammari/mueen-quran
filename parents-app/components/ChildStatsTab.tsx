import { GestureResponderEvent, StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Avatar } from '@ui-kitten/components'
import Text from './Text';
import { EvaSize, LiteralUnion } from '@ui-kitten/components/devsupport';

type ChildStatsTabProps = {
    onPress?: ((event: GestureResponderEvent) => void) | undefined,
    isSelected?: boolean,
    child: any,
    category?: LiteralUnion<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 's1' | 's2' | 'p1' | 'p2' | 'c1' | 'c2' | 'label'>,
    size?: EvaSize
}

const ChildStatsTab = ({
    onPress,
    isSelected,
    child,
    category = 'label',
    size = 'tiny'
}: ChildStatsTabProps) => {
    return (
        <TouchableOpacity
            className='pl-3 flex flex-col flex-1 items-center'
            onPress={onPress}
        >
            <View className='flex flex-row items-center gap-y-1 mb-1'>
                <Text category={category} className='text-center my-1 p-0'>{child.name}</Text>
                <Avatar
                    style={{ margin: 4 }}
                    size={size}
                    source={child.imageUri}
                />
            </View>
            <View className={`h-1 w-full round ed ${isSelected ? "bg-slate-800" : ""}`} />
        </TouchableOpacity>
    )
};



export default ChildStatsTab

