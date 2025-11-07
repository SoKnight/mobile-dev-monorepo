import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";

export function useNavBarStyle() {
    useEffect(() => {
        NavigationBar.setButtonStyleAsync("dark")
    }, []);
}