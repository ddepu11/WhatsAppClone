import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import {
  RTCPeerConnection,
  MediaStream,
  mediaDevices,
} from "react-native-webrtc";
import { useAppSelector } from "../../../../redux/store";
import Peer from "react-native-peerjs";

const configuration = {
  iceServers: [{ url: "stun:stun.l.google.com:19302" }],
};

const useShowMessageScreenHeaderLogic = (otherPersonId: string) => {
  const navigation = useNavigation();

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const { id, firstName, lastName } = useAppSelector(
    (state) => state.user.value
  );

  const [gettingCall, setGetingCall] = useState(false);
  const [makingCall, setMakingCall] = useState(false);
  const [callPicked, setCallPicked] = useState(false);

  const [areYouTalking, setAreYouTalking] = useState(false);

  const pc = useRef<RTCPeerConnection>();

  const incomingCallRef = useRef<any>();
  const makingCallRef = useRef<any>();

  // `p${id}h`
  const localPeer = useRef<any>();
  const remotePeer = useRef<any>();

  // Initiate local Peer
  useEffect(() => {
    if (localPeer.current) {
      // If disconnectd reconnect
      if (localPeer.current.disconnected) {
        localPeer.current.reconnect(`p${id}h`);
      } else {
        localPeer.current = new Peer(`p${id}h`);
      }
    } else {
      localPeer.current = new Peer(`p${id}h`);
    }

    if (localPeer.current) {
      localPeer.current.on("open", (localPeerId: any) => {
        console.log(`${firstName} ${lastName} open with ID`, localPeerId);
      });

      localPeer.current.on("call", function (call: any) {
        incomingCallRef.current = call;
        setGetingCall(true);
        // Answer the call, providing our mediaStream

        call.on("close", function () {
          console.log("Stream Closed!!!");
          setGetingCall(false);
          setMakingCall(false);
          setAreYouTalking(false);
          setCallPicked(false);
        });
      });

      // Receive a connection
      localPeer.current.on("connection", (conn: any) => {
        console.log(`${firstName} ${lastName} has received connection.`);

        conn.on("error", console.log);

        conn.on("open", () => {
          console.log(`${firstName} ${lastName} opened connection.`);

          // console.log("conn", conn);

          conn.on("data", (data: any) => console.log(`Received Data: `, data));

          // console.log(`${firstName} ${lastName} sending data.`);

          // conn.send(`Hello, this is the ${firstName} ${lastName}`);
        });
      });

      localPeer.current.on("disconnected", () => {
        console.log(`${firstName} ${lastName} connection is DISCONNECTED`);
      });

      localPeer.current.on("close", () => {
        console.log(`${firstName} ${lastName} connection is CLOSE`);
      });

      localPeer.current.on("error", function (err: any) {
        console.log(
          `An ERROR occured connection is CLOSE, Error type: ${err.type}`
        );
      });
    }

    return () => {
      if (localPeer.current) {
        localPeer.current.disconnect();
        // localPeer.current.destroy();
        console.log("Local peer is Disconnected");
      }

      if (remotePeer.current) {
        remotePeer.current.disconnect();
        // remotePeer.current.destroy();
        console.log("Remote peer is Disconnected");
      }
    };
  }, []);

  // Get Stream
  useEffect(() => {
    const getStream = async () => {
      pc.current = new RTCPeerConnection(configuration);

      let sourceInfos = await mediaDevices.enumerateDevices();

      // console.warn({ sourceInfos });

      // let audioSourceId;

      // for (let i = 0; i < sourceInfos.length; i++) {
      //   const sourceInfo = sourceInfos[i];
      //   if (sourceInfo.kind == "audioinput") {
      //     audioSourceId = sourceInfo.deviceId;
      //   }
      // }

      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      if (typeof stream !== "boolean") {
        setLocalStream(stream);
        pc.current.addStream(stream);
      }
    };

    if (localPeer.current) {
      getStream();
    }
  }, [localPeer.current]);

  const hanleMakeVoiceCall = async () => {
    if (localStream) {
      remotePeer.current = localPeer.current.connect(`p${otherPersonId}h`);

      makingCallRef.current = localPeer.current.call(
        `p${otherPersonId}h`,
        localStream
      );

      setMakingCall(true);

      if (makingCallRef.current) {
        makingCallRef.current.on("stream", function (stream: MediaStream) {
          console.log("Got a remote stream!!!");
          setCallPicked(true);
          setRemoteStream(stream);
          // `stream` is the MediaStream of the remote peer.
          // Here you'd add it to an HTML video/canvas element.
        });

        makingCallRef.current.on("close", function () {
          console.log("Remote stream closed!!!");
          setGetingCall(false);
          setMakingCall(false);
          setAreYouTalking(false);
          setCallPicked(false);
        });
      }
    }
  };

  const hanleMakeVideoCall = () => {};

  const handleNavigateBack = () => {
    navigation.goBack();
  };

  const handleAnswereCall = () => {
    if (incomingCallRef.current) {
      incomingCallRef.current.answer(localStream);
      setGetingCall(false);
      setAreYouTalking(true);
    }
  };

  const handleDenyCall = () => {
    if (incomingCallRef.current) {
      incomingCallRef.current.close();
      setGetingCall(false);
      setAreYouTalking(false);
    }
  };

  const handleEndCall = () => {
    if (incomingCallRef.current) {
      incomingCallRef.current.close();
    }

    if (makingCallRef.current) {
      makingCallRef.current.close();
    }

    setGetingCall(false);
    setMakingCall(false);
    setAreYouTalking(false);
    setCallPicked(false);
  };

  return {
    hanleMakeVoiceCall,
    hanleMakeVideoCall,
    handleNavigateBack,
    gettingCall,
    areYouTalking,
    handleAnswereCall,
    handleDenyCall,
    handleEndCall,
    makingCall,
    callPicked,
  };
};

export default useShowMessageScreenHeaderLogic;
