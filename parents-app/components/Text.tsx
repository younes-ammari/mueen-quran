import { StyleSheet, Text as RNText, View } from 'react-native'
import React from 'react'
import { Text as KittenText, TextProps } from '@ui-kitten/components'

export default function Text(props: TextProps) {
    const fontsFamily = {
        h1: "Cairo-Bold",
        h2: "Cairo-Bold",
        h3: "Cairo-Bold",
        h4: "Cairo-Bold",
        h5: "Cairo-Bold",
        h6: "Cairo-Bold",
        s1: "Cairo-Medium",
        s2: "Cairo-Medium",
        p1: "Cairo-Regular",
        p2: "Cairo-Regular",
        c1: "Cairo-Regular",
        c2: "Cairo-Regular",
        label: "Cairo-Bold",
    }
    return (
        <KittenText {...props}>
            <RNText className={props.className} style={{
                fontFamily: fontsFamily[props?.category as keyof typeof fontsFamily]
            }}>
                {props.children}
            </RNText>
        </KittenText>
    )
}

const styles = StyleSheet.create({})