export type HistoryItem = {
    id: string;
    transcript: string;
};


export interface PlaybackState {
    isPlaying: boolean;
    queueLength: number;
    currentChunkId?: string;
  }
  

export type Message = {
    type: string;
    session_id?: string;
    timestamp?: string;
};

// Enhanced Error Types
export type ErrorMessage = Message & {
    type: "error";
    message: string;
    code: string;
    details?: string;
};

// Session Management Events
export type SessionReady = Message & {
    type: "session_ready";
    message: string;
};

export type ConnectionEstablished = Message & {
    type: "connection_established";
    model?: string;
    storage?: string;
};

// Voice Activity Detection Events
export type SpeechStarted = Message & {
    type: "speech_started";
};

export type SpeechStopped = Message & {
    type: "speech_stopped";
};

// Response Lifecycle Events
export type ResponseStarted = Message & {
    type: "response_started";
    response_id?: string;
};

export type ResponseCompleted = Message & {
    type: "response_completed";
    response_id?: string;
};

// Audio Streaming Events
export type AudioChunk = Message & {
    type: "audio_chunk";
    audio: string; // Base64 audio data
    id?: string;
    data?: string; // base64 encoded pcm16
    timestamp?: number;
};

export type AudioCompleted = Message & {
    type: "audio_completed";
};

// Text Streaming Events
export type TextChunk = Message & {
    type: "text_chunk";
    text: string;
};

export type TextCompleted = Message & {
    type: "text_completed";
    text: string;
};

// Transcription Events
export type UserTranscript = Message & {
    type: "user_transcript";
    transcript: string;
};

// Legacy Events (for backward compatibility)
export type AudioResponse = {
    type: "audio";
    audio: string; // Base64 audio data
    mime_type?: string;
};

export type TurnComplete = {
    type: "turn_complete";
};

// Client Commands
export type AudioCommand = {
    type: "audio";
    audio: string; // Base64 audio data
    format?: string;
    sample_rate?: number;
};

export type UserMessageCommand = {
    type: "user_message";
    text: string;
};

export type InterruptCommand = {
    type: "interrupt";
};

export type ClearAudioBufferCommand = {
    type: "clear_audio_buffer";
};

// Session Configuration
export type SessionUpdateCommand = {
    type: "session.update";
    session: {
        modalities?: string[];
        instructions?: string;
        voice?: string;
        input_audio_format?: string;
        output_audio_format?: string;
        input_audio_transcription?: {
            model: string;
        };
        turn_detection?: {
            type: "server_vad" | "semantic_vad";
            threshold?: number;
            prefix_padding_ms?: number;
            silence_duration_ms?: number;
            create_response?: boolean;
        };
        tools?: any[];
        tool_choice?: string;
        temperature?: number;
        max_response_output_tokens?: number;
    };
};

// Input audio buffer commands
export type InputAudioBufferAppendCommand = {
    type: "input_audio_buffer.append";
    audio: string; // Base64 audio data
};

export type InputAudioBufferClearCommand = {
    type: "input_audio_buffer.clear";
};

// Azure OpenAI Events (for backward compatibility)
export type ResponseAudioDelta = {
    type: "response.audio.delta";
    delta: string; // Base64 audio data
};

export type ResponseAudioTranscriptDelta = {
    type: "response.audio_transcript.delta";
    delta: string; // Text transcript
};

export type ResponseDone = {
    type: "response.done";
};

export type ResponseInputAudioTranscriptionCompleted = {
    type: "conversation.item.input_audio_transcription.completed";
    item_id: string;
    content_index: number;
    transcript: string;
};

// Union type for all possible events from backend
export type BackendEvent =
    | ErrorMessage
    | SessionReady
    | ConnectionEstablished
    | SpeechStarted
    | SpeechStopped
    | ResponseStarted
    | ResponseCompleted
    | AudioChunk
    | AudioCompleted
    | TextChunk
    | TextCompleted
    | UserTranscript
    | AudioResponse
    | TurnComplete
    | ResponseAudioDelta
    | ResponseAudioTranscriptDelta
    | ResponseDone
    | ResponseInputAudioTranscriptionCompleted;

// Union type for all possible commands to backend
export type ClientCommand =
    | AudioCommand
    | UserMessageCommand
    | InterruptCommand
    | ClearAudioBufferCommand
    | SessionUpdateCommand
    | InputAudioBufferAppendCommand
    | InputAudioBufferClearCommand;
