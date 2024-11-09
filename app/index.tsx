import { StatusBar } from "expo-status-bar";
import { Alert as RNAlert, Appearance, ColorSchemeName, Dimensions, Image, Keyboard, Linking, Text, TextInput, TouchableOpacity, View, Platform } from "react-native";
import ytdl from "react-native-ytdl";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MoonIcon, SunIcon } from "react-native-heroicons/outline";

const { width, height } = Dimensions.get("window");

const showAlert = (title: string, message: string, buttons?: { text: string, onPress: () => void}[]) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}: ${message}`);
  } else {
    RNAlert.alert(title, message, buttons)
  }
}

export default function Index() {
  const [color, setColor] = useState<ColorSchemeName | null>(Appearance.getColorScheme());
  const [yturi, setUri] = useState<string>("");
  const [ytVideoLink, setYtVideoLink] = useState<string>("");
  const [ytAudioLink, setYtAudioLink] = useState<string>("");

  const changeMode = () => {
    if (color === 'dark') {
      setColor("light");
      Appearance.setColorScheme("light")
    } else {
      setColor("dark");
      Appearance.setColorScheme("dark");
    }
  };

  const downloadFromUrl = async () => {
    Keyboard.dismiss();
    if (yturi === "") {
      showAlert("Error", "Link box seems empty. Enter link to continue", [
        { text: "OK", onPress: () => "" },
      ]);
    } else {
      const youtubeURL = yturi;
      try {
        const basicInfo = await ytdl.getBasicInfo(youtubeURL);
        const title = basicInfo.videoDetails.title;
        const videoUrls = await ytdl(youtubeURL, { quality: "highestaudio" });
        const audioUrls = await ytdl(youtubeURL, {
          quality: "highestaudio",
          filter: "audioonly",
          format: "m4a",
        });
        const videoFinalUri = videoUrls[0].url;
        const audiFinalUri = audioUrls[0].url;

        showAlert("Link Generated", "Link has been generated, tap download now to donwload video",
          [{ text: "OK", onPress: () => "" }]
        );
        setYtVideoLink(`${videoFinalUri}&title=${title}`);
        setYtAudioLink(`${audiFinalUri}&title=${title}`);
      } catch (error) {
        showAlert("Error", "Failed to retrieve video information");
      }
    }
  };

  return (
    <View
      className={
        color === "light" ? " bg-white h-full w-full" : "bg-black h-full w-full"
      }
    >
      <SafeAreaView>
        <View className="w-full justify-between flex-row pt-2 pb-1 pl-3">
          <Text className={
            color === "light"
              ? " text-black text-2xl font-bold"
              : " text-white text-2xl font-bold"
          }
          >
            <Image className="h-10 w-10" source={require("../assets/images/logo.png")} />
            <Text className="text-red-500"> {" "}Y</Text>
            outube <Text className="text-red-500">D</Text>
            ownloader
          </Text>

          <View className=" h-8 w-8 pt-4 mr-5">
            <TouchableOpacity onPress={changeMode}>
              {color === "light" ? (
                <MoonIcon size={23} strokeWidth={2} color="black" />
              ) : (
                <SunIcon size={23} strokeWidth={2} color="white" />
              )}
            </TouchableOpacity>
          </View>
        </View>
        
        <View className="pt-60">
          <TextInput
            textAlignVertical="top"
            multiline
            className={
              color === "dark"
                ? "bg-gray-950 border-2 border-gray-200 text-white p-1 ml-auto mr-auto w-72 text-lg rounded-md"
                : "bg-white border-2 border-gray-900 text-black p-1 ml-auto mr-auto w-72 text-lg rounded-md"
            }
            placeholderTextColor="gray"
            placeholder="Enter your YouTube video URL here."
            onChangeText={setUri}
            value={yturi}
          />
          <TouchableOpacity
            className={
              color === "dark"
                ? "align-middle bg-white border-2 mt-10 rounded-xl w-48 pt-1 pb-1 mr-auto ml-auto"
                : "align-middle bg-black border-2 mt-10 rounded-xl w-48 pt-1 pb-1 mr-auto ml-auto"
              }
            onPress={downloadFromUrl}
          >
            <Text className={
              color === "dark"
                ? "text-black text-center text-lg"
                : "text-white text-center text-lg"
            }
          >
            Generate URL
          </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-48 ml-auto mr-auto"
            onPress={() => {
              if (ytVideoLink === "") {
                showAlert(
                  "Error",
                  "No link generated yet, please generate link first",
                  [{ text: "OK", onPress: () => ""}]
                );
              } else {
                Linking.openURL(ytVideoLink);
              }
            }}
          >
            <Text className="text-center bg-red-800 p-1 text-white text-xl mt-5 border-red-900 border-2 w-48 mr-auto ml-auto rounded-xl font-bold">
              Download Video
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-48 ml-auto mr-auto"
            onPress={() => {
              if (ytAudioLink === "") {
                showAlert(
                  "Error",
                  "No link generated yet, please generate link first",
                  [{ text: "OK", onPress: () => ""}]
                );
              } else {
                Linking.openURL(ytAudioLink);
              }
            }}
          >
            <Text className="text-center bg-red-800 p-1 text-white text-xl mt-5 border-red-900 border-2 w-48 mr-auto ml-auto rounded-xl font-bold">
              Download Audio
            </Text>
          </TouchableOpacity>
        </View>

        <StatusBar style={color === "light" ? "dark" : "light"} />
      </SafeAreaView>
    </View>
  );
}