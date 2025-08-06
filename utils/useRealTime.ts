// utils/useRealTime.ts - Simplified for minimal backend
import { useEffect, useRef } from 'react';
import {
  AudioChunk,
  ConnectionEstablished,
  ErrorMessage,
  ResponseCompleted,
  SessionReady
} from './types';

type Parameters = {
  // WebSocket event handlers
  onWebSocketOpen?: () => void;
  onWebSocketClose?: () => void;
  onWebSocketError?: (event: Event) => void;

  // Essential backend event handlers
  onReceivedError?: (message: ErrorMessage) => void;
  onReceivedSessionReady?: (message: SessionReady) => void;
  onReceivedConnectionEstablished?: (message: ConnectionEstablished) => void;
  onReceivedAudioChunk?: (message: AudioChunk) => void;
  onReceivedResponseCompleted?: (message: ResponseCompleted) => void;
};

export default function useRealTime({
  // WebSocket handlers
  onWebSocketOpen,
  onWebSocketClose,
  onWebSocketError,

  // Essential event handlers
  onReceivedError,
  onReceivedSessionReady,
  onReceivedConnectionEstablished,
  onReceivedAudioChunk,
  onReceivedResponseCompleted
}: Parameters) {

  const ws = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectInterval = 3000;



  const connect = () => {
    const wsUrl = `ws://0.tcp.in.ngrok.io:11636`;
    console.log("Connecting to WebSocket:", wsUrl);

    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log("WebSocket connected successfully");
      reconnectAttempts.current = 0;
      onWebSocketOpen?.();
    };
    
    ws.current.onclose = (event) => {
      console.log("WebSocket connection closed:", event.code, event.reason);
      onWebSocketClose?.();
      
      // Auto-reconnect logic
      if (reconnectAttempts.current < maxReconnectAttempts) {
        reconnectAttempts.current++;
        console.log(`Attempting to reconnect (${reconnectAttempts.current}/${maxReconnectAttempts}) in ${reconnectInterval}ms`);
        setTimeout(connect, reconnectInterval);
      }
    };
    
    ws.current.onerror = (e) => {
      console.error("WebSocket error:", e);
      onWebSocketError?.(e as any);
    };
    
    ws.current.onmessage = (event) => {
      handleMessage(event);
    };
  };

  const sendMessage = (msg: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      // console.log('Sending message', msg);
      ws.current.send(JSON.stringify(msg));
    } else {
      console.warn('WebSocket not ready');
    }
  };

  const addUserAudio = (data: { audio: string; format?: string; sample_rate?: number }) => {
    if (ws.current?.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket not ready, cannot send audio");
      return;
    }

    // console.log("🎤 Sending audio data to backend");

    const command = {
      type: "audio",
      audio: data.audio
    };

    try {
      sendMessage(command);
    } catch (error) {
      console.error("❌ Failed to send audio:", error);
    }
  };

  const handleMessage = (event: WebSocketMessageEvent) => {
    let message: any;
    try {
      message = JSON.parse(event.data);
    } catch (e) {
      console.error("Failed to parse JSON message:", e);
      return;
    }

    // console.log("🔽 Received message:", message.type);

    switch (message.type) {
      case "connection_established":
        console.log("🔗 Connection established with backend");
        onReceivedConnectionEstablished?.(message as ConnectionEstablished);
        break;

      case "session_ready":
        console.log("✅ Session ready");
        onReceivedSessionReady?.(message as SessionReady);
        break;

      case "audio_chunk":
        console.log("🔊 Received audio chunk");
        onReceivedAudioChunk?.(message as AudioChunk);
        break;

      case "response_completed":
        console.log("🔊 Received audio chunk end");
        onReceivedResponseCompleted?.(message as ResponseCompleted);
        break;


      case "error":
        console.error("🚫 Server error:", message.message);
        onReceivedError?.(message as ErrorMessage);
        break;

      default:
        console.log("❓ Unknown message type:", message.type);
    }
  };

  useEffect(() => {
    connect();
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  return {
    // Core functions
    addUserAudio,
    readyState: ws.current?.readyState ?? WebSocket.CLOSED
  };
}
