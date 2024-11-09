import React from 'react';
import { Link, Tabs } from 'expo-router';
import { BottomNavigation, BottomNavigationTab, Button, Layout, Text } from '@ui-kitten/components';



import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { Icon } from '@ui-kitten/components';
import CustomeIcon from '@/utilities/icons/custome-icons';


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      tabBar={props => <BottomTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarStyle: {
          paddingVertical: 1,
        },
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        // headerShown: useClientOnlyValue(false, true),
        headerShown: false,

      }}
      initialRouteName='index'
    >

      {
        routes.map((route: any, index: number) => {
          // console.log(route);
          return (
            <Tabs.Screen key={index} name={route.route} />
          )
        })
      }
    </Tabs>
  );
}

const routes = [
  // { name: 'المشغل', icon: 'play', route: 'player', pack: "feather" },
  { name: 'إحصائيات', icon: 'pie-chart-outline', route: 'analytics' },
  { name: 'الرئيسية', icon: 'home-outline', route: 'index' },
];

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Icon>['name'];
}) {
  return <Icon size={28} {...props} />;
}

const BottomTabBar = ({ navigation, state }: any) => (
  <BottomNavigation
    style={{
      paddingTop: 7,
    }}
    indicatorStyle={{
      // backgroundColor: 'red',
      height: 1.5,
      // opacity:.3
      // display: 'none',
    }}
    selectedIndex={state.index}
    onSelect={index => navigation.navigate(state.routeNames[index])}>
    {
      routes.map((route: any, index: number) => {
        // console.log(route);
        return (
          <BottomNavigationTab key={index} title={route.name}
            icon={
              (props: any) => {

                // console.log(props.style);
                return (
                  <CustomeIcon
                    // size={props.style?.width}
                    size={22}
                    name={route.icon}
                    pack={route.pack}
                    color={props.style.tintColor}
                    {...props}
                  />)
              }

            }
          />
        )
      })
    }
  </BottomNavigation>
);
