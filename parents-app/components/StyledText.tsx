import { Text, TextProps } from "@ui-kitten/components";

export function TajawalText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'Tajawal-Regular' }]} />;
}
