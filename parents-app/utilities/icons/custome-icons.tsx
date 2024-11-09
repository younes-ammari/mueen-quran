import { Feather, FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet } from "react-native";

import { Icon, IconProps } from "@ui-kitten/components";

const iconsPacks = {
  "feather": (props: any) => <Feather height={props.size ? props.size : props.height} width={props.size ? props.size : props.height} {...props} />,
  "ionicons": (props: any) => <Ionicons height={props.size ? props.size : props.height} width={props.size ? props.size : props.height} {...props} />,
  "material-icons": (props: any) => <MaterialIcons height={props.size ? props.size : props.height} width={props.size ? props.size : props.height} {...props} />,
  "material-community-icons": (props: any) => <MaterialCommunityIcons height={props.size ? props.size : props.height} width={props.size ? props.size : props.height} {...props} />,
  "font-awesome6": (props: any) => <FontAwesome6 height={props.size ? props.size : props.size} width={props.size ? props.size : props.height} {...props} />,
};

const CustomeIcon = (props: IconProps) => {

  return props.pack && props.pack.length > 1 ? iconsPacks[props?.pack as keyof typeof iconsPacks](props) : (
    <Icon
      height={props.height ? props.height : props.size}
      width={props.size ? props.size : props.height}
      {...props} 
      
    />
  )
};
export default CustomeIcon;
